(function(){
    angular
        .module("WebAppMaker")
        .controller("NewPageController",NewPageController)
        .controller("EditPageController", EditPageController)
        .controller("PageListController",PageListController);



    function NewPageController($routeParams, PageService, $location){
        var vm = this;
        vm.wid = $routeParams.wid;
        vm.uid = $routeParams.uid;
        vm.createNewPage = createNewPage;

        function createNewPage(userId,webId,newPage){
            if(newPage.name)
            {
                var promise = PageService.createPage(webId, newPage);
                promise
                    .success(function(nCreatedPage)
                    {
                        $location.url("/user/" + userId + "/website/" + webId + "/page");
                    })
                    .error(function(err)
                    {
                        vm.error = "Error.Please try again."
                    });
            }
            else{

                vm.error = "Please enter the Name";
            }
        }
    }


    function PageListController($routeParams,PageService) {
        var vm = this;

        function init(){
            vm.uid = $routeParams.uid;
            vm.wid = $routeParams.wid;
            var promise = PageService.findPageByWebsiteId(vm.wid);
            promise
                .success(function(pagelist) {
                    vm.pages=pagelist;
                });
        }
        init();
    }

    function EditPageController($routeParams, PageService, $location) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        vm.deletePage = deletePage;
        vm.updatePage = updatePage;

        PageService.findPageById(vm.pid)
            .success(function (cPage) {
                vm.currentpage = cPage;
            })
            .error(function (err) {
                vm.error = "Cannot find page. Please try again !!"
            });

        function updatePage(pageId, newPage) {
            console.log("in here update 3");
            console.log(pageId);
            PageService.updatePage(pageId, newPage)
                .success(function(res){
                    $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page");
                    console.log("in here update page");
                })
                .error(function(err){
                    vm.error = "Page id does not match";

                });

        }

        function deletePage(pageId) {
            PageService.deletePage(pageId)
                .success(function(aaa){
                    $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page");
                })

                .error(function(err){
                    vm.error = "Error.Please try again.";
                });


        }

    }


})();
