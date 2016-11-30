module.exports = function()
{
    var model = {};
    var mongoose = require("mongoose");
    var PageSchema = require("./page.schema.server")();
    var PageModel = mongoose.model("pageModel", PageSchema);

    var api =
    {
    createPage: createPage,
    findAllPagesForWebsite: findAllPagesForWebsite,
    findPageById: findPageById,
    updatePage: updatePage,
    deletePage: deletePage,
    setModel: setModel
    };
    return api;

    function setModel(_model)
    {
        model = _model;
    }

    function findAllPagesForWebsite(websiteId)
    {
        return PageModel.find({"_website": websiteId});
    }

    function findPageById(pageId)
    {
        return PageModel.findById(pageId);
    }

    function updatePage(pageId, page)
    {
        return PageModel
            .update
            (
                {_id: pageId},
                {
                $set: page
                }
            );
    }

    function deletePage(pageId)
    {
        return PageModel.remove({_id: pageId});
    }


    function createPage(websiteId, page)
    {

        return PageModel
            .create(page)
            .then
            (
                function (newPage)
                {
                    return model
                        .websiteModel
                        .findWebsiteById(websiteId)
                        .then
                        (
                            function (website)
                            {
                                website.pages.push(newPage);
                                newPage._website = website._id;
                                website.save();
                                newPage.save();
                                return newPage;
                            },
                            function (error)
                            {
                                console.log(error);
                            }
                        );
                },
                function (err)
                {
                    console.log("error in creating page");
                }
                );
    }
};