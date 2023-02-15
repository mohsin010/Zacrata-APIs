const Unit = require('./../models/unit')
const messages = require('../common/messages')

class UnitService {
    addUnit(request) {
        return new Unit(request).save();
    }

    getUnits(request,perPage,pageNo) {
        return Unit.find(request).skip((pageNo-1)*perPage).limit(perPage);;
    }

    getUnit(request) {
        return Unit.findOne(request)
    }

    UnitTotalCount(request) {
        return Unit.countDocuments(request)
    }

    updateUnit(request, criteria) {
        return Unit.findOneAndUpdate(request, criteria, { new: true });
    }

    deleteUnit(request) {
        return Unit.findOneAndDelete(request);
    }
    unitPopulate(request,criteria){
        return Unit.populate(request,criteria);
    }
}

module.exports = new UnitService();