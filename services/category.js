const Category = require('./../models/category')

class CategoryService {

    addCategory(request) {
        return new Category(request).save();
    }

    getCategories(request, perPage, pageNo) {
        return Category.find(request).populate(
            { path: 'countries', },
        ).skip((pageNo-1)*perPage).limit(perPage);
    }

    getActiveCategories(request) {
        return Category.find(request).populate(
            { path: 'countries', },
        ).where({ active: true });
    }

    getCategory(request) {
        return Category.findOne(request).populate(
            { path: 'countries', },
        );
    }

    CategoryTotalCount(request) {
        return Category.countDocuments(request);
    }

    updateCategory(request, criteria) {
        return Category.findOneAndUpdate(request, criteria, { new: true }).populate(
            { path: 'countries', },
        );
    }

    deleteCategory(request) {
        return Category.findOneAndDelete(request).populate(
            { path: 'countries', },
        );
    }

    isActive(request) {

        return Category.findOne(request).where({ active: true }).populate(
            { path: 'countries', },
        );
    }
    categoryPopulate(request,criteria){
        return Category.populate(request,criteria);
    }
}

module.exports = new CategoryService();