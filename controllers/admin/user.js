const bcrpyt = require('bcryptjs')
//Services
const AdminService = require('../../services/admin')
const ResponseService = require('../../common/response')
//Helpers
const apiError = require('../../common/api-errors')
const messages = require('../../common/messages')

class AdminUserController {
    async addAdmin(req, res) {
        try {
            let data = Object.assign({}, req.body);
            if (!data.email) throw new apiError.ValidationError('email', messages.EMAIL_VALIDATION)
            if (!data.password) throw new apiError.ValidationError('password', messages.PASSWORD_VALIDATION)

            data.email = data.email.toLowerCase();

            let admin = await AdminService.getAdmin({ email: data.email });
            if (admin) throw new apiError.ValidationError('email', messages.EMAIL_ALREADY_EXISTS)

            var salt = await bcrpyt.genSaltSync(10)
            var hash = await bcrpyt.hashSync(data.password, salt)

            if (!hash) throw errorHandler.InternalServerError()

            data.password = hash
    
            let newAdmin = AdminService.createAdmin(data);
            if (!newAdmin) throw new apiError.UnexpectedError();

            return res.status(200).send(ResponseService.success({ admin: newAdmin }))

        }
        catch (e) {
            return res.status(500).send(ResponseService.failure(e))
        }
    }

    async getAdmins(req, res) {
        try {
            let pageNo = parseInt(req.query.pageNo)
            let perPage = parseInt(req.query.perPage)
            let search = req.query.search || ''

            let total = await AdminService.adminTotalCount({ email: new RegExp(search, 'i') })

            let admins = await AdminService.getAdmins({ email: new RegExp(search, 'i') }, perPage, pageNo)

            return res.status(200).send(ResponseService.success({ admins, count: total }))

        }
        catch (e) {
            return res.status(500).send(ResponseService.failure(e))
        }
    }
}

module.exports = new AdminUserController();