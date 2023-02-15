const mongoose = require('mongoose')

class Helper {
    isValidMongoID(str) {
        return mongoose.Types.ObjectId.isValid(str);
    }
    paginate(array, page_number, page_size) {
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    }

}

module.exports = new Helper();