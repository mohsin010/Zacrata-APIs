const SellerService = require('./../../services/seller')
const CountryService = require('./../../services/country')
const ProductService = require('./../../services/product')

const ProductController = require('./../../controllers/admin/products')
const CategoryController = require('./../../controllers/admin/category')

const ResponseService = require('../../common/response')
const mongoose = require('mongoose');
//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors')

const async = require('async')
class SellerController {

    async addSeller(req, res) {
        try {
            let data = Object.assign({}, req.body);

            //s
            if (!data.name) throw new apiErrors.ValidationError('name', messages.NAME_VALIDATION)
            if (!data.email) throw new apiErrors.ValidationError('email', messages.EMAIL_VALIDATION)
            if (!data.mobile) throw new apiErrors.ValidationError('mobile', messages.MOBILE_VALIDATION)
            if (!data.store_name) throw new apiErrors.ValidationError('store_name', messages.STORE_NAME)
            if (!data.store_contact_number) throw new apiErrors.ValidationError('store_contact_number', messages.STORE_CONTACT_NUMBER)
            if (!data.address) throw new apiErrors.ValidationError('address', messages.STORE_ADDRESS)
            if (!data.latitude) throw new apiErrors.ValidationError('latitude', messages.LATITUDE)
            if (!data.longitude) throw new apiErrors.ValidationError('longitude', messages.LONGITUDE)
            if (!data.store_types || data.store_types.length == 0) throw new apiErrors.ValidationError('store_types', messages.STORE_TYPE)

            if (data.store_types) {
                let store_types = data.store_types.split(',').map(function (element) {

                    return element;
                });
                data['store_types'] = store_types;
            }


            let seller = await SellerService.getSeller({ email: data.email });

            if (seller) throw new apiErrors.ResourceAlreadyExistError('email')

            seller = await SellerService.getSeller({ mobile: data.mobile });

            if (seller) throw new apiErrors.ResourceAlreadyExistError('mobile')


            if (!req.files['avatar']) throw new apiErrors.ValidationError('avatar', messages.AVATAR_VALIDATION)
            if (!req.files['store_image']) throw new apiErrors.ValidationError('store_image', messages.STORE_IMAGE)

            data.avatar = req.files.avatar[0].destination + '/' + req.files.avatar[0].filename

            data.store_image = req.files.store_image[0].destination + '/' + req.files.store_image[0].filename

            data.store_address = {
                address: data.address,
                geolocation: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                }
            };


            let countryCode = data.mobile.split('+91');
            let code = countryCode.length > 1 ? 'in' : 'us';

            let country = await CountryService.getCountry({ code: code });

            data.country = country._id;
            seller = await SellerService.addSeller(data);
            seller = await SellerService.getSeller({ _id: seller._id });
            if (!seller) throw new apiErrors.UnexpectedError();


            return res.status(200).send(ResponseService.success({ seller: seller }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getSellers(req, res) {
        try {


            let data = Object.assign({}, req.query);
            let pageNo = parseInt(data.pageNo || 1)
            let perPage = parseInt(data.perPage || 10)
            let search = (data.search || '').toLowerCase();



            let filters = {};


            filters['name'] = new RegExp(search, 'i');
            if (data.email)
                filters['email'] = new RegExp(data.email, 'i');

            let total = await SellerService.SellerTotalCount(filters)

            let sellers = await SellerService.getSellers(filters, perPage, pageNo)

            return res.status(200).send(ResponseService.success({ sellers, count: total }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

    async updateSeller(req, res) {
        try {
            let data = Object.assign({}, req.body);


            if (!data.seller) throw new apiErrors.ValidationError('name', messages.SELLER_VALIDATION)

            let seller = await SellerService.getSeller({ _id: data.seller });

            if (!seller) throw new apiErrors.ResourceAlreadyExistError('seller', messages.RESOURCE_NOT_FOUND)



            if (req.files['avatar']) data.avatar = req.files.avatar[0].destination + '/' + req.files.avatar[0].filename



            if (req.files['store_image']) data.store_image = req.files.store_image[0].destination + '/' + req.files.store_image[0].filename



            if (data.address) seller.store_address.address = data.address;
            if (data.latitude) seller.store_address.geolocation.latitude = data.latitude;
            if (data.longitude) seller.store_address.geolocation.longitude = data.longitude;

            seller = await seller.save();
            seller = await SellerService.updateSeller({ _id: data.seller }, data);


            if (!seller) throw new apiErrors.UnexpectedError();


            return res.status(200).send(ResponseService.success({ seller: seller }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async toggleSeller(req, res) {
        try {
            const user_id = req._user_info._user_id;
            let data = Object.assign({}, req.body);
            if (!data.seller) throw new apiErrors.ValidationError('seller', 'seller id is invalid');
            let seller = await SellerService.getSeller({ _id: data.seller });
            if (!seller) throw new apiErrors.ValidationError('seller', 'seller is not found');

            if (seller.active == true) {
                seller.active = false
            } else {
                seller.active = true
            }
            seller = await seller.save();
            let sellers = await SellerService.getSellers()

            return res.status(200).send(ResponseService.success({ seller: sellers }))
        } catch (e) {
            return res.status(500).send(ResponseService.failure(e))
        }
    }
    async toggleSellerCategory(req, res) {
        try {
            let data = Object.assign({}, req.body);
            if (!data.category) throw new apiErrors.ValidationError('category', 'category id is invalid');
            let seller = await SellerService.getSeller({ _id: data.seller });
            if (!seller) throw new apiErrors.ValidationError('seller', 'seller is not found');
            let included = await CategoryController.getIncludedCategories(seller , seller.country);

           let category = included

            for (var i in inccategoryluded) {
                if (category[i]._id == data.category) {
                    if (category[i].active == true) {
                        category[i].active = false
                    } else {
                        category[i].active = true

                    }
                }
            }
            // console.log(included.toString())
            // let cat = await included.save()
            console.log(category)


            // if (seller.active == true) {
            //     seller.active = false
            // } else {
            //     seller.active = true
            // }
            // seller = await seller.save();
            // let sellers = await SellerService.getSellers()
            // console.log(sellers.toString())

            return res.status(200).send(ResponseService.success({ seller: sellers }))
        } catch (e) {
            return res.status(500).send(ResponseService.failure(e))
        }
    }

    async deleteSeller(req, res) {
        try {
            let data = Object.assign({}, req.body);
            if (!data.seller) throw new apiErrors.ValidationError('Seller', messages.Seller_VALIDATION);
            let Seller = await SellerService.getSeller({ _id: data.seller });
            if (!Seller) throw new apiErrors.NotFoundError();

            Seller = await SellerService.deleteSeller({ _id: data.seller })

            let sellers = await SellerService.getSellers()

            return res.status(200).send(ResponseService.success({ seller: sellers }))
        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getSeller(req, res) {
        try {

            let data = Object.assign({}, req.params);

            let Seller = await SellerService.getSeller({ _id: data.id })

            if (!Seller) throw new apiErrors.ResourceNotFoundError('Seller', 'Invalid Seller id')

            return res.status(200).send(ResponseService.success({ Seller: Seller }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

    async addProducts(req, res) {
        try {
            let data = Object.assign({}, req.body);
            let products = data.products;
            if (!data.seller) throw new apiErrors.ValidationError('seller', messages.SELLER_VALIDATION);
            if (!data.products) throw new apiErrors.ValidationError('products', messages.PRODUCT_VALIDATION);

            products = products.split(",").map(function (aval) { return new mongoose.Types.ObjectId(aval); });
            if (products.length == 0) throw new apiErrors.ValidationError('products', messages.PRODUCT_VALIDATION);



            let settledProducts = Array();

            products.forEach(element => {
                settledProducts.push({
                    active: true,
                    product: element
                });
            });


            let seller = await SellerService.updateSeller({ _id: data.seller }, { "$push": { products: settledProducts } });

            return res.status(200).send(ResponseService.success({ Seller: seller }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }
    async addCategories(req, res) {
        try {
            let data = Object.assign({}, req.body);
            let categories = data.categories;
            if (!data.seller) throw new apiErrors.ValidationError('seller', messages.SELLER_VALIDATION);
            if (!data.categories) throw new apiErrors.ValidationError('categories', messages.CATEGORY_VALIDATION);

            categories = categories.split(",").map(function (aval) { return new mongoose.Types.ObjectId(aval); });
            if (categories.length == 0) throw new apiErrors.ValidationError('categories', messages.CATEGORY_VALIDATION);


            for (const element of categories) {

                let products = await ProductService.getProducts({ category: element });
                if (products.length > 0) {
                    let settledProducts = Array();

                    products.forEach(element => {
                        settledProducts.push({
                            active: true,
                            product: element
                        });
                    });
                    await SellerService.updateSeller({ _id: data.seller }, { "$push": { products: settledProducts } });
                }
            }

            let seller = await SellerService.updateSeller({ _id: data.seller }, { "$push": { categories: categories } });
            let countryCode = seller.mobile.split('+91');
            let code = countryCode.length > 1 ? 'in' : 'us';

            let country = await CountryService.getCountry({ code: code });
            //   console.log(seller);
            let included = await CategoryController.getIncludedCategories(seller, country);
            let excluded = await CategoryController.getExcludedCategories(seller, country);


            let keys = Object.keys(seller.toObject()).filter(f => f !== 'categories');

            let sellerData = {};
            keys.forEach(element => {
                sellerData[element] = seller[element];
            });
            sellerData.groupedCategories = {
                included: included,
                excluded: excluded
            }

            return res.status(200).send(ResponseService.success({ Seller: sellerData }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async addStoreTypes(req, res) {
        try {
            let data = Object.assign({}, req.body);
            let store_types = data.store_types;
            if (!data.seller) throw new apiErrors.ValidationError('seller', messages.SELLER_VALIDATION);
            if (!data.store_types) throw new apiErrors.ValidationError('store_types', messages.STORE_TYPE);

            store_types = store_types.split(",").map(function (aval) { return new mongoose.Types.ObjectId(aval); });
            if (store_types.length == 0) throw new apiErrors.ValidationError('store_types', messages.STORE_TYPE);



            let seller = await SellerService.updateSeller({ _id: data.seller }, { "$push": { store_types: store_types } });

            return res.status(200).send(ResponseService.success({ seller: seller }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getProducts(req, res) {
        try {
            let data = Object.assign({}, req.query);

            if (!data.seller) throw new apiErrors.ValidationError('seller', messages.SELLER_VALIDATION);
            let seller = await SellerService.getSeller({ _id: data.seller });
            //   console.log(seller);
            let included = await ProductController.getIncludedProducts(seller);
            let excluded = await ProductController.getExcludedProducts(seller);

            let keys = Object.keys(seller.toObject()).filter(f => f !== 'products');

            let sellerData = {};
            keys.forEach(element => {
                sellerData[element] = seller[element];
            });
            sellerData.groupedProducts = {
                included: included,
                excluded: excluded
            }
            return res.status(200).send(ResponseService.success({ seller: sellerData }))



        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getCategories(req, res) {
        try {
            let data = Object.assign({}, req.query);

            if (!data.seller) throw new apiErrors.ValidationError('seller', messages.SELLER_VALIDATION);
            let seller = await SellerService.getSeller({ _id: data.seller });

            let countryCode = seller.mobile.split('+91');
            let code = countryCode.length > 1 ? 'in' : 'us';

            let country = await CountryService.getCountry({ code: code });
            //   console.log(seller);
            let included = await CategoryController.getIncludedCategories(seller, country);
            let excluded = await CategoryController.getExcludedCategories(seller, country);

            let keys = Object.keys(seller.toObject()).filter(f => f !== 'categories');

            let sellerData = {};
            keys.forEach(element => {
                sellerData[element] = seller[element];
            });
            sellerData.groupedCategories = {
                included: included,
                excluded: excluded
            }
            return res.status(200).send(ResponseService.success({ seller: sellerData }))



        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async removeProducts(req, res) {
        try {
            let data = Object.assign({}, req.body);
            let products = data.products;

            if (!data.seller) throw new apiErrors.ValidationError('seller', messages.SELLER_VALIDATION);
            if (!data.products) throw new apiErrors.ValidationError('products', messages.PRODUCT_VALIDATION);

            products = products.split(",").map(function (aval) { return new mongoose.Types.ObjectId(aval); });
            if (products.length == 0) throw new apiErrors.ValidationError('products', messages.PRODUCT_VALIDATION);




            for (const element of products) {

                await SellerService.updateSeller({ _id: data.seller }, { $pull: { 'products': { product: element } } })
            }


            let seller = await SellerService.getSeller({ _id: data.seller });

            let included = await ProductController.getIncludedProducts(seller);
            let excluded = await ProductController.getExcludedProducts(seller);



            let keys = Object.keys(seller.toObject()).filter(f => f !== 'products');

            let sellerData = {};
            keys.forEach(element => {
                sellerData[element] = seller[element];
            });
            sellerData.groupedProducts = {
                included: included,
                excluded: excluded
            }


            return res.status(200).send(ResponseService.success({ seller: sellerData }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async removeStoreTypes(req, res) {
        try {
            let data = Object.assign({}, req.body);
            let store_types = data.store_types;

            if (!data.seller) throw new apiErrors.ValidationError('seller', messages.SELLER_VALIDATION);
            if (!data.store_types) throw new apiErrors.ValidationError('store_types', messages.STORE_TYPE);

            store_types = store_types.split(",").map(function (aval) { return new mongoose.Types.ObjectId(aval); });
            if (store_types.length == 0) throw new apiErrors.ValidationError('store_types', messages.STORE_TYPE);


            for (const element of store_types) {

                await SellerService.updateSeller({ _id: data.seller }, { $pull: { 'store_types': element } })
            }

            let seller = await SellerService.getSeller({ _id: data.seller })



            return res.status(200).send(ResponseService.success({ seller: seller }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async removeCategory(req, res) {
        try {
            let data = Object.assign({}, req.body);


            if (!data.seller) throw new apiErrors.ValidationError('seller', messages.SELLER_VALIDATION);
            if (!data.categories) throw new apiErrors.ValidationError('categories', messages.CATEGORY_VALIDATION);
            let categories = data.categories;
            categories = categories.split(",").map(function (aval) { return new mongoose.Types.ObjectId(aval); });
            if (categories.length == 0) throw new apiErrors.ValidationError('categories', messages.CATEGORY_VALIDATION);


            for (const element of categories) {

                await SellerService.updateSeller({ _id: data.seller }, { $pull: { 'categories': element } })
            }

            let seller = await SellerService.getSeller({ _id: data.seller })

            let countryCode = seller.mobile.split('+91');
            let code = countryCode.length > 1 ? 'in' : 'us';

            let country = await CountryService.getCountry({ code: code });
            //   console.log(seller);
            let included = await CategoryController.getIncludedCategories(seller, country);
            let excluded = await CategoryController.getExcludedCategories(seller, country);



            let keys = Object.keys(seller.toObject()).filter(f => f !== 'categories');

            let sellerData = {};
            keys.forEach(element => {
                sellerData[element] = seller[element];
            });
            sellerData.groupedCategories = {
                included: included,
                excluded: excluded
            }


            return res.status(200).send(ResponseService.success({ seller: sellerData }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }



}

module.exports = new SellerController();