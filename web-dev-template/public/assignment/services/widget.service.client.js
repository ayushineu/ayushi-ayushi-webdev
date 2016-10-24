(function(){
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);

    function WidgetService() {
        var widgets = [
                { "_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "GIZMODO"},
                { "_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
                { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
                    "url": "http://lorempixel.com/400/200/"},
                { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
                { "_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
                { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
                    "url": "https://youtu.be/AM2Ivdi9c4E" },
                { "_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
            ];

        var api = {
            findWidgetById: findWidgetById,
            createWidget:createWidget,
            findWidgetsByPageId:findWidgetsByPageId,
            updateWidget:updateWidget,
            deleteWidget:deleteWidget

        };
        return api;

        function createWidget(pageId, widget){
            var newId = getRandomId(0, 10000).toString();
            widget._id = newId;
            widget.pageId = pageId;
            widgets.push(widget);
            return widget;
        }


        function getRandomId(min, max)
        {
            min = Math.ceil(min);
            max = Math.floor(max);
            newId= Math.floor(Math.random() * (max - min)) + min;

            return (findWidgetById(newId)) == null ? newId :getRandomId(min, max)
        }

        function findWidgetById(wid) {
            for(var w in widgets) {
                if(widgets[w]._id == wid) {
                    return widgets[w];
                }
            }
            return null;
        }

        function findWidgetsByPageId(pageId) {
            var result = [];
            for(var w in widgets) {
                if(widgets[w].pageId === pageId) {
                    result.push(widgets[w]);
                }
            }
            return result;
        }

        function updateWidget(widgetId, widget) {
            old_widget=findWidgetById(widgetId);
            if(old_widget) {
                old_widget.text = widget.text;
                old_widget.url = widget.url;
                old_widget.widgetType = widget.widgetType;
                old_widget.size = widget.size;
                old_widget.width = widget.width;
                return true;
            }
return false;
        }

        function deleteWidget(widgetId){

            for(var u in widgets) {
                widget = widgets[u];
                if(widget._id === widgetId) {
                    widgets.splice(u,1);
                    return widgets;
                }

            }
            return null;

        }
    }
})();