module.exports = function(app, model) {

    var bookModel = model.bookModel;

    app.post("/api/home", addBook);
    app.get("/api/home/:bookId", findBookById);
    app.get("/api/home", getBook);
    app.put("/api/updatebook/:bookId", updateBook);
    app.delete("/api/deletebook/:bookId", deleteBook);
    app.get("/myproject/api/allbook/:title",allbookinfo);


    function allbookinfo(request, response,mydummyobject){
        var bookTitle = request.params.title;
        model
            .bookModel
            .findAllBookInfoByTitle(title)
            .then(
                function(book) {
                    model
                        .reviewModel
                    response.json(book);
                },
                function(error) {
                    response.statusCode(404).send(error);
                }
            );

    }

    function getBook(request, response) {
        var ISBNId = request.query['ISBN'];
        var title = request.query['title'];

        if(ISBNId) {

                findBookByISBN(ISBNId, response);

        }

        else if(title) {
           findBookByTitle(title, response);

        }
        else {

                findAllBooks(response);

        }

    }

    function addBook(request, response) {
        var book = request.body;

        model
            .bookModel
            .addBook(book)
            .then(
                function(book) {
                    // console.log(user);
                    response.json(book);
                },
                function(error) {
                    response.statusCode(400).send(error);
                }
            );
    }

    function findBookById(request, response) {
        var bookId = request.params.bookId;
        console.log("in book by id server");
        console.log(bookId);

        model
            .bookModel
            .findBookById(bookId)
            .then(
                function(book) {
                    response.json(book);
                },
                function(error) {
                    response.statusCode(404).send(error);
                }
            );
    }

    function findBookByISBN(ISBNId, response) {

        model
            .bookModel
            .findBookByISBN(ISBNId)
            .then(
                function(book) {
                    response.json(book);
                },
                function(error) {
                    response.statusCode(404).send(error);
                }
            );
    }

    function findBookByTitle(title, response) {

        model
            .bookModel
            .findBookByTitle(title)
            .then(
                function(book) {
                    response.json(book);
                },
                function(error) {
                    response.statusCode(404).send(error);
                }
            );
    }

    function findAllBooks(response) {

        model
            .bookModel
            .findAllBooks()
            .then(
                function(books) {
                    response.json(books);
                },
                function(error) {
                    response.statusCode(404).send(error);
                }
            );
    }

    function updateBook(request, response) {
        var bookId = request.params.bookId;
        var updatedBook = request.body;

        model
            .bookModel
            .updateBook(bookId, updatedBook)
            .then(
                function(stat) {
                    response.send(200);
                },
                function(error) {
                    response.statusCode(404).send(error);
                }
            );
    }

    function deleteBook(request, response) {
        var bookId = request.params.bookId;

        model
            .bookModel
            .deleteBook(bookId)
            .then(
                function(stats) {
                    //console.log(stats);
                    response.send(200);
                },
                function(error) {
                    response.statusCode(404).send(error);
                }
            );
    }
};