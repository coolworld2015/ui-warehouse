var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser());

var InputsModel = require('./mongo').InputsModel;

var Inputs = {
    getInputs: getInputs,
    findPostInput: findPostInput,
    updateInput: updateInput,

    addInput: addInput,
    removeAllInputs: removeAllInputs,
    removeInput: removeInput
};

module.exports.Inputs = Inputs;

function getInputs(req, res) {
    return InputsModel.find(function (err, inputs) {
        if (!err) {
            return res.send(inputs);
        } else {
            res.statusCode = 500;
            return res.send({error: 'Server error'});
        }
    });
}

function findInput(req, res) {
    InputsModel.findOne({
        id: req.params.id
    }, function (err, input) {
        if (err) {
            res.send({error: err.message});
        }
        console.log(input);
        res.send(input);
    });
}

function findPostInput(req, res) {
    InputsModel.findOne({
        id: req.body.id
    }, function (err, input) {
        if (err) {
            res.send({error: err.message});
        }
        console.log(input);
        res.send(input);
    });
}

function editInput(req, res) {
    InputsModel.findOne({
        id: req.params.id
    }, function (err, input) {
        if (err) {
            res.send({error: err.message});
        }

        input.name = req.params.name;

        input.save(function (err) {
            if (!err) {
                res.send(input);
            } else {
                return res.send(err);
            }
        });
    });
}

function editPostInput(req, res) {
    InputsModel.findOneAndUpdate({
            id: req.body.id
        },
        {$set: {name: req.body.name}},
        function (err, input) {
            if (!err) {
                res.send(input);
            } else {
                res.send({error: err.message});
            }
        });
}

function updateInput(req, res) {
    InputsModel.findOne({
        id: req.body.id
    }, function (err, input) {
        if (err) {
            res.send({error: err.message});
        }
        input.number = req.body.number;
        input.client = req.body.client;
        input.clientID = req.body.clientID;
        input.date = req.body.date;
        input.total = req.body.total;
        input.description = req.body.description;

        input.save(function (err) {
            if (!err) {
                res.send(input);
            } else {
                return res.send(err);
            }
        });
    });
}

function addInput(req, res) {
    InputsModel.create({
            id: req.body.id,
            number: req.body.number,
            client: req.body.client,
            clientID: req.body.clientID,
            date: req.body.date,
            total: req.body.total,
            description: req.body.description
        },
        function (err, input) {
            if (err) {
                return res.send({error: 'Server error'});
            }
            res.send(input);
        });
}

function removeAllInputs(req, res, err) {
    InputsModel.remove({}, function (err) {
    });
    res.send('Collection Inputs removed');
}

function removeInput(req, res) {
    InputsModel.remove({
        "id": req.body.id
    }, function () {
        console.log('Input with id: ', req.body.id, ' was removed');
    });
    res.send('Input with id: ' + req.body.id + ' was removed');
}