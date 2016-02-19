var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser());

var ClientsModel = require('./mongo').ClientsModel;

var Clients = {
    getClients: getClients,
    findClient: findClient,
    findPostClient: findPostClient,
    editClient: editClient,
	editPostClient: editPostClient,
    updateClient: updateClient,
    addClient: addClient,
    saveClient: saveClient,
    removeAllClients: removeAllClients,
    removeClient: removeClient
};

module.exports.Clients = Clients;

function getClients(req, res) {
    return ClientsModel.find(function (err, clients) {
        if (!err) {
            return res.send(clients);
        } else {
            res.statusCode = 500;
            return res.send({error: 'Server error'});
        }
    });
}

function findClient(req, res) {
    ClientsModel.findOne({
        id: req.params.id
    }, function (err, client) {
        if (err) {
            res.send({error: err.message});
        }
        console.log(client);
        res.send(client);
    });
}

function findPostClient(req, res) {
    ClientsModel.findOne({
        id: req.body.id
    }, function (err, client) {
        if (err) {
            res.send({error: err.message});
        }
        console.log(client);
        res.send(client);
    });
}

function editClient(req, res) {
    ClientsModel.findOne({
        id: req.params.id
    }, function (err, client) {
        if (err) {
            res.send({error: err.message});
        }

        client.name = req.params.name;

        client.save(function (err) {
            if (!err) {
                res.send(client);
            } else {
                return res.send(err);
            }
        });
    });
}

function editPostClient(req, res) {
    ClientsModel.findOneAndUpdate({
            id: req.body.id
        },
        {$set: {name: req.body.name}},
        function (err, client) {
            if (!err) {
                res.send(client);
            } else {
                res.send({error: err.message});
            }
        });
}

function updateClient(req, res) {
    ClientsModel.findOne({
        id: req.body.id
    }, function (err, client) {
        if (err) {
            res.send({error: err.message});
        }

        client.name = req.body.name;
        client.address = req.body.address;
        client.phone = req.body.phone;
        client.description = req.body.description;
        client.sum = req.body.sum;

        client.save(function (err) {
            if (!err) {
                res.send(client);
            } else {
                return res.send(err);
            }
        });
    });
}

function addClient(req, res) {
    ClientsModel.create({
            id: req.body.id,
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
            description: req.body.description,
            sum: req.body.sum
        },
        function (err, client) {
            if (err) {
                return res.send({error: 'Server error'});
            }
            res.send(client);
        });
}

function saveClient(req, res) {
    console.log(req.body);
    var client = new ClientsModel({
        id: req.body.id,
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        description: req.body.description,
        sum: req.body.sum
    });
    client.save(function (err) {
        if (!err) {
            res.send(client);
        } else {
            return res.send(err);
        }
    });
}

function removeAllClients(req, res, err) {
    ClientsModel.remove({}, function (err) {
    });
    res.send('Collection Clients removed');
}

function removeClient(req, res) {
    ClientsModel.remove({
        "id": req.body.id
    }, function () {
        console.log('Client with id: ', req.body.id, ' was removed');
    });
    res.send('Client with id: ' + req.body.id + ' was removed');
}