const additionalService = require('../service/additional-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-errors');

class AdditionalController {
    async contact(req,res,next) {
        try {
            const { name, email, inquiry, message } = req.body;
            const contact =  await additionalService.contact(name, email, inquiry, message)
            return res.json(contact)
        }   catch(e){
            next(e)
        }
    }

    async order(req,res,next) {
        try {
            const analytics = await additionalService.order(req.body)
            return res.json(analytics)
        } catch (e) {
            next(e)
        }
    }

    async getAnalytics(req,res,next) {
        try {
            const {id} = req.body
            const analytics = await additionalService.getAnalytics(id)
            return res.json(analytics)
        } catch (e) {
            next(e)
        }
    }

    async deleteAnalytics(req,res,next) {
        try {
            const {analyticId, userId} = req.body
            const analytics = await additionalService.deleteAnalytics(analyticId, userId)
            return res.json(analytics)
        } catch (e) {
            next(e)
        }
    }
    
};

module.exports = new AdditionalController;