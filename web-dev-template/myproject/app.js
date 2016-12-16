
module.exports = function(app) {

    var models = require("E:/web dev/Assignment-6/web-dev-template/myproject/models/models.server.js")();

    require("./services/bookuser.service.server")(app, models);
    require("./services/books.service.server")(app, models);
    require("./services/review.service.server")(app, models);
};