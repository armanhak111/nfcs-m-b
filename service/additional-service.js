const ContactModel = require('../models/contact-model');
const UserModel = require('../models/user-model');
const AnalyticModel = require('../models/analytic-model');

const ContactDTO = require('../dtos/contact-dto');
const UserDto = require('../dtos/user-dto');
const uuid = require('uuid');
const ApiError = require('../exceptions/api-errors');

class AdditionalService { 
    async contact(name,email, inquiry, message) {
        const contact = await ContactModel.create({name,email, inquiry, message})
        return new ContactDTO(contact)
    }   

    async order(params) {
        const {id} = params
        const user = await UserModel.findOne({_id:id})
        if(!user){
            throw ApiError.BadRequest('Incorrect URL')
        }
        const currentAnalytic = await AnalyticModel.findOne({id: user._id})

        if(!currentAnalytic){
            throw ApiError.BadRequest('Incorrect Analytics')
        }
        const newAnalytics = params;
        const analyticId = uuid.v4();

        delete newAnalytics.id
        currentAnalytic.analytics = [...currentAnalytic.analytics, {...newAnalytics, analyticId}]
        currentAnalytic.save()

        return currentAnalytic.analytics
    }   

    async getAnalytics(id) {
        if(!id){
            throw ApiError.BadRequest('Incorrect ID')
        }
        const currentAnalytic = await AnalyticModel.findOne({id: id})
        if(!currentAnalytic){
            throw ApiError.BadRequest('Incorrect Analytics')
        }
        return currentAnalytic.analytics
    }


    async deleteAnalytics(analyticId,userId) {
        if(!analyticId || !userId){
            throw ApiError.BadRequest('Incorrect USER_ID')
        }
        const currentAnalytic = await AnalyticModel.findOne({id: userId})
        if(!currentAnalytic){
            throw ApiError.BadRequest('Incorrect Analytics')
        }
        const filteredAnalytics = currentAnalytic.analytics.filter((current) => current.analyticId !== analyticId)
        currentAnalytic.analytics = filteredAnalytics
        currentAnalytic.save()

        return filteredAnalytics

    }
};

module.exports = new AdditionalService();