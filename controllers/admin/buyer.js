const BuyerService = require('../../services/buyer')
const ResponseService = require('../../common/response')

//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors')

class BuyerController {

    async getBuyers(req, res) {
        try {
            let data = Object.assign({}, req.body);

            let buyers = await BuyerService.getBuyers();


            return res.status(200).send(ResponseService.success({ buyers: buyers }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async toggleBuyer(req, res) {
        try {

            let data = Object.assign({}, req.body);
            if (!data.buyer) throw new apiErrors.ValidationError('buyer', 'buyer id is invalid');
            let buyer = await BuyerService.getBuyer({ _id: data.buyer });
            if (!buyer) throw new apiErrors.ValidationError('buyer', 'buyer is not found');

            if (buyer.active == true) {
                buyer.active = false
            } else {
                buyer.active = true
            }
            buyer = await buyer.save();

            
            let buyers = await BuyerService.getBuyers();


            return res.status(200).send(ResponseService.success({ buyers: buyers}))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

    async deleteBuyer(req, res) {
        try {

            let data = Object.assign({}, req.body);
            if (!data.buyer) throw new apiErrors.ValidationError('buyer', 'Buyer id is required');
            
            let buyer = await BuyerService.getBuyer({ _id: data.buyer });
            if (!buyer) throw new apiErrors.ResourceNotFoundError();

            buyer = await BuyerService.deleteBuyer({_id: data.buyer})
            


            let buyers = await BuyerService.getBuyers();


            return res.status(200).send(ResponseService.success({ buyers: buyers}))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }
}

module.exports = new BuyerController();