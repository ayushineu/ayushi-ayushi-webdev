module.exports = function(app, model) {

    var reviewModel = model.reviewModel;

    app.post("/api/review", createReview); //ISBNId
    app.get("/api/review/:reviewId", findReviewById);
    app.get("/api/review", getReview);
    app.put("/api/review/:reviewId", updateReview);
    app.delete("/api/deletereview/:bookId", deleteReview);
    app.get("/api/review/bookid/:bookId",findReviewBybookId);


    function getReview(request, response) {
        var bookId = request.query['bookId'];
        var ISBNId = request.query['ISBNId'];
        var userId = request.query['userId'];

        if(bookId) {
            findReviewBybookId(bookId, response);
        }
        else if(ISBNId) {
            findReviewByISBNId(ISBNId, response);
        }
        else if(userId) {
            findReviewByUserId(userId, response);
        }
        else {
            findAllReviews(response);
        }
    }

    function createReview(request, response) {
        var review = request.body;
        reviewModel
            .createReview(review)
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

    function findReviewById(request, response) {
        var reviewId = request.params.reviewId;

        reviewModel
            .findReviewById(reviewId)
            .then(
                function(review) {
                    response.json(review);
                },
                function(error) {
                    response.statusCode(404).send(error);
                }
            );
    }

    function findReviewBybookId(request, response) {
        var bookId=request.params.bookId;
        reviewModel
            .findReviewBybookId(bookId)
            .then(
                function(review) {
                    response.json(review);
                },
                function(error) {
                    response.statusCode(404).send(error);
                }
            );
    }

    function findReviewByISBNId(ISBNId, response) {

        reviewModel
            .findReviewByISBN(ISBNId)
            .then(
                function(review) {
                    response.json(review);
                },
                function(error) {
                    response.statusCode(404).send(error);
                }
            );
    }

    function findReviewByUserId(userId, response) {

        reviewModel
            .findReviewByUserId(userId)
            .then(
                function(review) {
                    response.json(review);
                },
                function(error) {
                    response.statusCode(404).send(error);
                }
            );
    }

    function findAllReviews(response) {

        reviewModel
            .findAllReviews()
            .then(
                function(book) {
                    response.json(book);
                },
                function(error) {
                    response.statusCode(404).send(error);
                }
            );
    }

    function updateReview(request, response) {
        var reviewId= request.params.reviewId;
        var bookId = request.params.bookId;
        var userId = request.params.userId;
        var updatedBook = request.body;

        reviewModel
            .updateReview(reviewId, updatedBook)
            .then(
                function(stat) {
                    response.send(200);
                },
                function(error) {
                    response.statusCode(404).send(error);
                }
            );
    }

    function deleteReview(request, response) {
        var bookId= request.params.bookId;

        reviewModel
            .deleteReview(bookId)
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