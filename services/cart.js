const Cart = require('./../models/cart')

class CartService {

    createCart(request) {
        return new Cart(request).save();
    }

    getCarts(request, perPage, pageNo) {
        return Cart.find(request).skip((pageNo - 1) * perPage).limit(perPage);
    }

    getCartSimply(request) {
        return Cart.findOne(request);
    }

    getCart(request) {
        return Cart.findOne(request).populate([
            { path: 'items.product', select: '_id title description image price',populate: { path: 'unit', select: '_id title' }, },
            { path: 'category', select: '_id title icon' },
            { path: 'buyer', select: '_id name mobile' },
            { path: 'seller', select: '_id name store_contact_number store_address store_name store_image icon' }
        ]);
    }

    CartTotalCount(request) {
        return Cart.countDocuments(request);
    }

    updateCart(request, criteria) {
        return Cart.findOneAndUpdate(request, criteria, { new: true }).populate([
            { path: 'items.product', select: '_id title description image price',populate: { path: 'unit', select: '_id title' }, },
            { path: 'category', select: '_id title icon' },
            { path: 'buyer', select: '_id name mobile' },
            { path: 'seller', select: '_id name store_contact_number store_address store_name store_image icon' }
        ]);
    }

    deleteCart(request) {
        return Cart.findOneAndDelete(request).populate([
            { path: 'items.product', select: '_id title description image price',populate: { path: 'unit', select: '_id title' }, },
            { path: 'category', select: '_id title icon' },
            { path: 'buyer', select: '_id name mobile' },
            { path: 'seller', select: '_id name store_contact_number store_address store_name store_image icon' }
        ]);
    }
}

module.exports = new CartService();