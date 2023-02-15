const ProductService = require('./../../services/product')
const ResponseService = require('./../../common/response')


const UnitService = require('./../../services/unit')
const CategoryService = require('./../../services/category')

//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors')
const mongoose = require('mongoose')
const HelperService = require('./../../common/helper')
class ProductController {

    async addProduct(req, res) {
        try {
            let data = Object.assign({}, req.body);

            if (!data.title) throw new apiErrors.ValidationError('title', messages.TITLE_VALIDATION)
            if (!data.price) throw new apiErrors.ValidationError('price', messages.PRICE_VALIDATION)
            if (!data.description) throw new apiErrors.ValidationError('description', messages.DESCRIPTION_VALIDATION)
            if (!data.unit) throw new apiErrors.ValidationError('unit', messages.UNIT_VALIDATION)
            if (!data.category) throw new apiErrors.ValidationError('category', messages.CATEGORY_VALIDATION)

            if (!data.countries) throw new apiErrors.ValidationError('countries', messages.COUNTRY_VALIDATION);



            let countries = data.countries.split(",").map(function (aval) { return new mongoose.Types.ObjectId(aval); });
            if (countries.length == 0) throw new apiErrors.ValidationError('countries', messages.COUNTRY_VALIDATION);
            let c = [];
            countries.forEach(element => {
                c.push({
                    country: element,
                    price: 0.0
                })
            });

            data.countries = c;


            let product = await ProductService.getProduct({ title: data.title, });

            if (product) throw new apiErrors.ResourceAlreadyExistError('product', messages.RESOURCE_ALREADY_EXISTS)


            if (!HelperService.isValidMongoID(data.unit)) throw new apiErrors.UnexpectedError('Invalid Unit ID format');
            if (!HelperService.isValidMongoID(data.category)) throw new apiErrors.UnexpectedError('Invalid Category ID format');

            let unit = await UnitService.getUnit({ _id: data.unit });
            if (!unit) throw new apiErrors.ResourceNotFoundError('unit', messages.RESOURCE_NOT_FOUND);

            let category = await CategoryService.getCategory({ _id: data.category });
            if (!category) throw new apiErrors.ResourceNotFoundError('category', messages.RESOURCE_NOT_FOUND);

            if (!req.file) throw new apiErrors.ResourceNotFoundError('icon', messages.IMAGE_VALIDATION)

            data.image = req.file.destination + '/' + req.file.filename;
            product = await ProductService.addProduct(data);
            if (!product) throw new apiErrors.UnexpectedError();

            product = await ProductService.getProduct({ _id: product._id });
            return res.status(200).send(ResponseService.success({ product: product }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getProducts(req, res) {
        try {

            let pageNo = parseInt(req.query.pageNo || 1)
            let perPage = parseInt(req.query.perPage || 10)
            let search = req.query.search || ''

            let data = Object.assign({}, req.query);
            let filters = { title: new RegExp(search, 'i'), };

            if (data.category) {
                filters['category'] = data.category
            }

            let products = await ProductService.getProducts(filters, perPage, pageNo);
            let total = await ProductService.ProductTotalCount();

            return res.status(200).send(ResponseService.success({ products: products, count: total }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

    async updateProduct(req, res) {
        try {
            let data = Object.assign({}, req.body);


            if (!data.product) throw new apiErrors.ValidationError('product', messages.PRODUCT_VALIDATION)



            let product = await ProductService.getProduct({ _id: data.product });

            if (!product) throw new apiErrors.ResourceAlreadyExistError('product', messages.RESOURCE_NOT_FOUND)

            if (data.unit) {
                if (!HelperService.isValidMongoID(data.unit)) throw new apiErrors.UnexpectedError('Invalid Unit ID format');
                let unit = await UnitService.getUnit({ _id: data.unit });
                if (!unit) throw new apiErrors.ResourceNotFoundError('unit', messages.RESOURCE_NOT_FOUND);
            }

            if (data.category) {
                if (!HelperService.isValidMongoID(data.category)) throw new apiErrors.UnexpectedError('Invalid Category ID format');
                let category = await CategoryService.getCategory({ _id: data.category });
                if (!category) throw new apiErrors.ResourceNotFoundError('category', messages.RESOURCE_NOT_FOUND);
            }


            if (req.file) data.image = req.file.destination + '/' + req.file.filename;

            let countries = data.countries.split(",")
            let countries2 = []

            for (let i = 0; i < countries.length; i++) {
                let obj = {
                    country: countries[i]
                }
                countries2.push(obj)
            }
            data.countries = countries2
            let id = data.product
            delete data.product
            product = await ProductService.update({ _id: id }, data);
            if (!product) throw new apiErrors.UnexpectedError();

            product = await ProductService.getProducts();
            return res.status(200).send(ResponseService.success({ product: product }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async toggleProduct(req, res) {
        try {
            const user_id = req._user_info._user_id;
            let data = Object.assign({}, req.body);
            if (!data.product) throw new apiErrors.ValidationError('product', 'product id is invalid');
            let product = await ProductService.getProduct({ _id: data.product });
            if (!product) throw new apiErrors.ValidationError('product', 'product is not found');

            if (product.active == true) {
                product.active = false
            } else {
                product.active = true
            }
            product = await product.save();
            // category = await CategoryService.getCategories({ _id: user_id });
            let products = await ProductService.getProducts()

            return res.status(200).send(ResponseService.success({ product: products }))
        } catch (e) {
            return res.status(500).send(ResponseService.failure(e))
        }
    }

    async deleteProduct(req, res) {
        try {
            let data = Object.assign({}, req.body);
            if (!data.product) throw new apiErrors.ValidationError('product', messages.PRODUCT_VALIDATION);
            let product = await ProductService.getProduct({ _id: data.product });
            if (!product) throw new apiErrors.NotFoundError();

            product = await ProductService.deleteProduct({ _id: data.product });

            let products = await ProductService.getProducts()

            return res.status(200).send(ResponseService.success({ product: products }))
        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getProduct(req, res) {
        try {

            let data = Object.assign({}, req.params);

            let product = await ProductService.getProduct({ _id: data.id })
            if (!product) throw new apiErrors.ResourceNotFoundError('product', 'Invalid product id')
            return res.status(200).send(ResponseService.success(product))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

    async getExcludedProducts(seller) {


        let sellerProducts = [];
        seller.products.forEach(element => {
            sellerProducts.push(new mongoose.Types.ObjectId(element.product));
        });
        let products = await ProductService.getProducts({ "_id": { "$nin": sellerProducts }, "active": true });
        //   products = await CategoryService.categoryPopulate(products, { path: 'category', select: 'title _id icon' });
        //    products = await UnitService.unitPopulate(products, { path: 'products.unit', select: 'title _id' });
        return products;



    }

    async getIncludedProducts(seller) {

        let sellerProducts = [];
        seller.products.forEach(element => {
            sellerProducts.push(new mongoose.Types.ObjectId(element.product));
        });
        let products = await ProductService.getProducts({
            "_id": { "$in": sellerProducts },
            "active": true
        });
        //  products = await CategoryService.categoryPopulate(products, { path: 'category', select: 'title _id icon' });
        //   products = await UnitService.unitPopulate(products, { path: 'products.unit', select: 'title _id' });
        return products;


    }



}

module.exports = new ProductController();