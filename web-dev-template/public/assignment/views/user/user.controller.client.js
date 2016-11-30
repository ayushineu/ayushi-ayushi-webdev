(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("ProfileController", ProfileController)
        .controller("RegisterController", RegisterController);

    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;

        function login(username, password) {
            var promise = UserService.findUserByCredentials(username, password);
            promise
                .success(function (user) {
                        if (user === '0') {
                            vm.error = "No such user";
                        }
                        else {
                            $location.url("/user/" + user._id);
                        }
                    }
                )
                .error
                (function (bbbb) {
                        console.log(bbbb);
                    }
                );
        }
    }

    function ProfileController($routeParams, UserService, $location) {

        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.unregisterUser = unregisterUser;
        vm.updateUser = updateUser;


        function init() {
            UserService.findUserById(vm.userId)
                .success(function (user) {
                        if (user != '0') {
                            vm.user = user;
                            vm.userId = $routeParams.uid;
                        }
                    }
                )
                .error
                (function (err) {
                        console.log("error in user controler");
                    }
                );
        }

        init();

        function unregisterUser() {
            UserService.deleteUser(vm.userId)
                .success(function () {
                        $location.url("/login");
                    }
                )
                .error(function (err) {
                        console.log("error in unregister");
                    }
                );
        }

        function updateUser() {
            console.log(vm.userId);
            UserService.updateUser(vm.userId, vm.user)
                .then(function () {
                        vm.success = "User updated";
                    },
                    function (error) {
                        vm.error = "Failed to update user";
                    }
                );
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.createNewUser = createNewUser;

        function createNewUser(user) {

            if (user.password === user.verifypassword) {
                var UserPromise = UserService.findUserByUsername(user.username);

                UserPromise
                    .success(function (user)
                        {
                            vm.error = "Username already exists. Please try  a different name";
                        }
                    )
                    .error
                    (function (err) {
                            console.log("create new " + user);
                            var promise = UserService.createUser(user);
                            promise
                                .success
                                (function (user) {
                                        $location.url("/user/" + user._id);
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

/*

 function LoginController($location, UserService) {
 var vm = this;
 vm.login = login;

 function login(username, password) {
 var promise = UserService.findUserByCredentials(username, password);
 promise
 .success(function(user){
 if(user === '0') {
 vm.error = "No such user";
 } else {
 $location.url("/user/" + user._id);
 }
 })
 .error(function(bbbb){
 console.log(bbbb);
 });
 }}

 function ProfileController($location, $routeParams, UserService) {
 var vm = this;

 var userId = parseInt($routeParams.uid);

 vm.updateUser = updateUser;
 vm.unregisterUser = unregisterUser;

 function init() {
 UserService
 .findUserById(userId)
 .success(function(user){
 if(user != '0') {
 vm.user = user;
 }
 })
 .error(function(){

 });
 }
 init();

 function updateUser() {
 UserService.updateUser(vm.user);
 }

 function unregisterUser() {
 UserService
 .unregisterUser(vm.user._id)
 .success(function(){
 $location.url("/login");
 })
 .error(function(){

 });
 }
 }


 function RegisterController(UserService, $location) {
 var vm = this;
 vm.createNewUser = createNewUser;

 function createNewUser(user) {

 if (user.password == user.verifypassword) {
 var UserPromise = UserService.findUserByUsername(user.username);

 UserPromise
 .success(function (user) {
 vm.error = "User already exists. Please try a different username";
 })
 .error(function (err) {
 console.log("create new "+user);
 var promise = UserService.createUser(user);
 promise
 .success(function (user) {
 $location.url("/user/" + user._id);
 })
 .error(function (err) {
 vm.error = "Failed to create user. Please try again!!"
 });
 });
 }
 else {
 vm.error = "Passwords do not match!!"
 }
 }
 }


 })();
 */