(function() {
    angular
        .module("bookreads")
        .factory("BookUserService", BookUserService);

    function BookUserService($http) {

        var api = {
            createUser: createUser,
            register: register,
            login: login,
            logout: logout,
            loggedIn: loggedIn,
            findUserById: findUserById,
            findUserByCredentials: findUserByCredentials,
            findUserByUsername: findUserByUsername,
            updateUser: updateUser,
            deleteUser: deleteUser,
            getall:getall

        };

        return api;


function getall(){
    return $http.get("/api/alluser");
}
        function register(user) {
            return $http.post("/api/register", user);
        }

        function loggedIn() {
            return $http.get("/api/loggedIn");
        }

        function logout() {
            return $http.post("/api/logout");
        }

        function login(username, password) {
            var user = {
                username: username,
                password: password
            };
            //console.log(user);
            return $http.post("/api/login", user);
        }

        function findUserByCredentials(username, password) {
            var url = "/api/user?username=" + username  + "&password=" + password;
            return $http.get(url);
        }

        function findUserById(id) {
            var url = "/api/user/" + id;
            return $http.get(url);
        }

        function updateUser(id, newUser) {
            // console.log(newUser);
            var url = "/project/api/user/" + id;
            return $http.put(url, newUser);
        }

        function findUserByUsername(username){
            var url = "/api/user?username=" + username;
            return $http.get(url);
        }

        function createUser(user) {
            return $http.post("/api/user", user);
        }

        function deleteUser(userId) {
            var url = "/api/user/" + userId;
            return $http.delete(url);
        }
    }
})();
