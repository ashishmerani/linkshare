// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */

// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */

var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/news");
require("./models/Posts");
require("./models/Comments");
require("./models/Users");

var routes = require("./routes/index");
var users = require("./routes/users");

var app = express();

// default views folder path
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);


// 404 Error
app.use(function(req, res, next) {
    "use strict";
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});




// Error handling that will print stacktrace
if (app.get("env") === "development") {
    app.use(function(err, req, res, next) {
        "use strict";
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err
        });
    });
}


module.exports = app;
