const UnitService = require('../../services/unit')
const ResponseService = require('../../common/response')

//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors')

class UnitController {

    async addUnit(req, res) {
        try {
            let data = Object.assign({}, req.body);
            console.log('Unit Data', messages.arrowHead, data)

            if (!data.title) throw new apiErrors.ValidationError('title', messages.TITLE_VALIDATION)
         

            let unit = await UnitService.getUnit({ title: data.title });

            if (unit) throw new apiErrors.ResourceAlreadyExistError('Unit', messages.RESOURCE_ALREADY_EXISTS)
         
            unit  = await UnitService.addUnit(data);

            return res.status(200).send(ResponseService.success({ unit: unit }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getUnits(req, res) {
        try {

            let pageNo = parseInt(req.query.pageNo)
            let perPage = parseInt(req.query.perPage)
            let search = req.query.search || ''

            let filters = { title: new RegExp(search, 'i'), };

            let total = await UnitService.UnitTotalCount( filters)

            let units = await UnitService.getUnits(filters, perPage, pageNo)

            return res.status(200).send(ResponseService.success({ units, count: total }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }
}

module.exports = new UnitController();