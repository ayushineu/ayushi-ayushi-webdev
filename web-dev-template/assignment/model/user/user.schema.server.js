module.exports = function () {
    var mongoose = require("mongoose");

    var UserSchema = mongoose.Schema(
        {
            username: {type: String, required: true},
            password: String,
            firstName: String,
            lastName: String,
            email: String,
            phone: String,
<<<<<<< HEAD
            facebook: {
                id:    String,
                token: String
            },
=======
>>>>>>> origin/master
            dateCreated: {type: Date, default: Date.now()},
            websites: [{type: mongoose.Schema.Types.ObjectId, ref: 'WebsiteModel'}],
        },
        {collection: "user"});
    return UserSchema;
};