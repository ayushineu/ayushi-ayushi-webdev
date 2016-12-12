(function(){
    angular
        .module("AuthorAttic")
        .factory("HomeService", HomeService);

    var key = "qJyWkwfwpNhqwkGCSzsSKQ";
    var secret = "kGYkBq1zo55M5kweoXIulGxcIR8H2i4V0uIYjTuIU";
    //var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT";

    function HomeService($http) {
        var api = {
            searchBooks: searchBooks
        };
        return api;

        function searchBooks(searchTerm) {
            https://www.goodreads.com/book/title.FORMAT
            var url = urlBase
                .replace("API_KEY", key)
                .replace("TEXT", searchTerm);
            return $http.get(url);
        }
    }
})();