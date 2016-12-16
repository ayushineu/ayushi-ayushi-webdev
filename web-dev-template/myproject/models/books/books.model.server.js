//Gives a high level API to interact with the DB. Only DB operations should be done here.
module.exports = function() {

    var mongoose = require('mongoose');

    var BookSchema = require("./books.schema.server.js")();

    //This User object is the one that allows to actually create an instance of a User to write to the DB.
    var bookModel = mongoose.model("bookModel", BookSchema);

    var api = {
        addBook: addBook,
        findAllBooks: findAllBooks,
        findBookById: findBookById,
        findBookByISBN: findBookByISBN,
        findBookByTitle: findBookByTitle,
        findBookByAuthor: findBookByAuthor,
        findBookByGenre: findBookByGenre,
        updateBook: updateBook,
        deleteBook: deleteBook,
        setModel:setModel

    };
    return api;


    function setModel(_model)
    {
        model = _model;
    }

    function addBook(book) {
        return bookModel.create(book);
    }

    function findAllBooks() {
        return bookModel.find();
    }


    function findBookById(bookId) {
        console.log("came to find by id in model");
        return bookModel.findOne({"bookId":bookId});
        // return bookModel.findOne({"bookId":bookId});
    }

    function findBookByISBN(ISBNId) {
        return bookModel.findOne({ISBN: ISBNId});
    }

    function findBookByTitle(bookTitle) {
        console.log("came to find by title");
        return bookModel.findOne({bookTitle: bookTitle});
    }

    function findBookByAuthor(bookAuthor) {
        return bookModel.findOne({author: bookAuthor});
    }


    function findBookByGenre(bookGenre) {
        return bookModel.findOne({genre: bookGenre});
    }


    function updateBook(bookId, updatedBook) {
        delete updatedBook._id;
        return bookModel.update({"bookId": bookId}, {
            $set: updatedBook
        });
    }

    function deleteBook(bookId) {
        return bookModel.remove({_id: bookId});
    }
};