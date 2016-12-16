(function(){
    angular
        .module("bookreads")
        .factory("HomeService", HomeService);

    var key = "qJyWkwfwpNhqwkGCSzsSKQ";
    var secret = "kGYkBq1zo55M5kweoXIulGxcIR8H2i4V0uIYjTuIU";


    function HomeService($http) {
        var api = {
            searchBooks: searchBooks,
            getLatest:getLatest,
            searchBooksbyLanguage:searchBooksbyLanguage,
            searchBooksbyGenre:searchBooksbyGenre,
            searchBookById:searchBookById
        };
        return api;

function searchBooksbyGenre(keyword){

    var url="https://www.googleapis.com/books/v1/volumes?q=%22"+keyword+"%22";

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    response=JSON.parse(xmlHttp.responseText);
    return response;

}
        function searchBooksbyLanguage(keyword){
        var url="https:www.googleapis.com/books/v1/volumes?q=%22%22&langRestrict="+keyword;

            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", url, false );
            xmlHttp.send( null );
            response=JSON.parse(xmlHttp.responseText);
            return response;

        }


        function searchBooks(keyword) {
            var url = "https://www.googleapis.com/books/v1/volumes?q=harry+potter&format=json&diagnostics=true";
            url = url.replace("q=harry+potter", "q=" + keyword);
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", url, false );
            xmlHttp.send( null );
            response=JSON.parse(xmlHttp.responseText);
            return response;
        }

        function getLatest(){
            var url="https://www.googleapis.com/books/v1/volumes?q=publishedDate%3A+2016&orderBy=newest";
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", url, false );
            xmlHttp.send( null );
            var response = JSON.parse(xmlHttp.responseText);
            return response;
        }

        function searchBookById(keyword){
            var url= "https://www.googleapis.com/books/v1/volumes?q=id%3A+tcSMCwAAQBAJ&orderBy=relevance";
            url = url.replace("tcSMCwAAQBAJ", keyword);
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", url, false );
            xmlHttp.send( null );
            var response = JSON.parse(xmlHttp.responseText);
            return response;

        }
    }
})();