(function() {
    angular
        .module("bookreads")
        .factory("ReviewService", ReviewService);

    function ReviewService($http) {

        var api = {
            findReviewByBookId:findReviewByBookId,
            createReview:createReview,
            updateReview:updateReview,
            deleteReview:deleteReview
        };

        return api;

        function findReviewByBookId(bookId){
            var url = "/api/review/bookid/" + bookId;
            return $http.get(url);

        }

        function createReview(reviewToCreate){
                var url = "/api/review";
                return $http.post(url, reviewToCreate);
            }


        function updateReview(reviewId, review) {
            var url = "/api/review/" + reviewId;
            return $http.put(url, review);
        }

        function deleteReview(bookId) {
            var url = "/api/deletereview/" + bookId;
            return $http.delete(url);
        }
    }})();