(function(){
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);

    function UserService($http) {


        var api = {
            findUserByCredentials: findUserByCredentials,
            findUserById: findUserById,
            createUser: createUser,
            findUserByUsername: findUserByUsername,
            updateUser: updateUser,
            unregisterUser: unregisterUser
        };
        return api;

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