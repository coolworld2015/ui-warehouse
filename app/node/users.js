var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser());

var UsersModel = require('./mongo').UsersModel;

var Users = {
    getUsers: getUsers,
    findByName: findByName,
	findPostUser: findPostUser,
	updateUser: updateUser,
	
	addUser: addUser,
	removeAllUsers: removeAllUsers,
	removeUser: removeUser
};

module.exports.Users = Users;

function getUsers(req, res) {
    return UsersModel.find(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            res.statusCode = 500;
            return res.send({error: 'Server error'});
        }
    });
}

function findByName(req, res) {
    UsersModel.findOne({
        name: req.params.name
    }, function (err, user) {
        if (err) {
            res.send({error: err.message});
        }
        console.log(user);
        res.send(user);
    });
}

function findUser(req, res) {
    UsersModel.findOne({
        id: req.params.id
    }, function (err, user) {
        if (err) {
            res.send({error: err.message});
        }
        console.log(user);
        res.send(user);
    });
}

function findPostUser(req, res) {
    UsersModel.findOne({
        id: req.body.id
    }, function (err, user) {
        if (err) {
            res.send({error: err.message});
        }
        console.log(user);
        res.send(user);
    });
}

function editUser(req, res) {
    UsersModel.findOne({
        id: req.params.id
    }, function (err, user) {
        if (err) {
            res.send({error: err.message});
        }

        user.name = req.params.name;

        user.save(function (err) {
            if (!err) {
                res.send(user);
            } else {
                return res.send(err);
            }
        });
    });
}

function editPostUser(req, res) {
    UsersModel.findOneAndUpdate({
            id: req.body.id
        },
        {$set: {name: req.body.name}},
        function (err, user) {
            if (!err) {
                res.send(user);
            } else {
                res.send({error: err.message});
            }
        });
}

function updateUser(req, res) {
    UsersModel.findOne({
        id: req.body.id
    }, function (err, user) {
        if (err) {
            res.send({error: err.message});
        }

        user.name = req.body.name;
        user.pass = req.body.pass;
        user.description = req.body.description;

        user.save(function (err) {
            if (!err) {
                res.send(user);
            } else {
                return res.send(err);
            }
        });
    });
}

function addUser(req, res) {
    UsersModel.create({
            id: req.body.id,
            name: req.body.name,
            pass: req.body.pass,
            description: req.body.description
        },
        function (err, user) {
            if (err) {
                return res.send({error: 'Server error'});
            }
            res.send(user);
        });
}

function removeAllUsers(req, res, err) {
    UsersModel.remove({}, function (err) {
    });
    res.send('Collection Users removed');
}

function removeUser(req, res) {
    UsersModel.remove({
        "id": req.body.id
    }, function () {
        console.log('User with id: ', req.body.id, ' was removed');
    });
    res.send('User with id: ' + req.body.id + ' was removed');
}