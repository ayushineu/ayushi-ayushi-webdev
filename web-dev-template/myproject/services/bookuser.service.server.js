module.exports = function(app, models) {
    var cookieParser = require('cookie-parser');
    var session = require('express-session');
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var GoogleStrategy = require('passport-google-oauth20').Strategy;
    var bcrypt = require("bcrypt-nodejs");

    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    }));
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());
    var bookuserModel = models.bookuserModel;

    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/uploads' });
    app.get("/auth/google", passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get("/auth/google/callback",
        passport.authenticate('google', {
            successRedirect: '/myproject/#/user',
            failureRedirect: '/myproject/#/login'
        }));
    app.post ("/api/uploads", upload.single('myFile'), uploadImage);
    app.post("/api/user", createUser);
    app.get("/api/alluser",getall);
    app.get("/api/loggedIn", loggedIn);
    app.post("/api/register", register);
    app.post("/api/logout", logout);
    app.post("/api/login", passport.authenticate('project'), login);
    app.get("/api/user", getUser);
    app.get("/api/user/:userId", findUserById);
    app.put("/project/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);

    passport.use('project', new LocalStrategy(projectLocalStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    var googleConfig = {
        clientID     : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL  : process.env.GOOGLE_CALLBACK_URL
    };

    passport.use('google', new GoogleStrategy(googleConfig, googleLogin));


    function projectLocalStrategy(username, password, done) {
        // console.log("Serverservice");
        // console.log(username+" "+password);
        bookuserModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if(user && bcrypt.compareSync(password, user.password)) {
                        done(null, user);
                    }
                    else {
                        done(null, false);
                    }
                },
                function(error) {
                    done(null, error);
                }
            );
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        bookuserModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function getall(request, response){
        bookuserModel
            .findalluser()
            .then(function(userlist){
                response.json(userlist);

            })

    }


    function register(request, response) {
        var username = request.body.username;
        var password = request.body.password;
        bookuserModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if(user){
                        response.status(400).send("Username already in use");

                        return;
                    }
                    else {
                        request.body.password = bcrypt.hashSync(request.body.password);
                        return bookuserModel.createUser(request.body);
                    }
                },
                function(error) {
                    response.send(error);
                }
            )
            .then(
                function(user) {

                    if(user) {
                        //Utility function provided by passport
                        request.login(user, function(error) {
                            if(error) {
                                response.status(400).send(error);
                            }
                            else {
                                response.json(user);
                            }
                        });
                    }
                },
                function(error) {
                    response.status(400).send(error);
                }
            );
    }

    function googleLogin(token, refreshToken, profile, done) {
        // response.send(200);
        bookuserModel
            .findGoogleUser(profile.id)
            .then(
                function(googleUser) {
                    if (googleUser) {
                        return done(null, googleUser);
                    }
                    else {
                        var email = profile.emails[0].value;
                        var splitEmail = email.split("@");
                        var googleUser = {
                            username: splitEmail[0],
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            email: email,
                            google: {
                                id: profile.id,
                                token: token
                            }
                        };
                        bookuserModel
                            .createUser(googleUser)
                            .then(
                                function(user) {
                                    done(null, user);
                                }
                            );
                    }
                }
            );
    }

    function loggedIn(request, response) {
        if(request.isAuthenticated()) {
            response.json(request.user);
        }
        else {
            response.send('0');
        }
    }

    function logout(request, response) {
        request.logout();

        response.send(200);
    }

    function login(request, response) {
        var user = request.user;
        response.json(user);
    }

    function uploadImage(request, response) {

        var myFile = request.file;
        var userId = request.body.userId;


        var originalname  = myFile.originalname;
        var filename      = myFile.filename;
        var path          = myFile.path;
        var destination   = myFile.destination;
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        var url = "/uploads/" +filename;

        bookuserModel
            .uploadImage(userId, url)
            .then(
                function(stat) {
                    response
                        .redirect("/myproject/#/user");
                },
                function(error) {
                    response.statusCode(404).send(error);
                }
            )


    }


    function deleteUser(request, response) {
        var id = request.params.userId;

        bookuserModel
            .deleteUser(id)
            .then(
                function(stats) {

                    response.send(200);
                },
                function(error) {
                    response.statusCode(404).send(error);
                }
            );
    }

    function updateUser(request, response) {
        var id = request.params.userId;
        var newUser = request.body;

        bookuserModel
            .updateUser(id, newUser)
            .then(
                function(stat) {

                    response.sendStatus(200);
                },
                function(error) {
                    response.statusCode(404).send(error);
                }
            );
    }


    function createUser(request, response) {
        var user = request.body;
        bookuserModel
            .createUser(user)
            .then(
                function(user) {
                    response.json(user);
                },
                function(error) {
                    response.statusCode(400).send(error);
                }
            );


        // console.log("createUser");
        // console.log(user);

        // user._id = (new Date()).getTime()+"";
        // users.push(user);
        // response.send(user);
    }

    function getUser(request, response) {
        var username = request.query['username'];
        var password = request.query['password'];
        //console.log(username);
        //console.log(password);
        if(username && password) {
            findUserByCredentials(username, password, response, request);
        }
        else if(username) {
            findUserByUsername(username, response);
        }
        else {
            response.send(users);
        }
    }

    function findUserByCredentials(username, password, response, request) {
        // for(var i in users) {
        //     if(users[i].username === username && users[i].password === password){
        //         response.send(users[i]);
        //         return;
        //     }
        // }
        // return response.send({});

        bookuserModel
            .findUserByCredentials(username, password)
            .then(
                function(user) {
                    // console.log(request.session);
                    request.session.currentUser = user;
                    response.json(user);
                },
                function(error) {
                    response.statusCode(404).send(error);

                }
            );
    }

    function findUserByUsername(username, response) {
        // for(var i in users) {
        //     if(users[i].username === username){
        //         response.send(users[i]);
        //         return;
        //     }
        // }
        // return response.send({});
        bookuserModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if (user != null) {
                        response.json(user);
                    }
                    else{
                        response.statusCode(404).send(error);}
                },
                function(error) {
                    response.statusCode(404).send(error);
                }
            );
    }

    function findUserById(request, response) {
        var id = request.params.userId;

        //console.log(request.session.currentUser);

        bookuserModel
            .findUserById(id)
            .then(
                function(user) {
                    response.json(user);
                },
                function(error) {
                    response.statusCode(404).send(error);
                }
            )
        // for(var i in users) {
        //     if(users[i]._id === id) {
        //         response.send(users[i]);
        //         return;
        //     }
        // }
        // response.send({});
    }
};


