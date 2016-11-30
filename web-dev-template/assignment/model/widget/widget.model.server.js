module.exports = function ()
{
    var model = {};
    var mongoose = require('mongoose');
    var WidgetSchema = require('./widget.schema.server')();
    var WidgetModel = mongoose.model("widgetModel", WidgetSchema);

    var api =
    {
        createWidget: createWidget,
        findAllWidgetsForPage: findAllWidgetsForPage,
        findWidgetById: findWidgetById,
        updateWidget: updateWidget,
        deleteWidget: deleteWidget,
        reorderWidget: reorderWidget,
        setModel: setModel
    };
    return api;

    function setModel(_model)
    {
        model = _model;
    }

    function createWidget(pageId, widget)
    {
        delete widget.pageId;
        widget._page = pageId;

        return WidgetModel
            .find({"_page": pageId})
            .then
            (
                function (widgets)
                {
                    console.log("in create widget model");
                    widget.order = widgets.length;
                    return WidgetModel
                        .create(widget)
                        .then(
                            function (newWidget)
                            {
                                return model
                                    .pageModel
                                    .findPageById(newWidget._page)
                                    .then(
                                        function (page)
                                        {
                                            page.widgets.push(newWidget);
                                            newWidget._page = page._id;
                                            page.save();
                                            newWidget.save();
                                            return newWidget;
                                        },
                                        function (err)
                                        {
                                            console.log("ERROR IN WIDGET MODEL - findPageById");
                                        }
                                    );
                            },
                            function (err)
                            {
                                console.log("ERROR IN WIDGET MODEL - create");
                            }
                            );

                },
                function (err)
                {
                    return null;
                }
            );
    }

    function findAllWidgetsForPage(pageId)
    {
        return WidgetModel.find({"_page": pageId});
    }

    function findWidgetById(widgetId)
    {
        return WidgetModel.findById(widgetId);
    }

    function updateWidget(widgetId, widget)
    {
        return WidgetModel
            .update
            (
                {_id: widgetId},
                {
                    $set: widget
                })
            ;
    }

    function deleteWidget(widgetId)
    {
        return WidgetModel.remove({_id: widgetId});
    }

    function reorderWidget(pageId, start, end)
    {

        return WidgetModel
            .find({_page: pageId}, function (err, widgets)
            {
                widgets.forEach(function (widget)
                {
                    if (start < end)
                    {
                        if (widget.order > start && widget.order <= end)
                        {
                            widget.order = widget.order - 1;
                            widget.save();
                        }

                        else if (widget.order === start)
                        {
                            widget.order = end;
                            widget.save();
                        }

                    }
                    else
                        {
                        if (widget.order === start)
                        {
                            widget.order = end;
                            widget.save();
                        }

                        else if (widget.order < start && widget.order >= end)
                        {
                            widget.order = widget.order + 1;
                            widget.save();
                        }
                    }
                }
                );
            }
            );
    }

};