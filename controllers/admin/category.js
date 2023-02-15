const CategoryService = require('./../../services/category')
const ResponseService = require('../../common/response')

//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors')
const mongoose = require('mongoose')
const country = require('../../models/country')
class CategoryController {

    async addCategory(req, res) {
        try {
            let data = Object.assign({}, req.body);


            if (!data.title) throw new apiErrors.ValidationError('title', messages.TITLE_VALIDATION)


            let category = await CategoryService.getCategory({ title: data.title });

            if (category) throw new apiErrors.ResourceAlreadyExistError('category', messages.RESOURCE_ALREADY_EXISTS)

            if (!data.countries) throw new apiErrors.ValidationError('countries', messages.COUNTRY_VALIDATION);



            let countries = data.countries.split(",").map(function (aval) { return new mongoose.Types.ObjectId(aval); });
            if (countries.length == 0) throw new apiErrors.ValidationError('countries', messages.COUNTRY_VALIDATION);

            data.countries = countries;

            if (!req.file) throw new apiErrors.ResourceNotFoundError('icon', messages.IMAGE_VALIDATION)

            data.icon = req.file.destination + '/' + req.file.filename;


            category = await CategoryService.addCategory(data);
            if (!category) throw new apiErrors.UnexpectedError();
            category = await CategoryService.getCategory({ _id: category._id });


            return res.status(200).send(ResponseService.success({ category: category }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }
    async getCategories(req, res) {
        try {



            let pageNo = parseInt(req.query.pageNo || 1)
            let perPage = parseInt(req.query.perPage || 10)
            let search = (req.query.search || '').toLowerCase();

            let total = await CategoryService.CategoryTotalCount({ title: new RegExp(search, 'i'), })

            let categories = await CategoryService.getCategories({ title: new RegExp(search, 'i'), })

            return res.status(200).send(ResponseService.success({ categories, count: total }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }
    async updateCategory(req, res) {
        try {
            let data = Object.assign({}, req.body);
            if (!data.category) throw new apiErrors.ValidationError('category', messages.CATEGORY_VALIDATION);
            let category = await CategoryService.getCategory({ _id: data.category });
            if (!category) throw new apiErrors.NotFoundError();


            if (req.file)
                data.icon = req.file.destination + '/' + req.file.filename;

            category = await CategoryService.updateCategory({ _id: data.category }, data);
            return res.status(200).send(ResponseService.success({ category: category }))
        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async toggleCategory(req, res) {
        try {
            const user_id = req._user_info._user_id;
            let data = Object.assign({}, req.body);
            if (!data.category) throw new apiErrors.ValidationError('category', 'Category id is invalid');
            let category = await CategoryService.getCategory({ _id: data.category });
            if (!category) throw new apiErrors.ValidationError('category', 'Category is not found');

            if (category.active == true) {
                category.active = false
            } else {
                category.active = true
            }
            category = await category.save();
            // category = await CategoryService.getCategories({ _id: user_id });
            let categories = await CategoryService.getCategories()

            return res.status(200).send(ResponseService.success({ category: categories }))
        } catch (e) {
            return res.status(500).send(ResponseService.failure(e))
        }
    }

    async deleteCategory(req, res) {
        try {
            let data = Object.assign({}, req.body);
            if (!data.category) throw new apiErrors.ValidationError('category', messages.CATEGORY_VALIDATION);
            let category = await CategoryService.getCategory({ _id: data.category });
            if (!category) throw new apiErrors.NotFoundError();
            category = await CategoryService.deleteCategory({ _id: data.category });
            let categories = await CategoryService.getCategories()

            return res.status(200).send(ResponseService.success({ category: categories }))
        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getCategory(req, res) {
        try {

            let data = Object.assign({}, req.params);

            let category = await CategoryService.getCategory({ _id: data.id })

            if (!category) throw new apiErrors.ResourceNotFoundError('category', 'Invalid category id')

            return res.status(200).send(ResponseService.success({ category: category }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

    async getExcludedCategories(seller, country) {


        let sellerProducts = [];
        seller.categories.forEach(element => {
            sellerProducts.push(new mongoose.Types.ObjectId(element));
        });
        let categories = await CategoryService.getCategories({ "_id": { "$nin": sellerProducts }, "countries": { "$in": [country] } });
        //   products = await CategoryService.categoryPopulate(products, { path: 'category', select: 'title _id icon' });
        //    products = await UnitService.unitPopulate(products, { path: 'products.unit', select: 'title _id' });
        return categories;



    }

    async getIncludedCategories(seller, country) {

        let sellerProducts = [];
        seller.categories.forEach(element => {
            sellerProducts.push(new mongoose.Types.ObjectId(element));
        });
        let categories = await CategoryService.getCategories({
            "_id": { "$in": sellerProducts },
            "countries": { "$in": [country] }

        });
        //  products = await CategoryService.categoryPopulate(products, { path: 'category', select: 'title _id icon' });
        //   products = await UnitService.unitPopulate(products, { path: 'products.unit', select: 'title _id' });
        return categories;


    }
}

module.exports = new CategoryController();