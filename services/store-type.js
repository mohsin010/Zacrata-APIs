const StoreType = require('./../models/store-type')
const messages = require('../common/messages')

class StoreTypeService {
    addStoreType(request) {
        return new StoreType(request).save();
    }

    getStoreTypes(request,perPage,pageNo) {
        return StoreType.find(request).skip((pageNo-1)*perPage).limit(perPage);;
    }

    getStoreType(request) {
        return StoreType.findOne(request)
    }

    StoreTypeTotalCount(request) {
        return StoreType.countDocuments(request)
    }

    updateStoreType(request, criteria) {
        return StoreType.findOneAndUpdate(request, criteria, { new: true });
    }

    deleteStoreType(request) {
        return StoreType.findOneAndDelete(request);
    }
}

module.exports = new StoreTypeService();