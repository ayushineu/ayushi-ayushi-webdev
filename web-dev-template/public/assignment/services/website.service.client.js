(function(){
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);

    function WebsiteService($http) {
        // var websites = [
        //     {_id: 321, name: 'facebook.com', uid: 123},
        //     {_id: 432, name: 'wikipedia.org', uid: 123},
        //     {_id: 543, name: 'twitter.com', uid: 234}
        // ];

        var api = {
            findWebsitesByUser: findWebsitesByUser,
            findWebsiteById: findWebsiteById,
            createWebsite: createWebsite,
            updateWebsite: updateWebsite,
            deleteWebsite: deleteWebsite
        };
        return api;



        function createWebsite(userId, website)
        {
            var url = "/api/user/" + userId + "/website";

            var newWebsite =
            {
                name: website.name,
                _user: userId,
                description: website.description
            };

            return $http.post(url, newWebsite);
        }


        function findWebsitesByUser(userId)
        {
            var url = "/api/user/" + userId + "/website";
            return $http.get(url);
        }


        function findWebsiteById(websiteId)
        {
            var url = "/api/website/" + websiteId;
            return $http.get(url);
        }


        function updateWebsite(websiteId, website)
        {
            var url = "/api/website/" + websiteId;
            return $http.put(url, website);
        }


        function deleteWebsite(websiteId)
        {
            var url = "/api/website/" + websiteId;
            return $http.delete(url);
        }
    }
})();
        /*

        function gennewId(){
            newid=Math.floor(new Date().valueOf() * Math.random());
            return newid;
        }


        function deleteWebsite(wid){
            var url = "/api/website/"+wid;
            return $http.delete(url);
        }

        function updateWebsite(wid,website) {
            var url = "/api/website/" + parseInt(wid);
            return $http.put(url, website);
        }

        function createWebsite(uid, website) {
            var nwebsite = {
                _id:gennewId(),
                name: website.name,
                uid: uid,
                description: website.description
            };
            var url = "/api/user/"+uid+"/website";
            return $http.post(url, nwebsite);
        }



        function findWebsiteById(wid) {
            var url = "/api/website/"+wid;
            return $http.get(url);
        }



        function findWebsitesForUser(uid) {
            var url = "/api/user/"+uid+"/website";
            return $http.get(url);
        }
    }
})();*/