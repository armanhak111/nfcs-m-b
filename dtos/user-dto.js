module.exports = class UserDto {
    email;
    id;
    isActivated;
    name;
    upt;

    constructor (model){
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.name = model.name;
        this.upt = model.upt
    }
}