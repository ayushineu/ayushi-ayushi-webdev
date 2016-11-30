module.exports = function(app,model) {

  /*  var users = [
        {username: 'alice', password: 'ewq', _id: 123, first: 'Alice', last: 'Wonderland'},
        {username: 'bob', password: 'ewq', _id: 234, first: 'Bob', last: 'Dylan'},
        {username: 'charlie', password: 'ewq', _id: 345, first: 'Charlie', last: 'Brown'},
        {username: 'jannunzi', password: 'jannunzi',_id: 456, first: 'Jose', last: 'Annunzi'}
    ];*/

    app.post('/api/user', createUser);
    app.get('/api/user', findUser);
    app.get('/api/user/:uid', findUserById);
    app.put('/api/user/:uid', updateUser);
    app.delete('/api/user/:uid', deleteUser);


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
    }


    function findUser(req, res)
    {
        var query = req.query;
        if (query.username)
        {
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
