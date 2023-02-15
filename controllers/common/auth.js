const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const path = require('path').resolve
const config = require(path('config/constants'))


const apiError = require('../../common/api-errors')
const messages = require('../../common/messages')
const AuthService = require('../../services/auth')
const ResponseService = require('../../common/response')
const AdminService = require('../../services/admin')
const BuyerService = require('../../services/buyer')
const SellerService = require('../../services/seller')

class AuthController {
    async login(req, res) {
        try {
            let request = Object.assign({}, req.body);
            let type = this.getUserType(req.baseUrl);

            if (!request.email) throw new apiError.ValidationError('email', messages.EMAIL_VALIDATION);
            request.email = request.email.toLowerCase()

            let user;

            if (!request.password) throw new apiError.ValidationError('password', messages.PASSWORD_VALIDATION)

            if (type == 1) {
                let email = request.email;
                user = await AuthService.getUser({ email: email }, type);
                if (!user) throw new apiError.UnAuthorizedError(messages.CREDIENTIALS_MISMATCH)
                if (user && !user.active) throw new apiError.UnAuthorizedError(messages.USER_BLOCK)

                let matchPassword = await bcrypt.compare(request.password, user.password);
                if (!matchPassword) throw new apiError.UnAuthorizedError(messages.CREDIENTIALS_MISMATCH)
            }



            user.password = null;

            let token = await this.getJwtAuthToken(user, type)
            user.access_token = token;


            if (request.fcm_token)
                user.fcm_token = request.fcm_token;



            let updateUser = await AuthService.updateUser(user, { _id: user._id }, type);

            if (!updateUser) throw new apiError.InternalServerError();

            let response = {
                token,
                user
            }

            return res.status(200).send(ResponseService.success(response))
        }
        catch (e) {
            return res.status(e.code || 500).send(ResponseService.failure(e))
        }
    }
    async register(req, res) {
        try {
            let type = this.getUserType(req.baseUrl);

            let data = Object.assign({}, req.body);

            if (!data.email) throw new apiError.ValidationError('email', messages.EMAIL_VALIDATION)

            data.email = data.email.toLowerCase();

            if (type == 1) {
                if (!data.password) throw new apiError.ValidationError('password', messages.PASSWORD_VALIDATION)
                if (!data.name) throw new apiError.ValidationError('name', messages.NAME_VALIDATION)
                if (!data.mobile) throw new apiError.ValidationError('name', messages.NAME_VALIDATION)



                let admin = await AdminService.getAdmin({ email: data.email });

                if (admin) throw new apiError.ResourceAlreadyExistError('email', messages.EMAIL_ALREADY_EXISTS)

                var salt = await bcrypt.genSaltSync(10)
                var hash = await bcrypt.hashSync(data.password, salt)

                if (!hash) throw errorHandler.InternalServerError()

                data.password = hash

                admin = await AuthService.createUser(data, type);
                if (!admin) throw new apiError.UnexpectedError();
                return res.status(200).send(ResponseService.success(admin))
            }
        }
        catch (e) {
            return res.status(500).send(ResponseService.failure(e))
        }
    }
    async buyerLogin(req, res) {
        try {
            let data = Object.assign({}, req.body);
            let type = this.getUserType(req.baseUrl);

            if (!data.mobile) throw new apiError.ValidationError('mobile', messages.MOBILE_VALIDATION);
            let buyer = await AuthService.getUser({ mobile: data.mobile }, type);
            if (!buyer) res.status(200).send(ResponseService.success({}, 'Buyer not exists against this mobile', false));


            let token = await this.getJwtAuthToken(buyer, type)
            buyer.access_token = token;


            buyer = await AuthService.updateUser(buyer, { _id: buyer._id }, type);

            if (!buyer) throw new apiError.InternalServerError();

            let response = {
                token,
                buyer
            }

            return res.status(200).send(ResponseService.success(response))
        }
        catch (e) {
            return res.status(e.code || 500).send(ResponseService.failure(e))
        }
    }

    async sellerLogin(req, res) {
        try {
            let data = Object.assign({}, req.body);
            let type = this.getUserType(req.baseUrl);

            if (!data.mobile) throw new apiError.ValidationError('mobile', messages.MOBILE_VALIDATION);
          
            let seller = await AuthService.getUser({ mobile: data.mobile }, type);
            if (!seller) res.status(200).send(ResponseService.success({}, 'Seller not exists against this mobile', false));


            let token =  this.getJwtAuthToken(seller, type)
            seller.access_token = token;


            seller = await seller.save();

            if (!seller) throw new apiError.InternalServerError();

            let response = {
                token,
                seller
            }

            return res.status(200).send(ResponseService.success(response))
        }
        catch (e) {
            return res.status(e.code || 500).send(ResponseService.failure(e))
        }
    }

    async buyerRegistration(req, res) {
        try {
            let type = this.getUserType(req.baseUrl);

            let data = Object.assign({}, req.body);

            if (!data.mobile) throw new apiError.ValidationError('mobile', messages.MOBILE_VALIDATION)
            if (!data.name) throw new apiError.ValidationError('name', messages.NAME_VALIDATION)
            if (!data.email) throw new apiError.ValidationError('email', messages.EMAIL_VALIDATION)

            let buyer = await BuyerService.getBuyer({ mobile: data.mobile });
            if (buyer) throw new apiError.ResourceAlreadyExistError('buyer', messages.BUYER_ALREADY_EXISTS)

            // if (!req.file) throw new apiError.ResourceNotFoundError('driving_license', messages.DRIVING_LICENSE_IMAGE)
            // data.driving_license = req.file.destination + '/' + req.file.filename;



            buyer = await AuthService.createUser(data, type);

            let token = await this.getJwtAuthToken(buyer, type)
            buyer.access_token = token;
            buyer = await buyer.save();
            if (!buyer) throw new apiError.UnexpectedError();
            return res.status(200).send(ResponseService.success({ buyer,token }))
        }
        catch (e) {
            return res.status(500).send(ResponseService.failure(e))
        }
    }



    async logout(req, res) {
        try {
            const user_id = req._user_info._user_id;
            const type = this.getUserType(req.baseUrl);
            console.log(user_id);
            let user = await AuthService.getUser({ _id: user_id }, type);
            if (!user) throw new apiError.ValidationError('token', messages.AUTHENTICATION_ERROR);

            let updateUser = await AuthService.updateUser({ is_logout: true, $unset: { auth_token: 1 } }, { _id: user_id }, type);
            if (!updateUser) throw new apiError.InternalServerError();
            res.send(ResponseService.success({ user: updateUser }));
        } catch (error) {

        }
    }

    getJwtAuthToken(user, type) {
        let jwtTokenArgs = {
            id: user._id,
            type: type,
        }
        return jwt.sign(jwtTokenArgs, config.authSecretToken)
    }
    getUserType(url) {
        let type = url.split('/')[2];

        switch (type) {
            case 'admin':
                return 1;
            case 'buyer':
                return 2;
            case 'seller':
                return 3;
            default:
                return 0;
        }
    }

}

module.exports = new AuthController();
