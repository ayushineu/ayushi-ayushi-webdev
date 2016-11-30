
module.exports = function(app,model) {

    /*var widgets = [
        { "_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "GIZMODO"},
        { "_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
            "url": "http://lorempixel.com/400/200/"},
        { "_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
            "url": "https://youtu.be/AM2Ivdi9c4E" },
        { "_id": "789", "widgetType": "HEADER", "pageId": "321", "text": "Lorem ipsum", size:4}
    ];*/

    var multer = require('multer');
    var upload = multer({dest: __dirname + '/../../public/uploads'});

    app.post("/api/upload", upload.single('myFile'), uploadImage);
    app.post("/api/page/:pageId/widget",createWidget);
    app.get("/api/page/:pageId/widget",findAllWidgetsForPage);
    app.get("/api/widget/:widgetId",findWidgetById);
    app.put("/api/widget/:widgetId",updateWidget);
    app.delete("/api/widget/:widgetId",deleteWidget);
    app.put("/page/:pageId/widget",updateWidgetOrder);

    function createWidget(req,res)
    {

        var nWidget = req.body;
        var pageId = req.params.pageId;

        model
            .widgetModel
            .createWidget(pageId, nWidget)
            .then(function (nWidget)
                {
                    res.send(nWidget);
                },
                function (err)
                {
                    console.log("ERROR IN CREATING WIDGET - SERVICE SERVER");
                    res.sendStatus(400).send(err);
                });

    }


    function findAllWidgetsForPage(req,res)
    {
        var pageId = req.params.pageId;

        model
            .widgetModel
            .findAllWidgetsForPage(pageId)
            .then(
                function (widgets)
                {
                    res.json(widgets);
                },
                function (err)
                {
                    console.log("ERROR IN findall WIDGET - SERVICE SERVER");
                    res.sendStatus(400).send(err);
                }
            );

    }

    // function mysort(req, res) {
    //     var start = req.query.initial;
    //     var end = req.query.final;
    //     console.log(start,end);
    //     widgets.splice(end, 0, widgets.splice(start, 1)[0]);
    // }

    function findWidgetById(req,res)
    {

        var widgetid = req.params.widgetId;
        console.log("in widget service client widge id "+widgetid);
        model
            .widgetModel
            .findWidgetById(widgetid)
            .then(
                function (widget)
                {
                    res.json(widget);
                },
                function (err)
                {
                    console.log("ERROR IN FINDWIDGETBYID");
                    res.sendStatus(400).send(err);
                });
    }



    function updateWidget(req,res)
    {
        var widget = req.body;
        var widgetid = req.params.widgetId;
        model
            .widgetModel
            .updateWidget(widgetid, widget)
            .then(
                function (status)
                {
                    res.sendStatus(200);
                },
                function (error)
                {
                    console.log("ERROR IN UPDATE WIDGET");
                    res.sendStatus(400).send(error);
                }
            );
    }


    function deleteWidget(req,res)
    {
        var widgetid = req.params.widgetId;
        model
            .widgetModel
            .deleteWidget(widgetid)
            .then(
                function (status)
                {
                    res.sendStatus(200);
                },
                function (error)
                {
                    console.log("ERROR IN DELETE WIDGET SERVICE -SERVER");
                    res.sendStatus(400).send(error);
                }
            );
    }


    function uploadImage(req, res)
    {
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


        model
            .widgetModel
            .findWidgetById(widgetId)
            .then(
                function (widget)
                {
                    widget.url = "/uploads/" + filename;
                    model
                        .widgetModel
                        .updateWidget(widgetId, widget)
                        .then(
                            function (updatedWidget)
                            {
                                res.redirect("/assignment/#/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId);
                            },
                            function (failedUpdate)
                            {
                                console.log("inner error upload image");
                                res.sendStatus(400).send(failedUpdate);
                            }
                        );
                },
                function (error)
                {
                    console.log("outer error upload image");
                    res.sendStatus(400).send(error);
                }
            );
    }


    function updateWidgetOrder(req, res)
    {
        var pageId = req.params.pageId;
        var start = parseInt(req.query.initial);
        var end = parseInt(req.query.final);

        model
            .widgetModel
            .reorderWidget(pageId, start, end)
            .then(
                function (stats)
                {
                    res.sendStatus(200);
                },
                function (error)
                {
                    console.log("ERROR IN WIDGET ORDER - SERVICE SERVER");
                    res.sendStatus(400);
                });
    }

}
