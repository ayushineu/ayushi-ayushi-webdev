(function() {
    angular
        .module("AuthorAttic")
        .config(Config);

    function Config($routeProvider) {
        $routeProvider
            .when("/home", {
                templateUrl: "views/home/home.html",
                controller: "HomePageController",
                controllerAs: "model"

            })
    }
})();