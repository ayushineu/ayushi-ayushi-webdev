module.exports = function (app) {

    var pages = [

        { _id: "321", name: "Post 1", websiteId: "456", description: "Lorem" },
        { _id: "432", name: "Post 2", websiteId: "456", description: "Lorem" },
        { _id: "543", name: "Post 3", websiteId: "456", description: "Lorem" }
    ];

    app.post("/api/website/:websiteId/page", createPage);
    app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
    app.get("/api/page/:pageId", findPageById);
    app.put("/api/page/:pageId", updatePage);
    app.delete("/api/page/:pageId", deletePage);

    function createPage(req, res) {
        var npage = req.body;
        pages.push(npage);
        res.sendStatus(200);
    }

    function findAllPagesForWebsite(req,res){

        var websiteId = req.params.websiteId;

        var result = [];

        for(var p in pages){

            var page = pages[p];

            if(page.websiteId === websiteId){
                result.push(page);
            }
        }

        res.send(result);

    }

    function findPageById(req, res) {
        var pid = req.params.pageId;
        var response = '0';
        for (var p in pages) {
            if (pages[p]._id.toString() === pid.toString()) {
                response = pages[p];
            }
        }
        res.send(response);
    }

    function updatePage(req, res) {
        console.log("in here update 1");
        var page = req.body;
        var pid = req.params.pageId;
        var response = 400;
        for (var p in pages) {

            if (pages[p]._id === pid.toString()) {
                pages[p] = page;
                console.log("in here update 2");
                response = 200;
                break;
            }
        }
        res.sendStatus(response);
    }

    function deletePage(req, res) {
        var pid = req.params.pageId;
        for (var p in pages) {
            if (pages[p]._id.toString() == pid.toString()) {
                pages.splice(p, 1);
            }
        }
        res.sendStatus(200);
    }
}