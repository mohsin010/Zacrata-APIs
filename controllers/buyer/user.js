const bcrpyt = require('bcryptjs')
//Services
const BuyerService = require('../../services/buyer')
const ResponseService = require('../../common/response')
//Helpers
const apiError = require('../../common/api-errors')
const messages = require('../../common/messages')

class BuyerController {
    async addBuyer(req, res) {
        try {
            let data = Object.assign({}, req.body);
            if (!data.email) throw new apiError.ValidationError('email', messages.EMAIL_VALIDATION)
            if (!data.password) throw new apiError.ValidationError('password', messages.PASSWORD_VALIDATION)

            data.email = data.email.toLowerCase();

            let Buyer = await BuyerService.getBuyer({ email: data.email });
            if (Buyer) throw new apiError.ValidationError('email', messages.EMAIL_ALREADY_EXISTS)

            var salt = await bcrpyt.genSaltSync(10)
            var hash = await bcrpyt.hashSync(data.password, salt)

            if (!hash) throw errorHandler.InternalServerError()

            data.password = hash

            let newBuyer = BuyerService.createBuyer(data);
            if (!newBuyer) throw new apiError.UnexpectedError();

            return res.status(200).send(ResponseService.success({ Buyer: newBuyer }))

        }
        catch (e) {
            return res.status(500).send(ResponseService.failure(e))
        }
    }

    async getBuyers(req, res) {
        try {
            let pageNo = parseInt(req.query.pageNo)
            let perPage = parseInt(req.query.perPage)
            let search = req.query.search || ''

            let total = await BuyerService.BuyerTotalCount({ email: new RegExp(search, 'i') })

            let Buyers = await BuyerService.getBuyers({ email: new RegExp(search, 'i') }, perPage, pageNo)

            return res.status(200).send(ResponseService.success({ Buyers, count: total }))

        }
        catch (e) {
            return res.status(500).send(ResponseService.failure(e))
        }
    }

    async getProfile(req, res) {
        try {
            const user_id = req._user_info._user_id;
            let buyer = await BuyerService.getBuyer({ _id: user_id });
            return res.status(200).send(ResponseService.success(buyer))
        } catch (error) {
            return res.status(500).send(ResponseService.failure(e))
        }
    }

    async updateProfile(req, res) {
        try {

            let data = Object.assign({},req.body);
            const user_id = req._user_info._user_id;
            let buyer = await BuyerService.getBuyer({ _id: user_id });
           
            if (data.name) buyer.name = data.name;



            if (req.file)
                buyer.driving_license = req.file.destination + '/' + req.file.filename;

            buyer = await buyer.save();
         
            return res.status(200).send(ResponseService.success(buyer))
        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async registerToken(req, res) {
        try {
            let user_id = req._user_info._user_id;
            let data = Object.assign({}, req.body)

            let buyer = await BuyerService.getBuyer({ _id: user_id });
            if (!buyer) throw new apiErrors.NotFoundError('buyer');

            buyer.fcm_token = data.fcm_token;
            buyer = await buyer.save();
            res.send(ResponseService.success(buyer))
        } catch (error) {
            res.send(ResponseService.failure(error))
        }
    }
    getJwtAuthToken(user, type) {
        let jwtTokenArgs = {
            id: user._id,
            type: type,
        }
        return jwt.sign(jwtTokenArgs, config.authSecretToken)
    }
}

module.exports = new BuyerController();