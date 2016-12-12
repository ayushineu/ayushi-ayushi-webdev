(function(){
    angular
        .module("WebAppMaker")
        .factory("FlickrService", FlickrService);


    function FlickrService($http){

        var api =
        {
            searchPhotos : searchPhotos
        };
        return api;



        function searchPhotos(searchTerm)
        {

            var key = "e3788c07277edf9578c382298880df5e";
            var secret = "629cd464ae01e8a9";
            var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT";
            var url = urlBase
                .replace("API_KEY", key)
                .replace("TEXT", searchTerm);
            return $http.get(url);
        }

    }
})();