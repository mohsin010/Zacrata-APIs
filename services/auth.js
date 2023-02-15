const AdminService = require('./admin')
const BuyerService = require('./buyer')
const SellerService = require('./seller')
class AuthService {
    async getUser(request, type) {
        switch (type) {
            case 1:
                return AdminService.getAdmin(request);
            case 2:
                return BuyerService.getBuyer(request);
            case 3:
                return SellerService.getSellerProfile(request);
            default:
                return null;
        }
    }

    async createUser(request, type) {
        switch (type) {
            case 1:
                return AdminService.createAdmin(request);
            case 2:
                return BuyerService.createBuyer(request);
            case 3:
            //       return CustomerService.createCustomer(request);
            default:
                return null;
        }
    }
    async updateUser(request, criteria, type) {
        switch (type) {
            case 1:
                return AdminService.updateAdmin(criteria, request);
            case 2:
                return BuyerService.updateBuyer(request, criteria);
            case 3:
                return SellerService.updateSellerForProfile(request, criteria);
            default:
                return null;
        }
    }
}

module.exports = new AuthService();