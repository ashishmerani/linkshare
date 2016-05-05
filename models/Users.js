"use strict";
var  mongoose = require("mongoose");

// Mongoose model for todos
var UserSchema = mongoose.Schema({
    name: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    itemsPinned: {
    	usernme : {type: String},
    	url: {type: String}
    }
});

 mongoose.model("User", UserSchema);