// module.exports = function(app,model) {
//
//
//     var passport = require('passport');
//     var LocalStrategy = require('passport-local').Strategy;
//
//
//     passport.use(new LocalStrategy(localStrategy));
//
//
//     function localStrategy(username, password, done) {
//         userModel
//             .findUserByCredentials(username, password)
//             .then(
//                 function (user) {
//                     if (user.username === username && user.password === password) {
//                         return done(null, user);
//                     } else {
//                         return done(null, false);
//                     }
//                 },
//                 function (err) {
//                     if (err) {
//                         return done(err);
//                     }
//                 }
//             );
//     }
//
//
//     app.post('/api/user', createUser);
//     app.get('/api/user', findUser);
//     app.get('/api/user/:uid', findUserById);
//     app.put('/api/user/:uid', updateUser);
//     app.delete('/api/user/:uid', deleteUser);
//     passport.serializeUser(serializeUser);
//     app.post('/api/login', passport.authenticate('local'), login);
//     app.post('/api/logout', logout);
//     app.post('/api/register', register);
//     // app.get ('/api/loggedin', loggedIn);
//     app.get("/api/loggedIn", loggedIn);
//     app.post("/api/checkProjectLogin", checkLogin);
//
//     function checkLogin(req, res) {
//         console.log("in service server checklogin");
//         console.log(req.isAuthenticated() ? req.user : '0');
//         res.send(req.isAuthenticated() ? req.user : '0');
//     }
//
//     function loggedIn(req, res) {
//         res.send(req.isAuthenticated() ? req.user : '0');
//     }
//
//     function register(req, res) {
//         var user = req.body;
//         model.
//         bookuserModel
//             .createUser(user)
//     .then(function (user) {
//                 if (user) {
//                     req.login(user, function (err) {
//                         if (err) {
//                             res.status(400).send(err);
//                         } else {
//                             res.json(user);
//                         }
//                     });
//                 }
//             }
//         );
//     }
//
//
//     function logout(req, res) {
//         req.logOut();
//         res.send(200);
//     }
//
//
//
//     function login(req, res) {
//         var user = req.user;
//         res.json(user);
//     }
//
//
//
//     function serializeUser(user, done) {
//         done(null, user);
//     }
//
//     passport.deserializeUser(deserializeUser);
//
//     function deserializeUser(user, done) {
//         model
//             .bookuserModel
//             .findUserById(user._id)
//             .then(
//                 function(user){
//                     done(null, user);
//                 },
//                 function(err){
//                     done(err, null);
//                 }
//             );
//     }
//
//
//     function deleteUser(req, res)
//     {
//         var userid = req.params.uid;
//
//         model
//             .bookuserModel
//             .deleteUser(userid)
//             .then
//             (
//                 function (status)
//                 {
//                     res.sendStatus(200);
//                 },
//                 function (error)
//                 {
//                     res.sendStatus(400).send(error);
//                 }
//             );
//     }
//
//
//     /*
//      function unregisterUser(req, res) {
//      var uid = req.params.uid;
//      for(var u in users) {
//      if(users[u]._id == uid) {
//      users.splice(u, 1);
//      }
//      }
//      res.sendStatus(200);
//      }
//
//
//      */
//
//
//     function updateUser(req, res)
//     {
//         var user = req.body;
//         var userid = req.params.uid;
//
//         model
//             .bookuserModel
//             .updateUser(userid, user)
//             .then(
//                 function(status)
//                 {
//                     console.log("updates and returns");
//                     res.sendStatus(200);
//
//                 },
//                 function(error)
//                 {
//
//                     res.sendStatus(400).send(error);
//                 }
//             )
//     }
//
//     function findUserById(req, res)
//     {
//         var userid = req.params.uid;
//
//         model
//             .bookuserModel
//             .findUserById(userid)
//             .then
//             (
//                 function (user)
//                 {
//                     if (user)
//                     {
//                         res.send(user);
//                     }
//                     else
//                     {
//                         res.send('0');
//                     }
//                 },
//                 function (error)
//                 {
//                     res.sendStatus(400).send(error);
//                 }
//             );
//     }
//
//
//     function findUser(req, res)
//     {
//         var query = req.query;
//         if (query.username)
//         {
//             findUserByUsername(req, res);
//         }
//         else if ( query.username && query.password)
//         {
//             findUserByCredentials(req, res);
//         }
//     }
//
//
//     function findUserByUsername(req, res)
//     {
//         var username = req.query.username;
//
//         model
//             .bookuserModel
//             .findUserByUsername(username)
//             .then
//             (
//                 function (users)
//                 {
//                     if(users.length > 0){
//                         res.send(users[0]);
//                     }
//                     else{
//                         res.sendStatus(400);
//                     }
//                 },
//                 function (err)
//                 {
//                     res.sendStatus(400).send(err)
//                 }
//             );
//     }
//
//     function findUserByCredentials(req, res)
//     {
//         var username = req.query.username;
//         var password = req.query.password;
//
//         model
//             .bookuserModel
//             .findUserByCredentials(username, password)
//             .then
//             (
//                 function (user)
//                 {
//                     res.send(user);
//                 },
//                 function (error)
//                 {
//                     res.sendStatus(400).send(error);
//                 }
//             );
//     }
//
//
//     function createUser(req, res)
//     {
//         var user = req.body;
//         model
//             .bookuserModel
//             .createUser(user)
//             .then
//             (
//                 function (newUser)
//                 {
//                     res.send(newUser)
//                 },
//                 function (error)
//                 {
//                     res.sendStatus(400).send(error);
//                 }
//             );
//     }
//
//
// }
//
//
//
//
//
// // module.exports = function(app,model) {
// //
// //     var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// //
// //     var passport = require('passport');
// //     app.use(cookieParser());
// //     app.use(session({ secret: "ayushi",
// //     resave:true,
// //     saveUninitialized:true}));
// //     var passport = require('passport');
// //     app.use(passport.initialize());
// //     app.use(passport.session());
// //     var LocalStrategy = require('passport-local').Strategy;
// //     passport.serializeUser(serializeUser);
// //     passport.deserializeUser(deserializeUser);
// //     passport.use(new LocalStrategy(localStrategy));
// //     var bcrypt = require("bcrypt-nodejs");
// //     app.post("/api/register", register);
// //     app.post("/api/user", createUser);
// //     app.get("/api/user/username/:username",findUserByUsername);
// //     app.get("/api/user", findUser);
// //     app.get('/api/user/:userId', findUserById);
// //     app.put('/api/user/:userId', loggedInAndSelf, updateUser);
// //     app.delete('/api/user/:userId', deleteUser);
// //     app.post('/api/login', passport.authenticate('project'), login);
// //     app.post("/api/checkLogin", checkLogin);
// //     app.post("/api/logout", logout);
// //     app.get('/api/loggedin',loggedIn);
// //     app.get("/auth/google", passport.authenticate('google', { scope: ['profile', 'email'] }));
// //     app.get("/auth/google/callback",
// //         passport.authenticate('google', {
// //             successRedirect: '/project/#/user',
// //             failureRedirect: '/project/#/login'
// //         }));
// //
// //     var googleConfig = {
// //         clientID     : process.env.GOOGLE_CLIENT_ID,
// //         clientSecret : process.env.GOOGLE_CLIENT_SECRET,
// //         callbackURL  : process.env.GOOGLE_CALLBACK_URL
// //     };
// //     passport.use('project', new LocalStrategy(projectLocalStrategy));
// //     passport.use('google', new GoogleStrategy(googleConfig, googleLogin));
// //
// //     function projectLocalStrategy(username, password, done) {
// //         // console.log("Serverservice");
// //         // console.log(username+" "+password);
// //         model.
// //         userModel
// //             .findUserByUsername(username)
// //             .then(
// //                 function(user) {
// //                     if(user && bcrypt.compareSync(password, user.password)) {
// //                         done(null, user);
// //                     }
// //                     else {
// //                         done(null, false);
// //                     }
// //                 },
// //                 function(error) {
// //                     done(null, error);
// //                 }
// //             );
// //     }
// //
// //
// //     function googleLogin(token, refreshToken, profile, done) {
// //         // response.send(200);
// //         model.
// //         userModel
// //             .findGoogleUser(profile.id)
// //             .then(
// //                 function(googleUser) {
// //                     if (googleUser) {
// //                         return done(null, googleUser);
// //                     }
// //                     else {
// //                         var email = profile.emails[0].value;
// //                         var splitEmail = email.split("@");
// //                         var googleUser = {
// //                             username: splitEmail[0],
// //                             firstName: profile.name.givenName,
// //                             lastName: profile.name.familyName,
// //                             email: email,
// //                             google: {
// //                                 id: profile.id,
// //                                 token: token
// //                             }
// //                         };
// //                         model.
// //                         userModel
// //                             .createUser(googleUser)
// //                             .then(
// //                                 function(user) {
// //                                     done(null, user);
// //                                 }
// //                             );
// //                     }
// //                 }
// //             );
// //     }
// //
// //
// //     function loggedInAndSelf(req, res, next) {
// //         var loggedIn = req.isAuthenticated();
// //         var userId = req.params.userId;
// //
// //         var self = userId == req.user._id;
// //
// //         if (self && loggedIn) {
// //             next();
// //         } else {
// //             res.sendStatus(400).send("You are not the same person");
// //         }
// //     }
// //
// //     function checkLogin(req, res) {
// //         res.send(req.isAuthenticated() ? req.user : '0');
// //     }
// //
// //     function localStrategy(username, password, done) {
// //         model
// //             .userModel
// //             .findUserByUsername(username)
// //             .then(
// //                 function (users) {
// //                     if (users.length > 0) {
// //                         var user = users[0];
// //                         if(user && bcrypt.compareSync(password,user.password))
// //                         {
// //                             return done(null, user);
// //                         }
// //                         else{
// //                             return done(null, false);
// //                         }
// //                     }
// //                     else {
// //                         return done(null, false);
// //                     }
// //                 },
// //                 function (err) {
// //                     if (err) {
// //                         return done(err, null);
// //                     }
// //                 }
// //             );
// //     }
// //
// //
// //
// //     function loggedIn(req, res) {
// //         res.send(req.isAuthenticated() ? req.user : '0');
// //     }
// //
// //
// //
// //
// //
// //     function serializeUser(user, done) {
// //         done(null, user);
// //     }
// //
// //
// //     function deserializeUser(user, done) {
// //         model
// //             .userModel
// //             .findUserById(user._id)
// //             .then(
// //                 function(user){
// //                     done(null, user);
// //                 },
// //                 function(err){
// //                     done(err, null);
// //                 }
// //             );
// //     }
// //
// //
// //     function register(req, res) {
// //         var user = req.body;
// //         user.password = bcrypt.hashSync(user.password);
// //         model
// //             .userModel
// //             .createUser(user)
// //             .then(
// //                 function (newUser) {
// //                     if (newUser) {
// //                         req.login(newUser, function (err) {
// //                             if (err) {
// //                                 res.sendStatus(400).send(error);
// //                             } else {
// //                                 res.json(newUser);
// //                             }
// //                         });
// //                     }
// //                 }, function (error) {
// //                     res.sendStatus(400).send(error);
// //                 });
// //     }
// //
// //
// //     function logout(req, res) {
// //         req.logOut();
// //         res.send(200);
// //     }
// //
// //
// //     function login(req, res) {
// //         res.json(req.user);
// //     }
// //
// //     function deleteUser(req, res)
// //     {
// //         var userid = req.params.uid;
// //
// //         model
// //             .userModel
// //             .deleteUser(userid)
// //             .then
// //             (
// //                 function (status)
// //                 {
// //                     res.sendStatus(200);
// //                 },
// //                 function (error)
// //                 {
// //                     res.sendStatus(400).send(error);
// //                 }
// //             );
// //     }
// //
// //
// //     /*
// //      function unregisterUser(req, res) {
// //      var uid = req.params.uid;
// //      for(var u in users) {
// //      if(users[u]._id == uid) {
// //      users.splice(u, 1);
// //      }
// //      }
// //      res.sendStatus(200);
// //      }
// //
// //
// //      */
// //
// //
// //     function updateUser(req, res)
// //     {
// //         var user = req.body;
// //         var userid = req.params.uid;
// //
// //         model
// //             .userModel
// //             .updateUser(userid, user)
// //             .then(
// //                 function(status)
// //                 {
// //                     console.log("updates and returns");
// //                     res.sendStatus(200);
// //
// //                 },
// //                 function(error)
// //                 {
// //
// //                     res.sendStatus(400).send(error);
// //                 }
// //             )
// //     }
// //
// //     function findUserById(req, res)
// //     {
// //         var userId = req.params.userId;
// //
// //         userFound = '0';
// //
// //         model
// //             .userModel
// //             .findUserById(userId)
// //             .then(
// //                 function (user) {
// //                     if (user) {
// //                         res.send(user);
// //                     }
// //                     else {
// //                         res.send('0');
// //                     }
// //                 },
// //                 function (error) {
// //                     res.sendStatus(400).send(error);
// //                 });
// //     }
// //
// //
// //     function findUser(req, res)
// //     {
// //         var query = req.query;
// //         if (query.username)
// //         {
// //             console.log("in find user by username");
// //             findUserByUsername(req, res);
// //         }
// //         else if ( query.username && query.password)
// //         {
// //             findUserByCredentials(req, res);
// //         }
// //     }
// //
// //
// //     function findUserByUsername(req, res)
// //     {
// //         var username = req.query.username;
// //         //req.params.uid
// //         console.log("found user by username in service server");
// //         console.log(username);
// //
// //         model
// //             .userModel
// //             .findUserByUsername(username)
// //             .then
// //             (
// //                 function (users)
// //                 {
// //                     if(users.length > 0){
// //                         res.send(users[0]);
// //                     }
// //                     else{
// //                         res.sendStatus(400);
// //                     }
// //                 },
// //                 function (err)
// //                 {
// //                     res.sendStatus(400).send(err)
// //                 }
// //             );
// //     }
// //
// //     function findUserByCredentials(req, res)
// //     {
// //         var username = req.query.username;
// //         var password = req.query.password;
// //
// //         model
// //             .userModel
// //             .findUserByCredentials(username, password)
// //             .then
// //             (
// //                 function (user)
// //                 {
// //                     res.send(user);
// //                 },
// //                 function (error)
// //                 {
// //                     res.sendStatus(400).send(error);
// //                 }
// //             );
// //     }
// //
// //
// //     function createUser(req, res)
// //     {
// //         var user = req.body;
// //         model
// //             .userModel
// //             .createUser(user)
// //             .then
// //             (
// //                 function (newUser)
// //                 {
// //                     res.send(newUser)
// //                 },
// //                 function (error)
// //                 {
// //                     res.sendStatus(400).send(error);
// //                 }
// //             );
// //     }
// //
// //
// // }
