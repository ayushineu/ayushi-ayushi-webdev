(function() {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController",NewWidgetController)
        .controller("EditWidgetController",EditWidgetController);

    function WidgetListController($sce, $routeParams, WidgetService, $location) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.pid = $routeParams.pid;
        vm.wid = $routeParams.wid;
        vm.checkSafeURL = checkSafeURL;
        vm.getSafeHtml = getSafeHtml;
        vm.editRedirect = editRedirect;
        function init() {
            console.log("list widgets");
             WidgetService.findWidgetsByPageId(vm.pid)
                 .success(function(widgetlist){
                     vm.widgets =widgetlist;
                 })

        }
        init();

        function checkSafeURL(widgetURL)
        {
            var csu = widgetURL.split('/');
            var id = csu[csu.length - 1];
            url = "https://www.youtube.com/embed/"+id;

            return $sce.trustAsResourceUrl(url);
        }

        function getSafeHtml(text) {
            return $sce.trustAsHtml(text);
        }


        function editRedirect(w){
            if (w.widgetType != "HTML"){
            $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget/" + w._id);
        }}
    }

    function NewWidgetController($location ,$routeParams, WidgetService){
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        vm.wgid = $routeParams.wgid;
        vm.createYoutube = {"widgetType": "YOUTUBE",  "width": "" , "url": "" };
        vm.createHeader ={ "_id": "", "widgetType": "HEADER",  "size": "", "text": ""};
        vm.createImage= { "_id": "", "widgetType": "IMAGE", "width":"", "url": ""};
        vm.createWidget = createWidget;


        function createWidget(newWidgetType){

            WidgetService.createWidget(vm.pid, newWidgetType)
                .success(function(newWidget){
                    console.log(newWidget._id);
                    $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget/" + newWidget._id);
                })
                .error(function(err){
                    vm.error = "Error. Please try again..";
                });

            }


    }
    function EditWidgetController($routeParams, WidgetService, $location){
        var vm = this;
        vm.wid = $routeParams.wid;
        vm.uid = $routeParams.uid;
        vm.pid = $routeParams.pid;
        vm.wgid = $routeParams.wgid;
        vm.updateWidget = updateWidget;
        vm.deleteWidget = deleteWidget;

        function init() {
            console.log(vm.wgid);

             WidgetService.findWidgetById(vm.wgid)
                 .success(function(fwidget){
                     vm.widget=fwidget;
                 })

        }
        init();

        function deleteWidget(widgetdel) {
            console.log("atleast here");
            WidgetService.deleteWidget(widgetdel._id)
                .success(function(res){
                    console.log("in del funct");
                    $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget");
                })

                .error(function(err)
                {
                    vm.error = "Error Please try again.";
                });

            }


        function updateWidget(newwidget){

            WidgetService.updateWidget(vm.wgid,vm.widget)
                .success(function(aa){
                    console.log("in widget update "+vm.widget);
                    $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget");
                })

                .error(function(err){
                    console.log("in widget update error");
                    vm.error ="Error.Please try again.";
                });
        }
    }

})();