const Country = require('./../models/country')
const messages = require('../common/messages')

class CountryService {
    addCountry(request) {
        return new Country(request).save();
    }

    getCountries(request,perPage,pageNo) {
        return Country.find(request).skip((pageNo-1)*perPage).limit(perPage);;
    }

    getCountry(request) {
        return Country.findOne(request)
    }

    CountryTotalCount(request) {
        return Country.countDocuments(request)
    }

    updateCountry(request, criteria) {
        return Country.findOneAndUpdate(request, criteria, { new: true });
    }

    deleteCountry(request) {
        return Country.findOneAndDelete(request);
    }
    CountryPopulate(request,criteria){
        return Country.populate(request,criteria);
    }
}

module.exports = new CountryService();