const CategoryService = require('../../services/category')
const ProductService = require('../../services/product')
const OrderService = require('../../services/order')
const CartService = require('../../services/cart')
const ResponseService = require('../../common/response')
const apiErrors = require('../../common/api-errors')
const messages = require('../../common/messages')

const NotificationService = require('../../common/push-notification')
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');

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

            let orders = [];

            let type = data.type || 1;

            let criteria = { 'seller': user_id, 'status': 1 };


            if (type == 2) {
                criteria.status = 2;
            }
            if (type == 3) {
                criteria.status = { $gte: 2 };
            }


            orders = await OrderService.getOrdersForSeller(criteria);

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

    async manageOrderStatus(req, res) {
        try {
            var data = Object.assign({}, req.body);

            let notificationMessage = {};

            if (!data.order_id) throw new apiErrors.ValidationError('order_id', 'No order exists');

            let order = await OrderService.getOrder({ order_id: data.order_id });

            let message;

            if (!order) throw new apiErrors.ResourceNotFoundError('order', 'No order exists');

            if (order.status == 1) {
                message = 'Pack the items first'
                return res.send(ResponseService.success({}, message, false));
            }
            switch (order.status) {

                case 2:
                    order.status = 3;
                    order.end_time = Date.now();
                    message = 'Order has been delivered';
                    order = await order.save();
                    order = await OrderService.getOrder({ order_id: data.order_id });
                    notificationMessage = {
                        title: 'Thanks You',
                        body: 'Dear ' + order.buyer.name + '! We are happy to serve to!!'
                    }
                    await NotificationService.notifySingleDevice(
                        notificationMessage, order.buyer.fcm_token, {}
                    );
                    break;
                case 3:
                    message = 'Order has been already completed';
                    return res.send(ResponseService.success({}, message, false));

                case 4:
                    message = 'Order has been cancelled by customer';
                    return res.send(ResponseService.success({}, message, false));

            }

            order = await OrderService.getOrder({ order_id: data.order_id });

            return res.send(ResponseService.success(order, message, true));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async packTheOrder(req, res) {
        try {
            var data = Object.assign({}, req.body);

            if (!data.order_id) throw new apiErrors.ValidationError('order_id', messages.ORDER_ID_VALIDATION);
            let message;
            let order = await OrderService.getOrder({ order_id: data.order_id });

            if (!order) throw new apiErrors.ResourceNotFoundError('order', 'No order exists');
            if (!data.markedItems) throw new apiErrors.ValidationError('markedItems', 'Marked Items Required');
            let markedItems = data.markedItems.split(",").map(function (aval) { return new mongoose.Types.ObjectId(aval) });






            if (order.status != 1) {
                message = 'You cannot pack items at this stage';
                return res.send(ResponseService.success({}, message, false));
            }
            else if (order.status == 1) {

                markedItems.forEach(element => {
                    order.items.id(element).isPacked = true;
                });

                order.isPacked = true;
                order.status = 2;
                message = 'Your order has been packed';
                let notificationMessage = {
                    title: 'Order Ready',
                    body: 'Dear ' + order.buyer.name + '! Your Order with ID#' + order.order_id + ' is packed. Please Collect'
                }
                await NotificationService.notifySingleDevice(
                    notificationMessage, order.buyer.fcm_token, {}
                );
            }

            order = await order.save();
            order = await OrderService.getOrder({ order_id: data.order_id });

            return res.send(ResponseService.success(order, message, true));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async getDoc(req, res) {

      try {
        var hostname = req.headers.host; 
        console.log(hostname);
        const browser = await puppeteer.launch({args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.goto('http://'+hostname+'/api/seller/order/invoicelayout', { waitUntil: 'networkidle2' });
        const pdf = await page.pdf({ format: 'A4' });

        await browser.close();
    
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=report.pdf')
       // pdf.write(res);
        res.send(pdf);
      } catch (error) {
        return res.status(500).send(ResponseService.failure(error));
      }
    }

    async getInvoiceData(req, res) {

        try {

            res.render('report', {});

        } catch (e) {
            console.log('e', e)
            return res.status(500).send(ResponseService.failure(e));
        }

    }


    async addItemPackage() {

    }

}

module.exports = new OrderController();