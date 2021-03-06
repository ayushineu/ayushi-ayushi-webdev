(function() {
    angular
        .module("WebAppMaker")
        .controller("FlickrImageSearchController", FlickrImageSearchController);

    function FlickrImageSearchController($routeParams, $location, WidgetService, FlickrService)
    {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        vm.widgetId = $routeParams.wgid;

        vm.searchPhotos = searchPhotos;
        vm.selectPhoto = selectPhoto;

        function init() {

            WidgetService.findWidgetById(vm.widgetId)
                .success(function(widget)
                {
                    vm.widget = widget;
                })
                .error(function(err)
                {
                    console.log("IN FLICKER INIT- CONTROLLER");
                    console.log(err);
                });

        }
        init();

        function searchPhotos(searchTerm){
            FlickrService
                .searchPhotos(searchTerm)
                .then(function(response) {
                    data = response.data.replace("jsonFlickrApi(","");
                    data = data.substring(0,data.length - 1);
                    data = JSON.parse(data);
                    vm.photos = data.photos;
                }, function(err){
                    console.log("ERROR IN SEARCHING");
                    }
                );
        }


        function selectPhoto(photo)
        {
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
            url += "/" + photo.id + "_" + photo.secret + "_b.jpg";
            vm.widget.url = url;
            WidgetService
                .updateWidget(vm.widgetId, vm.widget)
                .then(
                    function(status)
                    {
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
                    },
                    function(err)
                    {
                        vm.error="Widget update failed";
                    }
                );
        }
    }
})();