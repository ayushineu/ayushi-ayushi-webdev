var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var mongoose   = require('mongoose');
var connectionString = 'mongodb://root:admin@ds155087.mlab.com:55087/wam-fall-2016';
mongoose.connect(connectionString);
// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

var cookieParser = require('cookie-parser');
var session      = require('express-session');
app.use(cookieParser());
// app.use(session({ secret: process.env.SESSION_SECRET }));
// app.use(cookieParser());
// app.use(session({ secret: process.env.SESSION_SECRET }));
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());


// require ("./test/app.js")(app);

require("./myproject/app.js")(app);

/*var websites = [
    {_id: 321, name: 'facebook.com', uid: 123},
    {_id: 432, name: 'wikipedia.org', uid: 123},
    {_id: 543, name: 'twitter.com', uid: 234}
];

app.get("/websites", function(req, res){
    res.send(websites);
});*/



var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ipaddress);


