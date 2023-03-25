module.exports = class ContactDTO {
    name;
    email;
    inquiry;
    message;

    constructor (model){
        this.name = model.name;
        this.email = model.email;
        this.inquiry = model.inquiry;
        this.message = model.message;
    }
}