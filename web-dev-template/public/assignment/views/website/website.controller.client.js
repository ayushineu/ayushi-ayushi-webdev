(function() {
    angular
        .module("WebAppMaker")
        .controller("NewWebsiteController",NewWebsiteController)
        .controller("WebsiteListController",WebsiteListController)
        .controller("EditWebsiteController",EditWebsiteController);


    function NewWebsiteController($routeParams, WebsiteService, $location) {

        var web = this;
        web.uid = $routeParams.uid;
        web.createNewWebsite = createNewWebsite;

        function init(){
            web.websites = WebsiteService.findWebsiteByUser(web.uid);
            console.log(web.websites);
        }
        init();

        function createNewWebsite(newWebsite){
            if(newWebsite.name )
            {

                var newCreatedWebsite = WebsiteService.createWebsite($routeParams.uid, newWebsite);
                console.log(newCreatedWebsite);
                if (newCreatedWebsite) {
                    $location.url("/user/" + $routeParams.uid +"/website");
                }
                else {
                    web.error = "Error. Please try again."
                }


            }
            else{
                web.error="Please enter the Name of the website";
            }

        }

    }

    function WebsiteListController($routeParams, WebsiteService) {

        var web = this;
        web.uid = $routeParams.uid;

        function init(){
            web.websites = WebsiteService.findWebsiteByUser(web.uid);
            console.log(web.websites);
        }
        init();

    }



    function EditWebsiteController($routeParams, WebsiteService, $location) {

        var web = this;
        web.wid = $routeParams.wid;
        web.uid = $routeParams.uid;
        web.deleteWebsite = deleteWebsite;
        web.updateWebsite = updateWebsite;

        function init() {
            web.websites = WebsiteService.findWebsiteByUser(web.uid);
        }
        init();

        var webi = WebsiteService.findWebsiteById(web.wid);
        if (webi != null) {
            web.website = webi;
        }

        function deleteWebsite(websiteId) {
            var result = WebsiteService.deleteWebsite(websiteId);


            if (result != null) {
                $location.url("/user/" + $routeParams.uid + "/website");
            }
            else {
                web.error = "Error.Please try again."
            }

        }
        function updateWebsite(webId, newWebsite) {
            var nWebsite = WebsiteService.updateWebsite(webId, newWebsite);
            console.log(nWebsite);
            if (nWebsite) {
                $location.url("/user/" + $routeParams.uid + "/website");
            }
            else {
                web.error = "Website id does not match"
            }
        }
    }

})();