module.exports = function(app,model) {

  /*  var users = [
        {username: 'alice', password: 'ewq', _id: 123, first: 'Alice', last: 'Wonderland'},
        {username: 'bob', password: 'ewq', _id: 234, first: 'Bob', last: 'Dylan'},
        {username: 'charlie', password: 'ewq', _id: 345, first: 'Charlie', last: 'Brown'},
        {username: 'jannunzi', password: 'jannunzi',_id: 456, first: 'Jose', last: 'Annunzi'}
    ];*/

<<<<<<< HEAD
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    passport.use(new LocalStrategy(localStrategy));
    var FacebookStrategy = require('passport-facebook').Strategy;


    var bcrypt = require("bcrypt-nodejs");


    var facebookConfig = {
        clientID     : process.env.FACEBOOK_CLIENT_ID,
        clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL  : process.env.FACEBOOK_CALLBACK_URL
    };



    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));


    app.post("/api/register", register);
    app.post("/api/user", createUser);
    // app.get("/api/user/username/:username",findUserByUsername);
    app.get("/api/user", findUser);
    app.get('/api/user/:userId', findUserById);
    app.put('/api/user/:userId', loggedInAndSelf, updateUser);
    app.delete('/api/user/:userId', deleteUser);
    app.post('/api/login', passport.authenticate('local'), login);
    app.post("/api/checkLogin", checkLogin);
    app.post("/api/logout", logout);
    app.get('/api/loggedin',loggedIn);
    app.get ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook',
        {successRedirect: '/assignment/#/user', failureRedirect: '/assignment/#/login'}));
    // app.get('/auth/facebook/callback',
    //     passport.authenticate('facebook', {
    //         successRedirect: '/#/user',
    //         failureRedirect: '/#/login'
    //     }));

    // function localStrategy(username, password, done) {
    //     model
    //         .userModel
    //         .findUserByCredentials(username, password)
    //         .then(
    //             function(user) {
    //                 if(user.username === username && user.password === password) {
    //                     return done(null, user);
    //                 } else {
    //                     return done(null, false);
    //                 }
    //             },
    //             function(err) {
    //                 if (err) { return done(err); }
    //             }
    //         );
    // }

    function loggedInAndSelf(req, res, next) {
        var loggedIn = req.isAuthenticated();
        var userId = req.params.userId;

        var self = userId == req.user._id;

        if (self && loggedIn) {
            next();
        } else {
            res.sendStatus(400).send("You are not the same person");
        }
    }

    function checkLogin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function localStrategy(username, password, done) {
        model
            .userModel
            .findUserByUsername(username)
            .then(
                function (users) {
                    if (users.length > 0) {
                        var user = users[0];
                        if(user && bcrypt.compareSync(password,user.password))
                        {
                            return done(null, user);
                        }
                        else{
                            return done(null, false);
                        }
                    }
                    else {
                        return done(null, false);
                    }
                },
                function (err) {
                    if (err) {
                        return done(err, null);
                    }
                }
            );
    }

    function facebookStrategy(token, refreshToken, profile, done){
        model
            .userModel
            .findUserByFacebookId(profile.id)
            .then(
                function (user) {
                    if (user) {
                        return done(null, user);
                    } else {
                        var names = profile.displayName.split(" ");
                        var newFacebookUser = {
                            username:  names[0],
                            lastName:  names[1],
                            firstName: names[0],
                            email:     profile.emails ? profile.emails[0].value:"",
                            facebook: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return model.userModel.createUser(newFacebookUser);
                    }
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            )
            .then(
                function (user) {
                    return done(null, user);
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            );
    }




        function loggedIn(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }





    function serializeUser(user, done) {
        done(null, user);
    }


    function deserializeUser(user, done) {
        model
            .userModel
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


    function register(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        model
            .userModel
            .createUser(user)
            .then(
                function (newUser) {
                    if (newUser) {
                        req.login(newUser, function (err) {
                            if (err) {
                                res.sendStatus(400).send(error);
                            } else {
                                res.json(newUser);
                            }
                        });
                    }
                }, function (error) {
                    res.sendStatus(400).send(error);
                });
    }


    function logout(req, res) {
        req.logOut();
        res.send(200);
    }


    function login(req, res) {
        res.json(req.user);
    }
=======
    app.post('/api/user', createUser);
    app.get('/api/user', findUser);
    app.get('/api/user/:uid', findUserById);
    app.put('/api/user/:uid', updateUser);
    app.delete('/api/user/:uid', deleteUser);

>>>>>>> origin/master

    function deleteUser(req, res)
    {
        var userid = req.params.uid;

        model
            .userModel
            .deleteUser(userid)
            .then
            (
                function (status)
                {
                    res.sendStatus(200);
                },
                function (error)
                {
                    res.sendStatus(400).send(error);
                }
            );
    }


    /*
     function unregisterUser(req, res) {
     var uid = req.params.uid;
     for(var u in users) {
     if(users[u]._id == uid) {
     users.splice(u, 1);
     }
     }
     res.sendStatus(200);
     }


     */


    function updateUser(req, res)
    {
        var user = req.body;
        var userid = req.params.uid;

        model
            .userModel
            .updateUser(userid, user)
            .then(
                function(status)
                {
                    console.log("updates and returns");
                    res.sendStatus(200);

                },
                function(error)
                {

                    res.sendStatus(400).send(error);
                }
            )
    }

    function findUserById(req, res)
    {
<<<<<<< HEAD
        var userId = req.params.userId;

        userFound = '0';

        model
            .userModel
            .findUserById(userId)
            .then(
                function (user) {
                    if (user) {
                        res.send(user);
                    }
                    else {
                        res.send('0');
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
=======
        var userid = req.params.uid;

        model
            .userModel
            .findUserById(userid)
            .then
            (
                function (user)
                {
                    if (user)
                    {
                        res.send(user);
                    }
                    else
                        {
                        res.send('0');
                        }
                },
                function (error)
                {
                    res.sendStatus(400).send(error);
                }
            );
>>>>>>> origin/master
    }


    function findUser(req, res)
    {
        var query = req.query;
        if (query.username)
        {
<<<<<<< HEAD
            console.log("in find user by username");
=======
>>>>>>> origin/master
            findUserByUsername(req, res);
        }
        else if ( query.username && query.password)
        {
            findUserByCredentials(req, res);
        }
    }


    function findUserByUsername(req, res)
    {
        var username = req.query.username;
<<<<<<< HEAD
        //req.params.uid
        console.log("found user by username in service server");
        console.log(username);
=======
>>>>>>> origin/master

        model
            .userModel
            .findUserByUsername(username)
            .then
            (
                function (users)
                {
                    if(users.length > 0){
                        res.send(users[0]);
                    }
                    else{
                        res.sendStatus(400);
                    }
                },
                function (err)
                {
                    res.sendStatus(400).send(err)
                }
            );
    }

    function findUserByCredentials(req, res)
    {
        var username = req.query.username;
        var password = req.query.password;

        model
            .userModel
            .findUserByCredentials(username, password)
            .then
            (
                function (user)
                {
                   res.send(user);
                },
                function (error)
                {
                    res.sendStatus(400).send(error);
                }
            );
    }


    function createUser(req, res)
    {
        var user = req.body;
        model
            .userModel
            .createUser(user)
            .then
            (
                function (newUser)
                {
                    res.send(newUser)
                },
                function (error)
                {
                    res.sendStatus(400).send(error);
                }
            );
    }


}
