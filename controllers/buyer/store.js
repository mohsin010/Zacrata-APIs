const geolib = require('geolib');


const SellerService = require('./../../services/seller')
const BuyerService = require('./../../services/buyer')
const CountryService = require('./../../services/country')

const ProductService = require('./../../services/product')
const CategoryService = require('./../../services/category')
const UnitService = require('./../../services/unit')
const ProductController = require('./../../controllers/admin/products')
const OrderService = require('./../../services/order')

const ResponseService = require('../../common/response')
const mongoose = require('mongoose');
//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors');
const order = require('../../models/order');

class StoresController {

    async getStores(req, res) {
        try {
            let data = Object.assign({}, req.query);

            if (!data.latitude) throw new apiErrors.ValidationError('latitude', messages.LATITUDE);
            if (!data.longitude) throw new apiErrors.ValidationError('longitude', messages.LONGITUDE);

            const user_id = req._user_info._user_id;

            let buyer = await BuyerService.getBuyer({_id:user_id});

            let countryCode = buyer.mobile.split('+91');
            let code = countryCode.length > 1 ? 'in' : 'us';

            let country = await CountryService.getCountry({ code: code });

            let stores = await SellerService.getStoresForBuyer({ active: true,country:country._id });
            let calculatedStores = Array();
            stores.forEach(store => {
                if (store.products.length > 0) {
                    var distance = geolib.getPreciseDistance(
                        { latitude: data.latitude, longitude: data.longitude },
                        { latitude: store.store_address.geolocation.latitude, longitude: store.store_address.geolocation.longitude }
                    );
                    console.log(distance);
                    distance = geolib.convertDistance(distance, 'km');
                    var st = {
                        store_address: store.store_address,
                        store_types: store.store_types,
                        store_name: store.store_name,
                        store_contact_number: store.store_contact_number,
                        store_image: store.store_image,
                        _id: store._id
                    }
                    var s = Object.assign(st, { distance: distance });

                    calculatedStores.push(s);
                }
            });

            return res.status(200).send(ResponseService.success({ stores: calculatedStores }));

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getStoreDetail(req, res) {
        try {
            let data = Object.assign({}, req.query);

            if (!data.store) throw new apiErrors.ValidationError('store', messages.STORE_TYPE);


            let store = await SellerService.getSeller({ _id: data.store });
            if (!store) res.status(200).send(ResponseService.success({}, 'No Store Found', false));



            let storeProducts = Array();


            for (const element of store.products) {
                if (element.active)
                    storeProducts.push(new mongoose.Types.ObjectId(element.product));
            }

            let categories = await ProductService.aggregateCategories({
                "_id": { "$in": storeProducts },
                "active": true
            });

            categories = await CategoryService.categoryPopulate(categories, { path: 'category', select: 'title _id icon' });

            var st = {
                store_address: store.store_address,
                store_types: store.store_types,
                store_name: store.store_name,
                store_contact_number: store.store_contact_number,
                store_image: store.store_image,
                _id: store._id,
                categories: categories,
            }





            return res.status(200).send(ResponseService.success({ store: st }));

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getUsedStores(req, res) {
        try {

            const user_id = req._user_info._user_id;

            let data = Object.assign({}, req.query);

            let orders = await OrderService.getOrdersSimply({ buyer: user_id });

            console.log(orders)

            if(orders.length == 0) return res.send(ResponseService.success({}, 'No Store exists', false));
            let sellers = [];
            orders.forEach(element => {
                sellers.push(new mongoose.Types.ObjectId(element.seller));
            });

          

            if (!data.latitude) throw new apiErrors.ValidationError('latitude', messages.LATITUDE);
            if (!data.longitude) throw new apiErrors.ValidationError('longitude', messages.LONGITUDE);

            let stores = await SellerService.getStoresForBuyer({ _id: { '$in': sellers } }, { active: true });
            let calculatedStores = Array();
            stores.forEach(store => {
                if (store.products.length > 0) {
                    var distance = geolib.getPreciseDistance(
                        { latitude: data.latitude, longitude: data.longitude },
                        { latitude: store.store_address.geolocation.latitude, longitude: store.store_address.geolocation.longitude }
                    );
                    console.log(distance);
                    distance = geolib.convertDistance(distance, 'km');
                    var st = {
                        store_address: store.store_address,
                        store_types: store.store_types,
                        store_name: store.store_name,
                        store_contact_number: store.store_contact_number,
                        store_image: store.store_image,
                        _id: store._id
                    }
                    var s = Object.assign(st, { distance: distance });

                    calculatedStores.push(s);
                }
            });



            return res.status(200).send(ResponseService.success({ stores: calculatedStores }));

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getStoreProducts(req, res) {
        try {
            let data = Object.assign({}, req.query);

            if (!data.store) throw new apiErrors.ValidationError('store', messages.STORE_TYPE);
            if (!data.category) throw new apiErrors.ValidationError('category', messages.CATEGORY_VALIDATION);


            let store = await SellerService.getSeller({ _id: data.store });
            if (!store) res.status(200).send(ResponseService.success({}, 'No Store Found', false));



            let storeProducts = Array();


            for (const element of store.products) {
                if (element.active)
                    storeProducts.push(new mongoose.Types.ObjectId(element.product));
            }

            let products = await ProductService.aggregateProducts({
                "_id": { "$in": storeProducts },
                "active": true
            });

            products = await CategoryService.categoryPopulate(products, { path: 'category', select: 'title _id icon' });
            products = await UnitService.unitPopulate(products, { path: 'products.unit', select: 'title _id' });

            let keys = Object.keys(store.toObject()).filter(f => f !== products);
            // keys = keys.filter(f => f !== access_token);
            let s = {};
            keys.forEach(element => {
                s[element] = store[element];
            });

            s['grouped'] = products.filter(f => f.category._id == data.category);


            return res.status(200).send(ResponseService.success({ store: s }));

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }
    //added by mohsin
    async getProducts(req, res) {
        try {
            let data = Object.assign({}, req.query);

            // if (!data.store) throw new apiErrors.ValidationError('store', messages.STORE_TYPE);
            // if (!data.category) throw new apiErrors.ValidationError('category', messages.CATEGORY_VALIDATION);


            // let store = await SellerService.getSeller({ _id: data.store });
            // if (!store) res.status(200).send(ResponseService.success({}, 'No Store Found', false));



            let storeProducts = Array();


            

            let products = await ProductService.getAllProducts()



            return res.status(200).send(ResponseService.success({ products: products }));

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

}

module.exports = new StoresController();