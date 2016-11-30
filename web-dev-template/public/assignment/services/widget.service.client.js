(function(){
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);

    function WidgetService($http) {
        /*var widgets = [
                { "_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "GIZMODO"},
                { "_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
                { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
                    "url": "http://lorempixel.com/400/200/"},
                { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
                { "_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
                { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
                    "url": "https://youtu.be/AM2Ivdi9c4E" },
                { "_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
            ];*/

        var api = {
            findWidgetById: findWidgetById,
            createWidget:createWidget,
            findWidgetsByPageId:findWidgetsByPageId,
            updateWidget:updateWidget,
            deleteWidget:deleteWidget,
            sort:sort


        };
        return api;

        function createWidget(pageId, widget)
        {
            //var newId = (new Date().getTime()).toString();
           // widget._id = newId;
            widget.pageId = pageId;
            var url = "/api/page/"+pageId+"/widget";
            return $http.post(url, widget);
        }


        // function getRandomId(min, max)
        // {
        //     min = Math.ceil(min);
        //     max = Math.floor(max);
        //     newId= Math.floor(Math.random() * (max - min)) + min;
        //
        //     return (findWidgetById(newId)) == null ? newId :getRandomId(min, max)
        // }

        function findWidgetById(wid)
        {
            console.log("in widget service client widge id "+wid);
            var url = "/api/widget/"+wid;
            return $http.get(url);

        }

        function findWidgetsByPageId(pageId)
        {
            var url = "/api/page/"+pageId+"/widget";
            return $http.get(url);
        }


        function updateWidget(widgetId, widget)
        {

            console.log("in widget update client service");
            var url = "/api/widget/"+widgetId;
            console.log("in update widget id is"+widgetId);
            return $http.put(url, widget);
        }

        function deleteWidget(widgetId)
        {
            var url = "/api/widget/" + widgetId;
            return $http.delete(url);
        }

        function sort(pageId,starti,endi)
        {
            var url = "/page/"+pageId+"/widget?initial="+starti+"&final="+endi;
            return $http.put(url);
        }
    }
})();