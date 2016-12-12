(function () {

    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);

    function UserService($http) {

        var api =
        {
            createUser: createUser,
            findUserByCredentials: findUserByCredentials,
            findUserById: findUserById,
            findUserByUsername: findUserByUsername,
            findCurrentUser: findCurrentUser,
            updateUser: updateUser,
            deleteUser: deleteUser,
            login:login,
            logout: logout,
            register: register

        };return api;

        function register(user) {
            return $http.post("/api/register", user);
        }
        function findCurrentUser(){
            var url = "/api/user/";
            return $http.get(url);
        }

        function logout(user) {
            return $http.post("/api/logout");
        }


        function login(user) {
            return $http.post("/api/login", user);
        }


        function deleteUser(userId)
        {
            var url = "/api/user/" + userId;
            return $http.delete(url);
        }


        function updateUser(userId, user)
        {
            var url = "/api/user/" + userId;
            return $http.put(url, user);
        }


        function findUserByUsername(username)
        {
            var url = "/api/user?username=" + username;
            return $http.get(url);
        }


        function findUserById(userId)
        {
            var url = "/api/user/" + userId;
            return $http.get(url);
        }

        function findUserByCredentials(username, password)
        {
            var url = "/api/user?username=" + username + "&password=" + password;
            return $http.get(url);
        }

        function createUser(user)
        {
            return $http.post("/api/user", user);
        }


    }

})();

/*

        function unregisterUser(uid) {
            var url = "/api/user/" + uid;
            return $http.delete(url);
        }


        function gennewId(){
            newid=Math.floor(new Date().valueOf() * Math.random());

            return newid;

        }
        function updateUser(user) {
            var url = "/api/user/" + user._id;
            $http.put(url, user);
        }

        function createUser(user) {
            var nuser = {
                _id:gennewId(),
                username: user.username,
                password: user.password,
                firstName:"",
                lastName:""
            };
            return $http.post("/api/user", nuser);
        }

        function findUserById(userId) {
            var url = "/api/user/"+userId;
            return $http.get(url);
            // for(var u in users) {
            //     user = users[u];
            //     if(user._id === userId) {
            //         return user;
            //     }
            // }
            // return null;
        }

        function findUserByUsername(username) {
            var url = "/api/user?username=" + username;
            return $http.get(url);
        }

        function findUserByCredentials(username, password) {
            var url = '/api/user?username='+username+'&password='+password;
            return $http.get(url);
            // for(var u in users) {
            //     user = users[u];
            //     if(    user.username === username
            //         && user.password === password) {
            //         return user;
            //     }
            // }
            // return null;
        }
    }
})();
*/