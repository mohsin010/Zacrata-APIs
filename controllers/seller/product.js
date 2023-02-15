
//Services
const SellerService = require('../../services/seller')
const ResponseService = require('../../common/response')
//Helpers
const apiError = require('../../common/api-errors')
const messages = require('../../common/messages')
const mongoose = require('mongoose')
class ProductController {
    async getProducts(req, res) {
        try {
            const user_id = req._user_info._user_id;
            let seller = await SellerService.getSellerProducts({ _id: user_id });
            return res.status(200).send(ResponseService.success({ products: seller.products }))
        } catch (e) {
            return res.status(500).send(ResponseService.failure(e))
        } 
    }

    async getAggregatedProducts(req, res) {
        try {
            const user_id = req._user_info._user_id;
            let sellerProducts = await SellerService.aggregateProducts({ '_id': new mongoose.Types.ObjectId(user_id)});
           
            sellerProducts = await SellerService.populateCategory(sellerProducts);
         //   products = await SellerService.populateUnit(products);
            return res.status(200).send(ResponseService.success( {sellerProducts}))
        } catch (e) {
            return res.status(500).send(ResponseService.failure(e))
        }
    }

    async updatePrice(req, res) {
        try {
            const user_id = req._user_info._user_id;
            let data= Object.assign({},req.body);

            let seller = await SellerService.getSellerProducts({ _id: user_id });
            
            seller.products.id(data.product).price  = data.price;
            seller = await seller.save();
          
            return res.status(200).send(ResponseService.success( seller))
        } catch (e) {
            return res.status(500).send(ResponseService.failure(e))
        }
    }

    async toggleProductStatus(req, res) {
        try {
            const user_id = req._user_info._user_id;
            let data = Object.assign({}, req.body);
            if (!data.product) throw new apiError.ValidationError('product', messages.PRODUCT_VALIDATION);
            let seller = await SellerService.getSeller({ _id: user_id });
            seller.products.id(data.product).active = !seller.products.id(data.product).active;
            seller = await seller.save();
            seller = await SellerService.getSellerProducts({ _id: user_id });
            return res.status(200).send(ResponseService.success({ products: seller.products }))
        } catch (e) {
            return res.status(500).send(ResponseService.failure(e))
        }
    }
}

module.exports = new ProductController();