const UserModel = require('../models/user-model');
const AnalyticModel = require('../models/analytic-model');

const ResetPasswordModel = require('../models/reset-password');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('../service/token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-errors');
const MAIL_TEMPLATES = require('../mail-templates/templates');


class UserService { 
    async registration(email, password) {
        const candidate = await UserModel.findOne({email});
        
        if(candidate){
            throw ApiError.BadRequest(`User with email already regsitered ${email}`)
        }
        const hashPassword = await bcrypt.hash(password,3)
        const activationLink = uuid.v4();
        const user = await UserModel.create({email,password: hashPassword, activationLink, name: email.split('@')[0], upt: 500})
        await AnalyticModel.create({id: user._id, analytics: []})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`, MAIL_TEMPLATES.activation);

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }
    }   



    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if(!user){
            throw ApiError.BadRequest('Incorrect URL')
        }
        user.isActivated = true;
        await user.save();
    }

    async changePassword(email, password, newPassword) {
        const user = await UserModel.findOne({email});
        const isPassEqual = await bcrypt.compare(password, user.password)

        const isSameAtLast = await bcrypt.compare(newPassword, user.password)

        if(isSameAtLast) {
            throw ApiError.BadRequest('The new password cannot be the same as the old password')
        }

        if(!isPassEqual){
            throw ApiError.BadRequest('Incorrect Password')
        }
        user.password = await bcrypt.hash(newPassword,3);
        await user.save();
        await mailService.sendChangePassword(email, MAIL_TEMPLATES.changePassword );
        return {
            isPassChnaged: true
        }
    }

    async login(email,password) {
        const user = await UserModel.findOne({email});
        console.log(user)
        if(!user){
            throw ApiError.BadRequest('Not found')
        }
        const isPassEqual = await bcrypt.compare(password, user.password)

        if(!isPassEqual) {
            throw ApiError.BadRequest('Wrong password')
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto})

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken) {
        const token  = await tokenService.removeToken(refreshToken);
        return token
    }

    
    async refresh(refreshToken) {
        if (!refreshToken){
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = await tokenService.findToken(refreshToken)

        if(!userData || !tokenFromDB){
            throw ApiError.UnauthorizedError()
        }

        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto})

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }
    }

    async getCurrentUser(currUserId) {
        const currentUser = await UserModel.findOne({_id: currUserId});
        const userDto = new UserDto(currentUser)

        return userDto;
    }

    async changeName (name, id) {
        const user = await UserModel.findOne({_id:id})
        console.log(user,name,id)
        if(!user){
            throw ApiError.BadRequest('Incorrect URL')
        }
        user.name = name;
        await user.save();
        const userDto = new UserDto(user)
        return userDto
    }

    async resendActivation(email) {
        const user = await UserModel.findOne({ email });
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${user.activationLink}`, MAIL_TEMPLATES.activation);
    }

    async resetPassLink(email){
         const resetLinkID = uuid.v4();
         const findUserInResetCollection = await ResetPasswordModel.findOne({email})

         if(findUserInResetCollection) {
            await ResetPasswordModel.deleteOne({email});
        }

         await ResetPasswordModel.create({ email,resetLink:resetLinkID })
         await mailService.resetPass(email, `${process.env.CLIENT_URL}/reset-password/${resetLinkID}`, MAIL_TEMPLATES.resetPassword);

         return {
            linkSended: true
         }
    }

    async resetpassword(password, resetLink){
        const currResetUser = await ResetPasswordModel.findOne({resetLink})

        if(!currResetUser) {
            throw ApiError.BadRequest('Password reset link is wrong')
        }

        const createdTime = new Date(currResetUser.createdAt).getTime();
        const expirationTime =  6 * 60 * 60 * 1000;
        const isExipired = new Date() - expirationTime;

        if(createdTime < isExipired) {
            throw ApiError.BadRequest('Your password reset link has been expired.')
        }

        const user = await UserModel.findOne({email: currResetUser.email});

        user.password = await bcrypt.hash(password,3);
        await user.save();
        await ResetPasswordModel.deleteOne({resetLink});

        return {
            isPassReseted: true
        }

    }
};

module.exports = new UserService();