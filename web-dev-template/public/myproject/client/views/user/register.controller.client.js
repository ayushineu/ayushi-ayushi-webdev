(function() {
    angular
        .module("bookreads")
        .controller("RegisterController", RegisterController);

        function RegisterController($location, BookUserService,$rootScope) {
            var vm = this;
            vm.createNewUser = createNewUser;

            function createNewUser(user) {
                if (user.password === user.verifypassword) {
                    var UserPromise = BookUserService.findUserByUsername(user.username);

                    UserPromise
                        .success(function (user)
                            {
                                vm.error = "Username already exists. Please try  a different name";
                            }
                        )
                        .error
                        (function (err) {
                                var promise = BookUserService.register(user);
                                promise
                                    .success
                                    (function (user) {
                                        $rootScope.currentUser = user;

                                        $location.url("/user");
                                        }
                                    )
                                    .error
                                    (function (err) {
                                            vm.error = "Failed to create user. Please try again."
                                        }
                                    );
                            }
                        );
                }
                else {
                    vm.error = "Passwords do not match"
                }
            }
        }
    })();

