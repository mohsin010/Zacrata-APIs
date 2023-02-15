const CategoryService = require('../../services/category')
const ProductService = require('../../services/product')
const CartService = require('../../services/cart')
const ResponseService = require('../../common/response')
const apiErrors = require('../../common/api-errors')
const messages = require('../../common/messages')

const mongoose = require('mongoose');


class CartController {

    async getCart(req, res) {
        try {
            const user_id = req._user_info._user_id;




            let cart = await CartService.getCart({ buyer: user_id });
            if (!cart) return res.send(ResponseService.success({}, 'No Cart Created Yet', false));


            return res.send(ResponseService.success(cart));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async addToCart(req, res) {
        try {

            const user_id = req._user_info._user_id;

            var data = Object.assign({}, req.body);

            if (!data.category) throw new apiErrors.ValidationError('category', messages.CATEGORY_VALIDATION);
            if (!data.seller) throw new apiErrors.ValidationError('seller', messages.SELLER_VALIDATION);

            let isActive = await CategoryService.isActive({ _id: data.category });
            if (!isActive) throw new apiErrors.InActiveError('category');
            if (!data.item) throw new apiErrors.ValidationError('item', 'Item not found');
            if (!data.quantity) throw new apiErrors.ValidationError('quantity', 'Quantity not found');


            var product = await ProductService.getProduct({ _id: data.item });
            if (!product) throw new apiErrors.NotFoundError();


            if (data.quantity < 1) throw new apiErrors.ValidationError('quantity', 'Quantity should be equal or above 1');
            //    if (data.quantity >= 5) throw new apiErrors.ValidationError('quantity', 'Quantity should be equal or less 5');

            let itemData = {
                product: data.item,
                quantity: data.quantity,
                price: product.price,
            };

            let cart = await CartService.getCart({ buyer: user_id });

            let cartData;
            if (!cart) {
                cartData = {
                    buyer: user_id,
                    category: data.category,
                    items: [itemData],
                    seller: data.seller,
                    order_total: data.quantity * product.price
                }


                cart = await CartService.createCart(cartData);
            }
            else {
                cart.items.push(itemData);
                cart.order_total = cart.order_total + data.quantity * product.price
                cart.category = data.category,
                    cart = await cart.save();
            }


            cart = await CartService.getCart({ buyer: user_id });
            if (!cart) throw new apiErrors.ResourceNotFoundError()

            return res.send(ResponseService.success(cart));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async removeFromCart(req, res) {
        try {

            const user_id = req._user_info._user_id;

            var data = Object.assign({}, req.body);

            let cart = await CartService.getCartSimply({ buyer: user_id });
            if (!cart) throw new apiErrors.ResourceNotFoundError('cart', 'No Cart exists');
            if (!data.item) throw new apiErrors.ValidationError('item', 'Item not found');




            cart = await CartService.updateCart({ buyer: user_id }, { $pull: { items: { _id: data.item } }, order_total: cart.order_total - data.quantity * product.price });

            if (!cart) throw new apiErrors.ResourceNotFoundError()



            return res.send(ResponseService.success(cart));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async updateCart(req, res) {
        try {
            const user_id = req._user_info._user_id;
            var data = Object.assign({}, req.body);

            let cart = await CartService.getCartSimply({ buyer: user_id });
            if (!cart) throw new apiErrors.ResourceNotFoundError('cart', 'No Cart exists');
            if (!data.item) throw new apiErrors.ValidationError('item', 'Item not found');

            if (data.quantity < 1) throw new apiErrors.ValidationError('quantity', 'Quantity should be equal or above 1');
            cart.items.id(data.item).quantity = data.quantity;
            cart = await cart.save();
            cart = await CartService.getCart({ buyer: user_id });
            return res.send(ResponseService.success(cart));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }


    async deleteCart(req, res) {
        try {
            const user_id = req._user_info._user_id;

            let cart = await CartService.getCart({ buyer: user_id });
            if (!cart) return res.send(ResponseService.success({}, 'No Cart Created Yet', false));

            cart = await CartService.deleteCart({ buyer: user_id });

            return res.send(ResponseService.success(cart));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
}

module.exports = new CartController();