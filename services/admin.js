const Admin = require('../models/admin')
const messages = require('../common/messages')
class AdminService {
    getAdmin(request) {
        return Admin.findOne(request);
    }
    getAdmins(request) {
        return Admin.find(request)
    }
    adminTotalCount(request) {
        return Admin.countDocuments(request)
    }
    createAdmin(request) {
        return new Admin(request).save();
    }
    updateAdmin(details, criteria) {
        return Admin.findByIdAndUpdate(criteria, details, { new: true })
    }
    deleteAdmin(criteria) {
        return Admin.findOneAndDelete(criteria)
    }
}

module.exports = new AdminService();