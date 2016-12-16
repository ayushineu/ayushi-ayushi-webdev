(function(){
    angular
        .module("bookreads")
        .controller("LatestReleaseController",LatestReleaseController)
        .controller("HomePageController",HomePageController)
        .controller("SearchListController",SearchListController)
        .controller("BookLanguageController",BookLanguageController)
        .controller("BookGenreController",BookGenreController);



    function BookGenreController($location,HomeService,$rootScope){
        var vm = this;
        vm.books=[];
        vm.user=$rootScope.currentUser;
        vm.searchBook=searchBook;
        vm.getBookDetails=getBookDetails;
        function init() {
            var url = (window.location).href;
            vm.keyword = url.substring(url.lastIndexOf('/') + 1);
            response=HomeService.searchBooksbyGenre(vm.keyword);
            vm.books=response.items;
        }init();

        function searchBook(keyword)
        {
            response=HomeService.searchBooks(keyword);
            vm.books=response.items;
            $location.url("/home/"+keyword);

        }

        function getBookDetails(bookId){
            console.log("in lang controller");
            console.log(bookId);
            $location.url("/home/mybookinfo/"+bookId);


        }}
    function BookLanguageController ($location,HomeService,$rootScope){
        var vm = this;
        vm.books=[];
        vm.getBookDetails=getBookDetails;
        vm.user=$rootScope.currentUser;
        vm.searchBook=searchBook;
        function init() {
            var url = (window.location).href;
            vm.keyword = url.substring(url.lastIndexOf('/') + 1);
            response=HomeService.searchBooksbyLanguage(vm.keyword);
            vm.books=response.items;
        }init();

        function searchBook(keyword)
        {
            response=HomeService.searchBooks(keyword);
            vm.books=response.items;
            $location.url("/home/"+keyword);

        }

        function getBookDetails(bookId){
            console.log("in lang controller");
            console.log(bookId);
            $location.url("/home/mybookinfo/"+bookId);


        }


    }

    function HomePageController($http,$routeParams,$location,BookUserService,$rootScope,HomeService) {
    var vm = this;
    vm.getBookInformation = getBookInformation;
    vm.books=[];
        vm.user=$rootScope.currentUser;
    function getBookInformation(keyword)
    {
        response=HomeService.searchBooks(keyword);
        vm.books=response.items;
        $location.url("/home/"+keyword);

    }

        function logout() {

            BookUserService
                .logout()
                .then(
                    function(response){
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    },
                    function(error) {
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    }
                );
        }



    }

function LatestReleaseController($http,$location,HomeService,$rootScope){
    var vm = this;
    vm.latest=[];
    vm.user=$rootScope.currentUser;
    vm.searchBook=searchBook;
    vm.getBookDetails=getBookDetails;
    function init(){
        response=HomeService.getLatest();
        vm.latest=response.items;

    }init();

    function searchBook(keyword)
    {
        response=HomeService.searchBooks(keyword);
        vm.books=response.items;
        $location.url("/home/"+keyword);

    }

    function getBookDetails(bookId) {
        console.log("in lang controller");
        console.log(bookId);
        $location.url("/home/mybookinfo/" + bookId);
    }

    }

function SearchListController($http,$location,HomeService,$rootScope)
{
    var vm = this;
    vm.getImg=getImg;
    vm.searchBook=searchBook;
    vm.getBookDetails=getBookDetails;
    vm.books=[];
    vm.mycover="";
    vm.user=$rootScope.currentUser;
    function init() {
        var url = (window.location).href;
        vm.keyword = url.substring(url.lastIndexOf('/') + 1);
        response=HomeService.searchBooks(vm.keyword);
        vm.books=response.items;
    }init();

    function getImg(book){
        if(book.volumeInfo.imageLinks.smallThumbnail){
            vm.mycover= book.volumeInfo.imageLinks.smallThumbnail;
        }
        else{
            vm.mycover = "No_book_cover.jpg";
        }
    }

    function searchBook(keyword){
        response=HomeService.searchBooks(keyword);
        vm.books=response.items;
        $location.url("/home/"+keyword);

    }
    function getBookDetails(bookId){
        console.log("in lang controller");
        console.log(bookId);
        $location.url("/home/mybookinfo/"+bookId);



    }
}
})();
