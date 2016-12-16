(function() {
    angular
        .module("bookreads")
        .config(Config);

    function Config($routeProvider) {
        $routeProvider
            .when ("/", {
                redirectTo: "/home"
            })
            .when("/home",{
                templateUrl: "client/views/home/home.html",
                controller: "HomePageController",
                controllerAs: "model"
            })
            .when("/home/booksbyLanguage/:language",{
                templateUrl: "client/views/home/booksbyLanguage.view.client.html",
                controller: "BookLanguageController",
                controllerAs: "model"
            })
            .when("/home/booksbyGenre/:genre",{
                templateUrl: "client/views/home/booksbyGenre.view.client.html",
                controller: "BookGenreController",
                controllerAs: "model"
            })
            .when("/home/latest",{
                templateUrl: "client/views/home/latest-release.view.client.html",
                controller: "LatestReleaseController",
                controllerAs: "model"
            })
            .when("/home/mybookinfo/:bookId", {
                templateUrl: "client/views/book/book-profile.view.client.html",
                controller: "BookDetailsController",
                controllerAs: "model"
            })
            .when("/home/:seacrhtext",{
                templateUrl: "client/views/home/book-search-result-view.client.html",
                controller: "SearchListController",
                controllerAs: "model"
            })
            .when("/login", {
                templateUrl: "client/views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/register", {
                templateUrl: "client/views/user/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/user", {
                templateUrl: "client/views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    loggedIn: checkLoggedIn
                }
            })

            .when("/user/:uid", {
                templateUrl: "client/views/user/other-profile.view.client.html",
                controller: "OtherProfileController",
                controllerAs: "model"
            })
            .when("/myproj/dB/book/:bookId", {
                templateUrl: "client/views/book/in-db-book-profile.html",
                controller: "DbBookDetailsController",
                controllerAs: "model"
            })

            // .when("/search/:searchText", {
            //     templateUrl: "client/views/movie/search-result.view.client.html",
            //     controller: "SearchResultController",
            //     controllerAs: "model"
            // })

            // .when("/author/:authorId", {
            //     templateUrl: "client/views/books/author-profile.view.client.html",
            //     controller: "AuthorProfileController",
            //     controllerAs: "model"
            // })
            .otherwise({
                redirectTo: "/home"
            });
        //
        // //$q allows to work with promises and asynchronous call
        // function checkLoggedIn(BookUserService, $location, $q, $rootScope) {
        //
        //     var deferred = $q.defer();
        //
        //     BookUserService
        //         .loggedIn()
        //         .then(
        //             function(response) {
        //                 var user = response.data;
        //                 if(user == '0') {
        //                     $rootScope.currentUser = null;
        //                     deferred.reject();
        //                     $location.url("/login");
        //                 }
        //                 else {
        //                     $rootScope.currentUser = user;
        //                     deferred.resolve();
        //                 }
        //             },
        //             function(error) {
        //                 $location.url("/login");
        //             }
        //         );
        //
        //     return deferred.promise;
        // }

        function checkLoggedIn(BookUserService, $location, $q, $rootScope) {

            var deferred = $q.defer();

            BookUserService
                .loggedIn()
                .then(
                    function(response) {
                        var user = response.data;
                        if(user == '0') {
                            $rootScope.currentUser = null;
                            deferred.reject();
                            $location.url("/login");
                        }
                        else {
                            $rootScope.currentUser = user;
                            deferred.resolve();
                        }
                    },
                    function(error) {
                        $location.url("/login");
                    }
                );

            return deferred.promise;
        }

    }
})();


//     }
//
//     function checkLogin($q, $timeout, $http, $location, $rootScope, BookUserService) {
//         var deferred = $q.defer();
//
//         BookUserService
//             .checkLogin()
//             .success(
//                 function (user) {
//                     $rootScope.errorMessage = null;
//
//                     if(user != '0'){
//                         console.log("in config success");
//                         console.log(user);
//                         $rootScope.currentUser = user;
//                         deferred.resolve();
//                     }else {
//                         deferred.reject();
//                         $location.url('/login');
//                     }
//                 }
//             )
//             .error(
//                 function(err){
//                     $location.url("/login");
//                 }
//             );
//         return deferred.promise;
//     }
//
// })();
