module.exports = function() {
    var mongoose = require('mongoose');
    var BookSchema = require("../books/books.schema.server")();
    var BookUserSchema = require("../user/bookuser.schema.server")();


    var ReviewSchema = mongoose.Schema({
        title: String,
        description: String,
        ISBN: String,
        bookTitle: String,
        bookId:String,
        bookCover: String,
        user: {
            userId:String,
            username: String
        },
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "project.review"});

    return ReviewSchema;

};