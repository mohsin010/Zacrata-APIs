const StoreTypeService = require('../../services/store-type')
const ResponseService = require('../../common/response')

//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors')

class StoreTypeController {

    async addStoreType(req, res) {
        try {
            let data = Object.assign({}, req.body);
            console.log('StoreType Data', messages.arrowHead, data)

            if (!data.title) throw new apiErrors.ValidationError('title', messages.TITLE_VALIDATION)
         

            let StoreType = await StoreTypeService.getStoreType({ title: data.title });

            if (StoreType) throw new apiErrors.ResourceAlreadyExistError('storeType', messages.RESOURCE_ALREADY_EXISTS)
         
            StoreType  = await StoreTypeService.addStoreType(data);

            return res.status(200).send(ResponseService.success({ storeType: StoreType }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getStoreTypes(req, res) {
        try {

            let pageNo = parseInt(req.query.pageNo)
            let perPage = parseInt(req.query.perPage)
            let search = req.query.search || ''

            let filters = { title: new RegExp(search, 'i'), };

            let total = await StoreTypeService.StoreTypeTotalCount( filters)

            let storeTypes = await StoreTypeService.getStoreTypes(filters, perPage, pageNo)

            return res.status(200).send(ResponseService.success({ storeTypes, count: total }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }
}

module.exports = new StoreTypeController();