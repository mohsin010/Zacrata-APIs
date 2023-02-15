const Buyer = require('../models/buyer')
const messages = require('../common/messages')
class BuyerService {
    getBuyer(request) {
        return Buyer.findOne(request);
    }
    getBuyers(request) {
        return Buyer.find(request)
    }
    BuyerTotalCount(request) {
        return Buyer.countDocuments(request)
    } 
    createBuyer(request) {
        return new Buyer(request).save();
    }
    updateBuyer(details, criteria) {
        return Buyer.findByIdAndUpdate(criteria, details, { new: true })
    }
    deleteBuyer(criteria) {
        return Buyer.findOneAndDelete(criteria)
    }
}

module.exports = new BuyerService();