module.exports = function () {
    var mongoose = require("mongoose");
    var UserSchema = require("./user.schema.server.js")();
    var UserModel = mongoose.model("userModel", UserSchema);

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        updateUser: updateUser,
        setModel: setModel,
        findUserByCredentials: findUserByCredentials,
        deleteUser: deleteUser
    };
    return api;

    function setModel(_model)
    {
        model = _model;
    }


    function createUser(user)
    {
        return UserModel.create(user);
    }

    function findUserById(userId)
    {
        console.log("came to find user from website model");
        console.log(userId);
        //var por = UserModel.findById(userId);
        //console.log(por);

        UserModel.find({_id: userId}, function(err, saved){
            if( err || !saved )
            {
                console.log("No user found");
            }
            else
                {
                console.log("User found");

            }

        });

        return UserModel.findById(userId);
    }

    function updateUser(userId, user)
    {
        console.log(user);
        return UserModel
            .update(
                {
                    _id: userId
                },
                {
                    $set:user
                    // username: user.username,
                    // firstName: user.first,
                    // lastName: user.last,
                    // email: user.email,

                }
            );

    }

    function deleteUser(userId)
    {
        return UserModel.remove({_id: userId});
    }

    function findUserByCredentials(username, password)
    {
        return UserModel
            .find
        (
            {
            username: username,
            password: password
            }
        );
    }

    function findUserByUsername(username)
    {
        return UserModel.find
        (
            {
            username: username
            }
        );
    }
};