const Order = require('./../models/order')

class OrderService {

    createOrder(request) {
        return new Order(request).save();
    }

    getOrders(request) {
        return Order.find(request).populate([
            { path: 'items.product', select: '_id title description image price',populate: { path: 'unit', select: '_id title' }, },
            { path: 'category', select: '_id title icon' },
            { path: 'buyer', select: '_id name mobile' },
            { path: 'seller', select: '_id name store_contact_number store_address store_name store_image icon' }
        ]);
    }

    getOrdersForSeller(request) {
        return Order.find(request).populate([
            { path: 'category', select: '_id title icon' },
            { path: 'buyer', select: '_id name mobile fcm_token' },
        ]).select('-seller');
    }

    getOrderForSeller(request) {
        return Order.findOne(request).populate([
            { path: 'category', select: '_id title icon' },
            { path: 'buyer', select: '_id name mobile fcm_token' },
        ]).select('-seller');
    }

    getOrdersForSimplyBuyer(request) {
        return Order.find(request).populate([
            { path: 'category', select: '_id title icon' },
            { path: 'seller', select: '_id name store_contact_number fcm_token store_address store_name store_image icon' },
        ]).select('-buyer');
    }

    getOrdersForCustomer(request) {
        return Order.find(request).populate([
            { path: 'items.product', select: '_id title description image price',populate: { path: 'unit', select: '_id title' }, },
            { path: 'category', select: '_id title icon' },
            { path: 'buyer', select: '_id name mobile' },
            { path: 'seller', select: '_id name store_contact_number fcm_token store_address store_name store_image icon' }
        ]);
    }

    getOrderSimply(request) {
        return Order.findOne(request);
    }
    getOrdersSimply(request) {
        return Order.find(request);
    }

    getOrder(request) {
        return Order.findOne(request).populate([
            { path: 'items.product', select: '_id title description image price',populate: { path: 'unit', select: '_id title' }, },
            { path: 'category', select: '_id title icon' },
            { path: 'buyer', select: '_id name mobile fcm_token' },
            { path: 'seller', select: '_id name fcm_token store_contact_number store_address store_name store_image icon' }
        ]);
    }

    OrderTotalCount(request) {
        return Order.countDocuments(request);
    }

    updateOrder(request, criteria) {
        return Order.findOneAndUpdate(request, criteria, { new: true }).populate([
            { path: 'items.product', select: '_id title description image price',populate: { path: 'unit', select: '_id title' }, },
            { path: 'category', select: '_id title icon' },
            { path: 'buyer', select: '_id name fcm_token mobile' },
            { path: 'seller', select: '_id name fcm_token store_contact_number store_address store_name store_image icon' }
        ]);
    }

    deleteOrder(request) {
        return Order.findOneAndDelete(request).populate([
            { path: 'items.product', select: '_id title description image price',populate: { path: 'unit', select: '_id title' }, },
            { path: 'category', select: '_id title icon' },
            { path: 'buyer', select: '_id name fcm_token mobile' },
            { path: 'seller', select: '_id name fcm_token store_contact_number store_address store_name store_image icon' }
        ]);
    }
}

module.exports = new OrderService();