const CountryService = require('../../services/country')
const CategoryService = require('../../services/category')
const ResponseService = require('../../common/response')

//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors')

class CountryController {

    async addCountry(req, res) {
        try {
            let data = Object.assign({}, req.body);
            console.log('Country Data', messages.arrowHead, data)

            if (!data.title) throw new apiErrors.ValidationError('title', messages.TITLE_VALIDATION)
            if (!data.dialCode) throw new apiErrors.ValidationError('dialCode', 'Dial Code Required');
            if (!data.code) throw new apiErrors.ValidationError('code', 'Code Required');

            let country = await CountryService.getCountry({ code: data.code });

            if (country) throw new apiErrors.ResourceAlreadyExistError('country', messages.RESOURCE_ALREADY_EXISTS)

            country = await CountryService.addCountry(data);

            return res.status(200).send(ResponseService.success({ country: country }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getCountries(req, res) {
        try {

            let pageNo = parseInt(req.query.pageNo)
            let perPage = parseInt(req.query.perPage)
            let search = req.query.search || ''

            let filters = { title: new RegExp(search, 'i'), };

            let total = await CountryService.CountryTotalCount(filters)

            let countries = await CountryService.getCountries(filters, perPage, pageNo)

            return res.status(200).send(ResponseService.success({ countries, count: total }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

    async getCountriesByCategory(req, res) {
        try {

            let data = Object.assign({}, req.query);
            if (!data.category) throw new apiErrors.ValidationError('category', messages.CATEGORY_VALIDATION);
            
            let category = await CategoryService.getCategory({ _id: data.category });
            if (!category) throw new apiErrors.ResourceNotFoundError();

           // let total = category.countries.length();

            let countries = [];
            countries =  category.countries;

            return res.status(200).send(ResponseService.success({ countries,count:countries.length}))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }
}

module.exports = new CountryController();