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
        vm.editWidget = editWidget;
        function init() {
            vm.widgets = WidgetService.findWidgetsByPageId(vm.pid);

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


        function editWidget(w){
            console.log(w);
            $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget/" + w._id);
        }
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

            var newWidget = WidgetService.createWidget(vm.pid, newWidgetType);
console.log(newWidget);
            if (newWidget) {

                $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget/" + newWidget._id);
            }
            else {
                vm.error = "Error. Please try again..";
            }

        }
    }
    function EditWidgetController($routeParams, WidgetService){
        var vm = this;
        vm.wid = $routeParams.wid;
        vm.uid = $routeParams.uid;
        vm.pid = $routeParams.pid;
        vm.wgid = $routeParams.wgid;
        vm.updateWidget = updateWidget;
        vm.deleteWidget = vm.deleteWidget;

        function init() {
            vm.widget = WidgetService.findWidgetById(vm.wgid);

        }
        init();

        function deleteWidget() {
            var res = WidgetService.deleteWidget(vm.wgid);
            if (res) {
                $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget");
            } else {
                vm.error = "Something went wrong.Please try again.";
            }
        }

        function updateWidget(newWidget){
            var res = WidgetService.updateWidget(newWidget);

            if(res){
                $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget");
            }
            else{
                vm.error ="Something went wrong.Please try again.";
            }

        }



    }

})();