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
                .success(function (foundWidgets)
                {
                    vm.widgets = foundWidgets;
                })
                .error(function (err)
                {
                    vm.error = "Error. Please try again";
                });
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
            $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget/" + w._id);
        }
    }

    function NewWidgetController($location ,$routeParams, WidgetService){
        var vm = this;
<<<<<<< HEAD
        function init() {
            vm.uid = $routeParams.uid;
            vm.wid = $routeParams.wid;
            vm.pid = $routeParams.pid;
            vm.wgid = $routeParams.wgid;
            vm.createYoutube = {name: "Youtube Widget", type: "YOUTUBE", width: "100%", url: ""};
            vm.createHeader = {name: "Header Widget", type: "HEADER", size: 2, text: "New Header Text"};
            vm.createImage = {name: "Image Widget", type: "IMAGE", width: "100%", url: ""};
            vm.createHTML = {name: "HTML Widget", type: "HTML", text: ""};
            vm.createTEXT = {
                name: "Text Input Widget",
                type: "INPUT",
                formatted: false,
                rows: 1,
                placeholder: "",
                text: ""
            };
        } init();
=======
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        vm.wgid = $routeParams.wgid;
        vm.createYoutube = {name:"Youtube Widget", type: "YOUTUBE", width: "100%", url: ""};
        vm.createHeader ={ name:"Header Widget", type: "HEADER", size: 2, text: "New Header Text"};
        vm.createImage= { name:"Image Widget", type: "IMAGE", width: "100%", url: ""};
        vm.createHTML = {name:"HTML Widget", type: "HTML",text:""};
        vm.createTEXT = {name:"Text Input Widget", type: "INPUT",formatted: false,rows: 1,placeholder:"",text:""};
>>>>>>> origin/master
        vm.createWidget = createWidget;


        function createWidget(newWidgetType)
        {

            WidgetService.createWidget(vm.pid, newWidgetType)
                .success(function(newWidget)
                {
                    console.log(newWidget._id);
                    $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget/" + newWidget._id);
                })
                .error(function(err)
                {
                    console.log("ERROR in create widget");
                    vm.error = "Error. Please try again.";
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

<<<<<<< HEAD
            WidgetService.findWidgetById(vm.wgid)
                .success(function(fwidget){
                    vm.widget=fwidget;
                })
=======
             WidgetService.findWidgetById(vm.wgid)
                 .success(function(fwidget){
                     vm.widget=fwidget;
                 })
>>>>>>> origin/master

        }
        init();

<<<<<<< HEAD

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
        //
        // function validateWidgetType(widgetToTest){
        //     var validationFailed = false;
        //
        //     switch(widgetToTest.type){
        //         case "HEADING":
        //             if(widgetToTest.text == '' || widgetToTest.text == null){
        //                 validationFailed = true;
        //             }
        //             break;
        //         case "IMAGE":
        //             if(widgetToTest.url == '' || widgetToTest.url == null){
        //                 validationFailed = true;
        //             }
        //             break;
        //         case "YOUTUBE":
        //             if(widgetToTest.url == '' || widgetToTest.url == null){
        //                 validationFailed = true;
        //             }
        //             break;
        //     }
        //
        //     return validationFailed;
        // }
        //
        // function updateWidget(){
        //     if(validateWidgetType(vm.currentWidget)){
        //         switch(vm.currentWidget.type) {
        //             case "HEADING":
        //                 vm.error = "Header Text cannot be blank";
        //                 break;
        //             case "IMAGE":
        //                 vm.error = "Image Url cannot be blank";
        //                 break;
        //             case "YOUTUBE":
        //                 vm.error = "Video Url cannot be blank";
        //                 break;
        //             default:
        //                 vm.error = "There is something wrong. Please check whether form fields are correctly filled."
        //                 break;
        //         }
        //     }
        //     else {
        //         WidgetService.updateWidget(vm.wgid, vm.currentWidget)
        //             .then(function (response) {
        //                 $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget");
        //             }, function (err) {
        //                 vm.error = "Failed to update widget";
        //             });
        //     }
        // }

        //
        //
=======
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



>>>>>>> origin/master
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