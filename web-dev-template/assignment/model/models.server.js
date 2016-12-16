module.exports = function(){
    var mongoose = require('mongoose');
    // mongoose.createConnection('mongodb://localhost/web-dev-fall-2016');

    var userModel = require("./user/user.model.server")();
    var websiteModel = require("./website/website.model.server")();
    var pageModel = require("./page/page.model.server")();
    var widgetModel = require("./widget/widget.model.server")();

    var model = {
        userModel: userModel,
        websiteModel: websiteModel,
        pageModel: pageModel,
        widgetModel: widgetModel
    };

    widgetModel.setModel(model);
    pageModel.setModel(model);
    websiteModel.setModel(model);
    userModel.setModel(model);


    return model;
}