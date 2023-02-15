const Seller = require('./../models/seller')
const Category = require('./../models/category')
const Unit = require('./../models/unit')
class SellerService {

    addSeller(request) {
        return new Seller(request).save();
    }

    getSellers(request, perPage, pageNo) {
        return Seller.find(request).populate([
            { path: 'store_types', select: '_id title' },
            { path: 'country'}
        ]).skip((pageNo - 1) * perPage).limit(perPage);
    }

    getStoresForBuyer(request) {
        return Seller.find(request).populate([
            { path: 'store_types', select: '_id title' },
            { path: 'country'}
        ]);
    }

    getActiveSellers(request) {
        return Seller.find(request).populate([
            { path: 'store_types', select: '_id title' },
            { path: 'country'}
        ]).where({ active: true });
    }

    getSeller(request) {
        return Seller.findOne(request).populate([
            { path: 'store_types', select: '_id title' },
            { path: 'country'}
        ]);
    }

    getSellerSimply(request) {
        return Seller.findOne(request).select('-store_types -products');
    }

    getSellerProducts(request) {
        return Seller.findOne(request).select('-store_types').populate({ path: 'products.product' });
    }

    aggregateProducts(request) {
        return Seller.aggregate(
            [
                {
                    "$match": request
                },
                {
                    "$unwind": '$products'
                },

                {
                    '$lookup': {
                        'from': 'products',
                        'localField': 'products.product',
                        'foreignField': '_id',
                        'as': 'products.product'
                    }
                },
                {
                    "$unwind": '$products.product'
                },
                {
                    "$group":
                    {
                        "_id": "$products.product.category",
                        "products":
                        {
                            "$push":
                            {
                                _id: "$products._id",
                                price: '$products.price',
                                active: '$products.active',
                                product: {
                                    title: '$products.product.title',
                                    description: '$products.product.description',
                                    image: '$products.product.image',
                                    //    unit:'$products.product.unit',
                                    //     price:'$products.product.price',
                                },



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

    populateUnit(data) {
        return Unit.populate(data, 'products.product.unit');
    }

    populateCategory(data) {
        return Category.populate(data, 'category');
    }

    getSellerProfile(request) {
        return Seller.findOne(request).select('-store_types -products');
    }

    SellerTotalCount(request) {
        return Seller.countDocuments(request).populate([
            { path: 'store_types', select: '_id title' },
            { path: 'country'}
        ]);
    }

    updateSeller(request, criteria) {
        return Seller.findOneAndUpdate(request, criteria, { new: true }).populate([
            { path: 'store_types', select: '_id title' },
            { path: 'country'}
        ]);
    }

    updateSellerForProfile(request, criteria) {
        return Seller.findOneAndUpdate(request, criteria, { new: true }).select('-store_types -products');
    }

    deleteSeller(request) {
        return Seller.findOneAndDelete(request).populate([
            { path: 'store_types', select: '_id title' },
            { path: 'country'}
        ]);
    }

    isActive(request) {

        return Seller.findOne(request).where({ active: true }).populate([
            { path: 'store_types', select: '_id title' },
            { path: 'country'}
        ]);
    }

}

module.exports = new SellerService();