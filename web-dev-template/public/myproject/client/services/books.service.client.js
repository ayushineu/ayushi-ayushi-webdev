(function() {
    angular
        .module("bookreads")
        .factory("BookService", BookService);

    var API_KEY = "AIzaSyA8nxjhcIjrGuWZjCCekdZLQ-UmryIkI98";
    //https://www.googleapis.com/books/v1/volumes?q=pride+prejudice&download=epub&key=yourAPIKey


    function BookService($http) {
        var api = {
            getLatest: getLatest,
            getBooksbyGenres: getBooksbyGenres,
            addBook: addBook,
            findBookById: findBookById,
            findBookByISBNId: findBookByISBNId,
            findBookByTitle: findBookByTitle,
            updateBook: updateBook,
            deleteBook: deleteBook,
            findAllBookInfoByTitle:findAllBookInfoByTitle
        };
        return api;

        function findAllBookInfoByTitle(title){
            url="/myproject/api/allbook?title=" + title;
            return $http.get(url);
        }

        function getLatest() {
            var url= "https://www.googleapis.com/books/v1/volumes?q=books%3A%22%22&orderBy=newest&key="+API_KEY;
            return $http.get(url);
        }

        function getBooksbyGenres(genre) {
            //GET https://www.googleapis.com/books/v1/volumes?q=items%5Bcategories%5D%3A%22romance%22&key={YOUR_API_KEY}
            var url = "https://www.googleapis.com/books/v1/volumes?q=items%5Bcategories%5D%3A%22"+genre+"%22&key="+API_KEY;
            return $http.get(url);
        }



        function addBook(book) {
            var url = "/api/home";
            return $http.post(url, book);
        }

        function findBookById(bookId) {
            console.log("in client came to find by id");
            console.log(bookId);
            var url = "/api/home/" + bookId;
            return $http.get(url);
        }

        function findBookByISBNId(ISBNId) {
            var url = "/api/home?ISBN=" + ISBNId;
            return $http.get(url);
        }

        function findBookByTitle(title) {
            console.log("title is");
            console.log(title);
            var url = "/api/home?title=" + title;
            return $http.get(url);
        }


        function updateBook(bookId, book) {
            var url = "/api/updatebook/" + bookId;
            return $http.put(url, book);
        }

        function deleteBook(bookId, book) {
            var url = "/api/deletebook/"+bookId;
            return $http.delete(url, book);
        }
    }
})();