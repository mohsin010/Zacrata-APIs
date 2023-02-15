const CategoryService = require('../../services/category')
const ProductService = require('../../services/product')
const OrderService = require('../../services/order')
const CartService = require('../../services/cart')
const ResponseService = require('../../common/response')
const NotificationService = require('../../common/push-notification')
const apiErrors = require('../../common/api-errors')
const messages = require('../../common/messages')

const mongoose = require('mongoose');

const cryptoRandomString = require('crypto-random-string')
class OrderController {

    async getOrder(req, res) {
        try {

            let data = Object.assign({}, req.query);
            if (!data.order_id) throw new apiErrors.ValidationError('order_id', 'Order ID Required')
            let order = await OrderService.getOrder({ order_id: data.order_id });
            if (!order) return res.send(ResponseService.success({}, 'No order exists', false));


            return res.send(ResponseService.success(order));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async getOrders(req, res) {
        try {
            const user_id = req._user_info._user_id;

            let data = Object.assign({}, req.query);

            let type = data.type || 1;

            let criteria = { 'buyer': user_id, 'status': { $gte: 1, $lte: 2 } };



            if (type == 2) {
                criteria.status = 3;
            }
            else if (type == 3) {
                criteria.status = 4;
            }

            console.log(criteria);

            let orders = await OrderService.getOrdersForSimplyBuyer(criteria);
            if (orders.length == 0) return res.send(ResponseService.success([], 'No order found', false));

            let newOrders = [];

            orders.forEach(order => {
                var o = order.toJSON();
                var newData = Object.assign(o, { totalProducts: order.items.length });

                var keys = Object.keys(newData);

                keys = keys.filter(f => f !== 'items');

                let newOrder = {};
                keys.forEach(key => {
                    newOrder[key] = newData[key];
                });

                newOrders.push(newOrder);
            });


            return res.send(ResponseService.success(newOrders));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async placeOrder(req, res) {
        try {

            const user_id = req._user_info._user_id;

            let cart = await CartService.getCart({ buyer: user_id });

            if (!cart) return res.send(ResponseService.success({}, 'No Cart Created Yet', false));

            let orderData;
            let uniqueId;
            let order;
            while (1) {
                uniqueId = cryptoRandomString({ length: 6 });

                order = await OrderService.getOrder({ order_id: uniqueId })
                if (!order) break;
                else continue;

            }

            orderData = {
                order_id: uniqueId,
                buyer: user_id,
                category: cart.category,
                items: cart.items,
                seller: cart.seller,
                order_total: cart.order_total
            }
            order = await OrderService.createOrder(orderData);



            order = await OrderService.getOrder({ order_id: uniqueId });
            if (!order) throw new apiErrors.ResourceNotFoundError()
            await CartService.deleteCart({ buyer: user_id });

            await NotificationService.notifySingleDevice(
                {
                    title: 'New Order',
                    body: 'Dear ' + order.seller.store_name + '! new Order with ID#' + order.order_id + ' has been arrived'
                }, order.seller.fcm_token, {'id':'1'}
            );

            return res.send(ResponseService.success(order));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async cancelOrderorder(req, res) {
        try {
            var data = Object.assign({}, req.body);
            if (!data.order_id) throw new apiErrors.ValidationError('order_id', 'No order exists');
            let order = await OrderService.getOrder({ order_id: data.order_id });
            if (!order) throw new apiErrors.ResourceNotFoundError('order', 'No order exists');

            order.status = 4;
            order.end_time = Date.now();
            order = await order.save();
            order = await OrderService.getOrder({ order_id: data.order_id });
            await NotificationService.notifySingleDevice(
                {
                    title: 'Order Cancelled',
                    body: 'Dear ' + order.seller.store_name + '! sorry inconvenience. The order with ID#' + order.order_id + ' has been cancelled'
                }, order.seller.fcm_token, {}
            );
            return res.send(ResponseService.success(order));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }



}

module.exports = new OrderController();