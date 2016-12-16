module.exports = function() {

    var mongoose = require('mongoose');


    var BookSchema = mongoose.Schema({
        bookId:String,
        ISBN: String,
        bookTitle: String,
        bookCover: String,
        author:String,
        genre:String,
        reviews: [{reviewId: String}],
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "project.books"});

    return BookSchema;

};