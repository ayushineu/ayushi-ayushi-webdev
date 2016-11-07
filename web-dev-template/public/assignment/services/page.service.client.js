(function () {
    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);

    function PageService($http) {
        /*var pages = [
         { "_id": "321", "name": "Post 1", "websiteId": "456", "description": "Lorem" },
         { "_id": "432", "name": "Post 2", "websiteId": "456", "description": "Lorem" },
         { "_id": "543", "name": "Post 3", "websiteId": "456", "description": "Lorem" }
         ];*/

        var api = {
            findPageByWebsiteId: findPageByWebsiteId,
            createPage: createPage,
            findPageById: findPageById,
            updatePage: updatePage,
            deletePage: deletePage

        };
        return api;


        function createPage(websiteId, page) {

            var newId = (new Date().getTime()).toString();
            page._id = newId;
            page.websiteId = websiteId;
            var url = "/api/website/" + websiteId + "/page";
            return $http.post(url, page);
        }


        function getRandomId(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            newId = Math.floor(Math.random() * (max - min)) + min;

            return (findPageById(newId)) == null ? newId : getRandomId(min, max)
        }


        function findPageByWebsiteId(websiteId){
            var url = "/api/website/"+websiteId+"/page";
            return $http.get(url);
        }

        function findPageById(pageId) {

            var url = "/api/page/" + pageId;
            return $http.get(url);

        }


        function deletePage(pageId) {

            var url = "/api/page/" + pageId;
            return $http.delete(url);
        }


        function updatePage(pageId, page) {
            var url = "/api/page/" + pageId;
            return $http.put(url, page);
        }
    }
})();
