module.exports = function () {

    var mongoose = require("mongoose");

    var WidgetSchema = mongoose.Schema({
        _page:  {type: mongoose.Schema.ObjectId, ref:"pageModel"},
        type: {type: String, enum: ['HEADER', 'IMAGE', 'YOUTUBE', 'HTML', 'INPUT']},
        name: {type: String, required: true},
        deletable: Boolean,
        formatted: Boolean,
        class: String,
        icon: String,
        text: String,
        url: String,
        width: String,
        height: String,
        placeholder: String,
        description: String,
        rows: Number,
        size: Number,
        dateCreated: {type: Date, default: Date.now()},
        order: Number
    },{collection: "widget"});

    return WidgetSchema;
};