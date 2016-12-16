
module.exports = function() {

    var mongoose = require('mongoose');

    var ReviewSchema = require("./review.schema.server")();

    var reviewModel = mongoose.model("reviewModel", ReviewSchema);

    var api = {
        createReview: createReview,
        findAllReviews: findAllReviews,
        findReviewById: findReviewById,
        findReviewBybookId: findReviewBybookId,
        findReviewByISBN: findReviewByISBN,
        findReviewByUserId: findReviewByUserId,
        updateReview: updateReview,
        deleteReview: deleteReview,
        setModel:setModel

    };
    return api;

    function setModel(_model)
    {
        model = _model;
    }

    function createReview(review) {
        return reviewModel.create(review);
    }

    function findReviewBybookId(bookId){
        return reviewModel.find({"bookId":bookId});
    }

    function findAllReviews() {
        return reviewModel.find();
    }

    function findReviewById(reviewId) {
        return reviewModel.findById(reviewId);
    }

    function findReviewByISBN(ISBNId) {
        return reviewModel.find({"ISBN": ISBNId});
    }

    function findReviewByUserId(userId) {
        return reviewModel.find({userId: userId});
    }

    function updateReview(reviewId, updatedReview) {
        delete reviewModel._id;
        return reviewModel.update({"_id": reviewId}, {
            $set: updatedReview
        });
    }

    function deleteReview(bookId) {
        return reviewModel.remove({"bookId": bookId});
    }
};