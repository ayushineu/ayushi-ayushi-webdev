(function() {
    angular
        .module("bookreads")
        .controller("LoginController", LoginController);
    function LoginController($location, BookUserService,$rootScope) {
        var vm = this;
        vm.login = login;

        function login(username, password) {
            BookUserService
                    .login(username, password)
                    .then(
                        function(response) {
                            //console.log(response);
                            var user = response.data;
                            //console.log(response);
                            if(user._id) {
                                //$location.url("/user/"+user._id);
                                $rootScope.currentUser=user;
                                $location.url("/user");
                            }
                            else {
                                vm.error = "User not found";
                            }
                        },
                        function(error) {
                            vm.error = "Username and password do not match";
                        });

            }
        }
    })();