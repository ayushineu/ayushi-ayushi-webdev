
module.exports = function(app) {

    var widgets = [
        { "_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "GIZMODO"},
        { "_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
            "url": "http://lorempixel.com/400/200/"},
        { "_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
            "url": "https://youtu.be/AM2Ivdi9c4E" },
        { "_id": "789", "widgetType": "HEADER", "pageId": "321", "text": "Lorem ipsum", size:4}
    ];

    var multer = require('multer');
    var upload = multer({dest: __dirname + '/../../public/uploads'});

    app.post("/api/upload", upload.single('myFile'), uploadImage);
    app.post("/api/page/:pageId/widget",createWidget);
    app.get("/api/page/:pageId/widget",findAllWidgetsForPage);
    app.get("/api/widget/:widgetId",findWidgetById);
    app.put("/api/widget/:widgetId",updateWidget);
    app.delete("/api/widget/:widgetId",deleteWidget);
    app.put("/page/:pageId/widget",mysort);

    function createWidget(req,res){

        var nwidget= req.body;
        console.log(nwidget);
        widgets.push(nwidget);
        res.send(nwidget);

    }


    function findAllWidgetsForPage(req,res){
        var pageId = req.params.pageId;

        var result = [];

        for(var w in widgets){

            var widget = widgets[w];

            if(widget.pageId == pageId){
                result.push(widget);
            }
        }

        res.send(result);

    }

    function mysort(req, res) {
        var start = req.query.initial;
        var end = req.query.final;
        console.log(start,end);
        widgets.splice(end, 0, widgets.splice(start, 1)[0]);
    }

    function findWidgetById(req,res){

        var widgetid = req.params.widgetId;
        var response = '0';
        for (var w in widgets) {
            if (widgets[w]._id === widgetid.toString()) {
                console.log("inside wefew");
                response = widgets[w];
            }
        }
        res.send(response);
    }



    function updateWidget(req,res){
        var widget = req.body;
        var widgetid = req.params.widgetId;
        var response = 400;
        for (var w in widgets) {

            if (widgets[w]._id.toString() === widgetid.toString()) {
                widgets[w] = widget;
                console.log("widget found !! in widget server");
               // response = 200;
                res.send(200);
                return;
            }
        }
        res.sendStatus(response);
    }


    function deleteWidget(req,res){
        var widgetid = req.params.widgetId;
        for (var w in widgets) {
            if (widgets[w]._id.toString() == widgetid.toString()) {
                widgets.splice(w, 1);
            }
        }
        res.sendStatus(200);
    }


    function uploadImage(req, res) {
        var userId = req.body.userId;
        var websiteId = req.body.websiteId;
        var pageId = req.body.pageId;
        var widgetId = req.body.widgetId;
        var width = req.body.width;
        var myFile = req.file;
        var filename = myFile.filename;
        var originalname = myFile.originalname;
        var destination = myFile.destination;
        var path = myFile.path;
        var mimetype = myFile.mimetype;
        var size = myFile.size;


        for (var i in widgets) {
            if (widgets[i]._id === widgetId) {
                widgets[i].url = "/uploads/" + filename;
            }
        }
        res.redirect("/assignment/#/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId);
    }

}
