module.exports = function()
{
    var model = {};
    var mongoose = require("mongoose");
    var WebsiteSchema = require("./website.schema.server")();
    var WebsiteModel = mongoose.model("WebsiteModel", WebsiteSchema);



    var api =
    {
        createWebsiteForUser: createWebsiteForUser,
        findAllWebsitesForUser: findAllWebsitesForUser,
        findWebsiteById: findWebsiteById,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite,
        setModel: setModel
    }; return api;


    function setModel(_model)
    {
        model = _model;
    }

    function deleteWebsite(websiteId)
    {

        return WebsiteModel.remove({_id: websiteId});
    }


    function updateWebsite(websiteId, website)
    {
        return WebsiteModel
            .update
            (
                {_id: websiteId},
                {
                 $set: website
                }
            );
    }


    function findWebsiteById(websiteId)
    {
        return WebsiteModel.findById(websiteId);
    }



    function findAllWebsitesForUser(userId)
    {
        return WebsiteModel.find({"_user": userId});
    }



    function createWebsiteForUser(userId, website)
    {
        return WebsiteModel
            .create(website)
            .then(
                function (newWebsite)
                {
                    console.log("in model server");
                    console.log(website);
                    console.log(newWebsite);
                    // var porm = model.userModel.findUserById(userId);
                    // console.log(porm);
                    return model
                        .userModel
                        .findUserById(userId)
                        .then
                        (
                            function (user)
                            {
                                console.log("FOUND USER");
                                user.websites.push(newWebsite);
                                newWebsite._user = user._id;
                                user.save();
                                newWebsite.save();
                                return newWebsite;
                            },
                            function (error)
                            {
                                console.log("error in creating website");
                            }
                        );
                },
                function (error)
                {
                    console.log("NOT FOUND USER");
                    console.log(error);
                }
                );
    }


};