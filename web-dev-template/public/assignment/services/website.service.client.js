(function(){
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);

    function WebsiteService() {
        var websites = [
                { "_id": "123", "name": "Facebook",    "developerId": "456", "description": "Lorem" },
                { "_id": "234", "name": "Tweeter",     "developerId": "456", "description": "Lorem" },
                { "_id": "456", "name": "Gizmodo",     "developerId": "456", "description": "Lorem" },
                { "_id": "567", "name": "Tic Tac Toe", "developerId": "123", "description": "Lorem" },
                { "_id": "678", "name": "Checkers",    "developerId": "123", "description": "Lorem" },
                { "_id": "789", "name": "Chess",       "developerId": "234", "description": "Lorem" }
            ];

        var api = {
            findWebsiteById: findWebsiteById,
            createWebsite:createWebsite,
            findWebsiteByUser:findWebsiteByUser,
            updateWebsite:updateWebsite,
            deleteWebsite:deleteWebsite

        };
        return api;


        function deleteWebsite(websiteId) {

            for(var u in websites) {
                website = websites[u];
                if(website._id === websiteId) {
                    websites.splice(u,1);
                }
            }
        }

        function createWebsite(userId, website){

                var newId = getRandomId(0, 10000).toString();
                website._id = newId;
                website.developerId = userId;
                websites.push(website);
            return website;
        }

        function getRandomId(min, max)
        {
            min = Math.ceil(min);
            max = Math.floor(max);
            newId= Math.floor(Math.random() * (max - min)) + min;

            return (findWebsiteById(newId)) == null ? newId :getRandomId(min, max)
        }

        function findWebsiteByUser(userId){

            var result = [];
            for(var w in websites) {
                if(websites[w].developerId === userId) {
                    result.push(websites[w]);
                }
            }
            return result;


        }

        function updateWebsite(websiteId, website){
            old_website=findWebsiteById(websiteId);
            if (old_website)
            {
                old_website.name = website.name;
                old_website.description = website.description;
                return true;
            }
return false;
        }

        function findWebsiteById(wid) {
            for (var w in websites) {
                if (websites[w]._id === wid) {
                    return websites[w];
                }
            }
            return null;
        }


    }
})();
