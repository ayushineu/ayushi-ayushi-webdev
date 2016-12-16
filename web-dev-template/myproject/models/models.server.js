module.exports = function(){
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://admin:admin@ds133368.mlab.com:33368/bookreads');


    var bookuserModel = require("./user/bookuser.model.server")();
    var reviewModel = require("./review/review.model.server")();
    var bookModel = require("./books/books.model.server")();


    var model = {
        bookuserModel: bookuserModel,
        reviewModel: reviewModel,
        bookModel: bookModel,
    };

    bookuserModel.setModel(model);
    reviewModel.setModel(model);
    bookModel.setModel(model);

    return model;
}