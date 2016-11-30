module.exports = function (app,model) {

    /*
    var pages = [

        { _id: "321", name: "Post 1", websiteId: "456", description: "Lorem" },
        { _id: "432", name: "Post 2", websiteId: "456", description: "Lorem" },
        { _id: "543", name: "Post 3", websiteId: "456", description: "Lorem" }
    ];*/

    app.post("/api/website/:websiteId/page", createPage);
    app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
    app.get("/api/page/:pageId", findPageById);
    app.put("/api/page/:pageId", updatePage);
    app.delete("/api/page/:pageId", deletePage);

    function createPage(req, res)
    {
        var npage = req.body;
        var websiteId = req.params.websiteId;

        model
            .pageModel
            .createPage(websiteId, npage)
            .then(function (npage)
                {
                    res.send(npage);
                },
                function (err)
                {
                    res.sendStatus(400).send(err);
                });

    }

    function findAllPagesForWebsite(req,res)
    {

        var websiteId = req.params.websiteId;

        model
            .pageModel
            .findAllPagesForWebsite(websiteId)
            .then
            (
                function (pages)
                {
                    res.json(pages);
                },
                function (err)
                {
                    res.sendStatus(400).send(err);
                }
            );

    }

    function findPageById(req, res)
    {
        var pid = req.params.pageId;
        model
            .pageModel
            .findPageById(pid)
            .then
            (
                function (page)
                {
                    res.json(page);
                },
                function (err)
                {
                    res.sendStatus(400).send(err);
                }
            );
    }

    function updatePage(req, res)
    {
        console.log("in here update 1");
        var page = req.body;
        var pid = req.params.pageId;
        model
            .pageModel
            .updatePage(pid, page)
            .then
            (
                function (status)
                {
                    res.sendStatus(200);
                },
                function (error)
                {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function deletePage(req, res)
    {
        var pid = req.params.pageId;
        model
            .pageModel
            .deletePage(pid)
            .then
            (
                function (status)
                {
                    res.sendStatus(200);
                },
                function (error)
                {
                    res.sendStatus(400).send(error);
                }
            );
    }
}