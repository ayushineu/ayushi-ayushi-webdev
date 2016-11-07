module.exports = function (app) {

    var websites = [
        {_id: 321, name: 'facebook.com', uid: 123, description: "Lorem"},
        {_id: 432, name: 'wikipedia.org', uid: 123, description: "forem"},
        {_id: 543, name: 'twitter.com', uid: 234, description: "torem"},
        {_id: "123", name: "Facebook", uid: "456", description: "Lorem"},
        {_id: "234", name: "Tweeter", uid: "456", description: "Lorem"},
        {_id: "456", name: "Gizmodo", uid: "456", description: "Lorem"}
    ];

    app.get("/api/user/:userId/website", findAllWebsitesForUser);
    app.post("/api/user/:userId/website", createWebsite);
    app.put("/api/website/:websiteId", updateWebsite);
    app.get("/api/website/:websiteId", findWebsiteById);
    app.delete("/api/website/:websiteId", deleteWebsite);

    function createWebsite(req, res) {
        var nwebsite = req.body;
        websites.push(nwebsite);
        res.send(websites);
    }

    function findAllWebsitesForUser(req, res) {
        var uid = req.params.userId;
        var result = [];
        for (var w in websites) {
            if (websites[w].uid == uid) {
                result.push(websites[w]);
            }
        }
        res.send(result);
    }

    function deleteWebsite(req, res) {
        var wid = req.params.websiteId;
        for (var w in websites) {
            if (websites[w]._id.toString() == wid.toString()) {
                websites.splice(w, 1);
            }
        }
        res.sendStatus(200);
    }

    function findWebsiteById(req, res) {
        var wid = req.params.websiteId;
        var response = '0';
        for (var w in websites) {
            if (websites[w]._id.toString() === wid.toString()) {
                response = websites[w];
                break;
            }
        }
        res.send(response);
    }

    function updateWebsite(req, res) {
        var website = req.body;
        var wid = req.params.websiteId;
        var response = 400;
        for (var w in websites) {

            if (websites[w]._id.toString() === wid.toString()) {
                websites[w] = website;
                response = 200;
                break;
            }
        }
        res.sendStatus(response);
    }

};


