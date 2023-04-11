const userService = require('../service/user-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-errors');

class UserController {
    async registration(req,res,next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Validation Error', errors.array()))
            }
            const {email, password} = req.body;
            const userData = await userService.registration(email, password);
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async login(req,res,next){
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req,res,next){
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }

    async activate(req,res,next){
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink)
            return res.redirect(`${process.env.CLIENT_URL}/sign-in`)
        } catch (e) {
            next(e)
        }
    }

    async health(_req,res){
        const isHealth = {code: 200, status: 'healthy', status: 'ARSHAK'}
        return res.json(isHealth)
    }

    async refresh(req,res,next){
        try {
            const refreshToken = req.headers.refreshtoken;
            const userData = await userService.refresh(refreshToken);
            return res.json(userData)
        } catch (e) {
            next(e)  
        }
    }

    async getUsers(req,res,next){
        try {
            const currUserId = req.query.id;
            console.log(currUserId,'currUserIdcurrUserIdcurrUserId')
            const users = await userService.getCurrentUser(currUserId)
            return res.json(users)
        } catch (e) {
            next(e)
        }
    }

    async getCurrentUser (req,res,next){
        try {
            const currUserId = req.params.id;
            const users = await userService.getCurrentUser(currUserId)
            return res.json(users)
        } catch (e) {
            next(e)
        }
    }

    async changeName (req,res,next){
        try {
            const {name, id} = req.body;
            const users = await userService.changeName(name,id)
            return res.json(users)
        } catch (e) {
            next(e)
        }
    }

    async changePassword(req,res,next){
        try {
            const {password, newPassword, email} = req.body;
            const changedPassword = await userService.changePassword(email, password, newPassword)
            return res.json(changedPassword)
        } catch (e) {
            next(e)
        }
    }

    async resendActivation(req, res, next) {
        try {
            const { email } = req.body;
            await userService.resendActivation(email)
            return res.json({ resended: true})
        } catch (e) {
            next(e)
        }
    }

    async resetPassLink(req,res, next) {
        try {
            const { email } = req.body;
            const linkSended = await userService.resetPassLink(email)
            return res.json(linkSended)
        } catch(e) {
            next(e)
        }
    }

    async resetpassword(req,res,next) {
        try {
            const { password, resetLink } = req.body;
            const resetedPass =  await userService.resetpassword(password, resetLink)
            return res.json(resetedPass)
        }   catch(e){
            next(e)
        }
    }
};

module.exports = new UserController;