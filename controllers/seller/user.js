
//Services
const SellerService = require('../../services/seller')
const ResponseService = require('../../common/response')
//Helpers
const apiError = require('../../common/api-errors')
const messages = require('../../common/messages')

class SellerController {
    async getProfile(req, res) {
        try {
            const user_id = req._user_info._user_id;
            let seller = await SellerService.getSellerSimply({ _id: user_id });
            return res.status(200).send(ResponseService.success(seller))
        } catch (error) {
            return res.status(500).send(ResponseService.failure(e))
        }
    }

    async registerToken(req, res) {
        try {
            let user_id = req._user_info._user_id;
            let data = Object.assign({}, req.body)

            let seller = await SellerService.getSeller({ _id: user_id });
            if (!seller) throw new apiErrors.NotFoundError('seller');

            seller.fcm_token = data.fcm_token;
            seller = await seller.save();
            res.send(ResponseService.success(seller))
        } catch (error) {
            res.send(ResponseService.failure(error))
        }
    }
}

module.exports = new SellerController();