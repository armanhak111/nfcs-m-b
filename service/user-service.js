const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('../service/token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-errors');

class UserService { 
    async registration(email, password) {
        const candidate = await UserModel.findOne({email});
        
        if(candidate){
            throw ApiError.BadRequest(`User with email already regsitered ${email}`)
        }
        const hashPassword = await bcrypt.hash(password,3)
        const activationLink = uuid.v4();
        const user = await UserModel.create({email,password: hashPassword, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

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
        return {
            isPassChnaged: true
        }
    }

    async login(email,password) {
        const user = await UserModel.findOne({email});
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


    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }
};

module.exports = new UserService();