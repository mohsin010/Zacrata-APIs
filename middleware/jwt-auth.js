const path = require('path').resolve;
const jsonwebtoken = require('jsonwebtoken')
const config = require(path('config/constants'))
const ResponseService = require(path('common/response'))
const AuthService = require('../services/auth')
const apiErrors = require('../common/api-errors');
module.exports = async (req, res, next) => {
    try {
        if (!req.headers.authorization) throw new apiErrors.UnAuthorizedError();
        const token = req.headers.authorization.split(" ")[1];
        const decode = jsonwebtoken.verify(token, config.authSecretToken);

        if (decode.type == 4) {
            let user = await AuthService.getUser({ _id: decode.id, auth_token: token }, decode.type);
            if (!user) throw new Error();
        }

        req._user_info = {
            _user_id: decode.id || undefined,
            _user_type: decode.type || undefined
        };

        console.log('Authenticated...')
        next()
    }
    catch (e) {
        return res.status(401).send(ResponseService.failure(e));
    }   
}