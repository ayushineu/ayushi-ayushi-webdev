module.exports = function() {
    var mongoose = require('mongoose');
    var BooksUserSchema = mongoose.Schema({
        username: {type: String, required: true},
        password: String,
        firstName: String,
        lastName: String,
        google:{
            id: String,
            token: String
        },
        email: String,
        phone: String,
        dob: Date,
        type:{type: String, enum: ['User','Admin']},
        url: String,
        followers:[{userId:String, username:String}],
        following:[{userId:String, username:String}],
        booksReviewed: [{
            bookId: String,
            bookTitle: String,
            bookCover: String}],
        booklist:[{
            bookId: String,
            bookTitle: String,
            bookCover: String}],
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "project.bookuser"});

    return BooksUserSchema;

};