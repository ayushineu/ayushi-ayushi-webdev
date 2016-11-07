module.exports = function(app) {

    var users = [
        {username: 'alice', password: 'ewq', _id: 123, first: 'Alice', last: 'Wonderland'},
        {username: 'bob', password: 'ewq', _id: 234, first: 'Bob', last: 'Dylan'},
        {username: 'charlie', password: 'ewq', _id: 345, first: 'Charlie', last: 'Brown'},
        {username: 'jannunzi', password: 'jannunzi',_id: 456, first: 'Jose', last: 'Annunzi'}
    ];

    app.post('/api/user', createUser);
    app.get('/api/user', findUser);
    app.get('/api/user/:uid', findUserById);
    app.put('/api/user/:uid', updateUser);
    app.delete('/api/user/:uid', unregisterUser);

    function unregisterUser(req, res) {
        var uid = req.params.uid;
        for(var u in users) {
            if(users[u]._id == uid) {
                users.splice(u, 1);
            }
        }
        res.sendStatus(200);
    }

    function updateUser(req, res) {
        var user = req.body;
        var uid = req.params.uid;
        for(var u in users) {
            if(users[u]._id == uid) {
                users[u] = user;
            }
        }
        res.sendStatus(200);
    }

    function createUser(req, res) {
        var user = req.body;
        user._id = (new Date()).getTime();
        users.push(user);
        res.send(user);
    }

    function findUser(req, res) {
        var params = req.params;
        var query = req.query;
        if(query.password && query.username) {
            return findUserByCredentials(req, res);
        } else if(query.username) {
            return findUserByUsername(req, res);
        }

    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        for(var u in users) {
            if(users[u].username === username &&
                users[u].password === password) {
                res.send(users[u]);
                return;
            }
        }
        res.send('0');
    }
    function findUserByUsername(req, res) {
        var username = req.query.username;
        console.log("uname in server "+username);

        userFound = 400;

        for (var u in users) {
            user = users[u];
            if (user.username === username) {
                userFound = user;
                break;
            }
        }
        res.send(userFound);
    }

    function findUserById(req, res) {
        var userId = parseInt(req.params.uid);
        for(var u in users) {
            if(users[u]._id === userId) {
                res.send(users[u]);
                return;
            }
        }
        res.send('0');
    }
};
