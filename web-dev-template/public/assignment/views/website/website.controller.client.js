(function ()
{
    angular
        .module("WebAppMaker")
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("WebsiteListController", WebsiteListController)
        .controller("EditWebsiteController", EditWebsiteController);


    function NewWebsiteController($routeParams, WebsiteService, $location)
    {

        var web = this;
        web.uid = $routeParams.uid;
        web.createNewWebsite = createNewWebsite;

        function init()
        {
            //web.website = {"name":"","description":""};
            var promise = WebsiteService.findWebsitesByUser(web.uid)
            promise
                .success(function (weblist) {
                    web.websites = weblist;
                })
                .error(function (err) {
                    web.error = "Some error occurred";

                });

        }

        init();

        function createNewWebsite(newWebsite)
        {
            console.log("nme "+newWebsite);
            if (newWebsite != null && newWebsite.name != "")

            {
                console.log("in website controller");
                console.log(newWebsite);
                console.log($routeParams.uid);
                var promise = WebsiteService.createWebsite($routeParams.uid, newWebsite);
                promise
                    .success(function (aaa)
                    {

                        $location.url("/user/" + $routeParams.uid+ "/website");

                    })
                    .error(function (err) {
                        web.error = "Error. Please try again."
                    })


            }
            else
                {
                web.error = "Please enter the Name of the website";
            }

        }

    }

    function WebsiteListController($routeParams, WebsiteService)
    {

        var web = this;
        web.uid = $routeParams.uid;

        function init() {
            var promise = WebsiteService.findWebsitesByUser(web.uid);
            promise
                .success(function (websitelist) {
                    web.websites = websitelist;
                })
        }

        init();

    }


    function EditWebsiteController($routeParams, WebsiteService, $location) {

        var web = this;
        web.wid = $routeParams.wid;
        web.uid = $routeParams.uid;
        web.deleteWebsite = deleteWebsite;
        web.updateWebsite = updateWebsite;

        function init()
        {
            WebsiteService.findWebsitesByUser(web.uid)
                .success(function (websitelist)
                {
                    web.websites = websitelist;
                })
                .error(function (err)
                {
                    web.error = "Something went wrong";
                });

            WebsiteService.findWebsiteById(web.wid)
                .success(function (webi)
                {
                    web.newWebsite = webi;
                })
                .error(function (err)
                {
                    web.error = "Something went wrong";
                });
        }
        init();

        function deleteWebsite()
        {
            WebsiteService.deleteWebsite(web.wid)
                .success(function (aaa)
                {
                    $location.url("/user/" + $routeParams.uid + "/website");
                })
                .error(function (err)
                {
                    web.error = "Error.Please try again."
                });
        }

        function updateWebsite(webId, newWebsite)
        {
            if (web.newWebsite.name != null && web.newWebsite.name != "")
            {
                WebsiteService.updateWebsite(web.wid, web.newWebsite)
                    .then(function (response)
                    {
                        $location.url("/user/" + web.uid + "/website");
                    }, function (error)
                    {
                        web.error = "Failed to update website";
                    });
            }
            else
                {
                web.error = "Please give a website name";
            }
        }
    }
})();