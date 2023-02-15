const Product = require('./../models/product')
class ProductService {
    addProduct(request) {
        return new Product(request).save();
    }
    getProducts(request, perPage, pageNo) {
        return Product.find(request).populate(
            [
                { path: 'unit', select: 'title _id' },
                { path: 'category', select: 'title icon _id' },
                { path: 'countries.country', },
            ],
        ).skip((pageNo - 1) * perPage).limit(perPage);
    }
    getProductsForAdmin(request, perPage, pageNo) {
        return Product.find(request).populate(
            [
                { path: 'unit', select: 'title _id' },
                { path: 'category', select: 'title icon _id' },
                { path: 'countries.country', },
            ],
        ).skip((pageNo - 1) * perPage).limit(perPage);
    }
    getProductsForCustomer(request) {
        return Product.find(request).populate(
            [
                { path: 'unit', select: 'title _id' },
                { path: 'category', select: 'title icon _id' },
                { path: 'countries.country', },
            ],
        ).where({ active: true });
    }
    getProduct(request) {
        return Product.findOne(request).populate(
            [
                { path: 'unit', select: 'title _id' },
                { path: 'category', select: 'title icon _id' },
                { path: 'countries.country', },
            ],
        );
    }
    getSimpleProduct(request) {
        return Product.findOne(request);
    }
    ProductTotalCount(request) {
        return Product.countDocuments(request);
    }

    updateProduct(request, criteria) {
        return Product.findOneAndUpdate(request, criteria).populate(
            [
                { path: 'unit', select: 'title _id' },
                { path: 'category', select: 'title icon _id' },
                { path: 'countries.country', },
            ],
        );
    }
    update(criteria, details){
        return Product.findOneAndUpdate(criteria, details)
    }

    deleteProduct(request) {
        return Product.findOneAndDelete(request).populate(
            [
                { path: 'unit', select: 'title _id' },
                { path: 'category', select: 'title icon _id' },
                { path: 'countries.country', },
            ],
        );
    }

    aggregateProducts(request) {
        return Product.aggregate(
            [
                {
                    "$match": request
                },
                {
                    "$group":
                    {
                        "_id": "$category",
                        "products":
                        {
                            "$addToSet":
                            {
                                _id: "$_id",
                                icon: '$image',
                                title: '$title',
                                description: '$description',
                                price: '$price',
                                unit: '$unit',
                                active: '$active'
                            }
                        },

                    }
                },
                {
                    "$project": {
                        "category": "$_id",
                        "_id": 0,
                        "products": 1
                    }
                }
            ]);
    }

    aggregateCategories(request) {
        return Product.aggregate(
            [
                {
                    "$match": request
                },
                {
                    "$group":
                    {
                        "_id": "$category",


                    }
                },
                {
                    "$project": {
                        "category": "$_id",
                        "_id": 0,
                    }
                }
            ]);
    }
    getAllProducts() {
        return Product.find().limit(6)
    }
}

module.exports = new ProductService();          
