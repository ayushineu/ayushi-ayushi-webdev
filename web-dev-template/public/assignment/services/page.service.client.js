(function(){
    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);

    function PageService() {
        var pages = [
                { "_id": "321", "name": "Post 1", "websiteId": "456", "description": "Lorem" },
                { "_id": "432", "name": "Post 2", "websiteId": "456", "description": "Lorem" },
                { "_id": "543", "name": "Post 3", "websiteId": "456", "description": "Lorem" }
            ];

        var api = {
            findPageByWebsiteId: findPageByWebsiteId,
            createPage:createPage,
            findPageById:findPageById,
            updatePage:updatePage,
            deletePage:deletePage

        };
        return api;


        function createPage(websiteId, page){

            var newId = getRandomId(0, 10000).toString();
            page._id = newId;
            page.websiteId = websiteId;
            pages.push(page);
            return page;
        }


        function getRandomId(min, max)
        {
            min = Math.ceil(min);
            max = Math.floor(max);
            newId= Math.floor(Math.random() * (max - min)) + min;

            return (findPageById(newId)) == null ? newId :getRandomId(min, max)
        }


        function findPageByWebsiteId(websiteId){

            var result = [];
            for(var w in pages) {
                if(pages[w].websiteId === websiteId) {
                    result.push(pages[w]);
                }
            }
            return result;


        }

        function findPageById(pageId){

            for (var w in pages) {
                if (pages[w]._id === pageId) {
                    return pages[w];
                }
            }
            return null;

        }


        function deletePage(pageId) {

            for(var u in pages) {
                page = pages[u];
                if(page._id === pageId) {
                    pages.splice(u,1);
                    return pages;
                }

            }
            return null;
        }


        function updatePage(pageId, page){
            old_page=findPageById(pageId);
            if (old_page) {
                old_page.name = page.name;
                old_page.description = page.description;
                return true;
            }
return false;
        }


    }
})();
