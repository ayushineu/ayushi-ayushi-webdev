module.exports = function() {

    var mongoose = require('mongoose');

    var BooksUserSchema = require("./bookuser.schema.server.js")();

    var bookuserModel = mongoose.model("bookuserModel", BooksUserSchema);

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByCredentials: findUserByCredentials,
        findUserByUsername: findUserByUsername,
        findGoogleUser: findGoogleUser,
        updateUser: updateUser,
        uploadImage: uploadImage,
        deleteUser: deleteUser,
        setModel:setModel,
        findalluser:findalluser

    };
    return api;

    function setModel(_model)
    {
        model = _model;
    }

    function uploadImage(userId, url) {
        return bookuserModel.update({_id: userId}, {
            $set: {url: url}
        });
    }

    function findalluser(){
        return bookuserModel.find({});
    }
    function deleteUser(userId) {
        return bookuserModel.remove({_id: userId});
    }

    function updateUser(userId, newUser) {
        delete newUser._id;
        return bookuserModel.update({_id: userId}, {
            $set: newUser
        });
    }

    // function findFacebookUser(id) {
    //     return User.findOne({"facebook.id": id});
    // }

    function findGoogleUser(id) {
        return bookuserModel.findOne({"google.id": id});
    }

    function findUserByUsername(username) {
        return bookuserModel.findOne({username: username});
    }

    function findUserByCredentials(username, password) {
        return bookuserModel.findOne({username: username, password: password});
    }

    function findUserById(userId) {
        return bookuserModel.findById(userId);
    }

    function createUser(user){
        user.type="User";
        return bookuserModel.create(user);

    }

};