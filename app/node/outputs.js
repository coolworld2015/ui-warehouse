var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser());

var OutputsModel = require('./mongo').OutputsModel;

var Outputs = {
    getOutputs: getOutputs,
    findPostOutput: findPostOutput,
    updateOutput: updateOutput,

    addOutput: addOutput,
    removeAllOutputs: removeAllOutputs,
    removeOutput: removeOutput
};

module.exports.Outputs = Outputs;

function getOutputs(req, res) {
    return OutputsModel.find(function (err, outputs) {
        if (!err) {
            return res.send(outputs);
        } else {
            res.statusCode = 500;
            return res.send({error: 'Server error'});
        }
    });
}

function findOutput(req, res) {
    OutputsModel.findOne({
        id: req.params.id
    }, function (err, output) {
        if (err) {
            res.send({error: err.message});
        }
        console.log(output);
        res.send(output);
    });
}

function findPostOutput(req, res) {
    OutputsModel.findOne({
        id: req.body.id
    }, function (err, output) {
        if (err) {
            res.send({error: err.message});
        }
        console.log(output);
        res.send(output);
    });
}

function editOutput(req, res) {
    OutputsModel.findOne({
        id: req.params.id
    }, function (err, output) {
        if (err) {
            res.send({error: err.message});
        }

        output.name = req.params.name;

        output.save(function (err) {
            if (!err) {
                res.send(output);
            } else {
                return res.send(err);
            }
        });
    });
}

function editPostOutput(req, res) {
    OutputsModel.findOneAndUpdate({
            id: req.body.id
        },
        {$set: {name: req.body.name}},
        function (err, output) {
            if (!err) {
                res.send(output);
            } else {
                res.send({error: err.message});
            }
        });
}

function updateOutput(req, res) {
    OutputsModel.findOne({
        id: req.body.id
    }, function (err, output) {
        if (err) {
            res.send({error: err.message});
        }
        output.number = req.body.number;
        output.client = req.body.client;
        output.clientID = req.body.clientID;
        output.date = req.body.date;
        output.total = req.body.total;
        output.description = req.body.description;

        output.save(function (err) {
            if (!err) {
                res.send(output);
            } else {
                return res.send(err);
            }
        });
    });
}

function addOutput(req, res) {
    OutputsModel.create({
            id: req.body.id,
            number: req.body.number,
            client: req.body.client,
            clientID: req.body.clientID,
            date: req.body.date,
            total: req.body.total,
            description: req.body.description
        },
        function (err, output) {
            if (err) {
                return res.send({error: 'Server error'});
            }
            res.send(output);
        });
}

function removeAllOutputs(req, res, err) {
    OutputsModel.remove({}, function (err) {
    });
    res.send('Collection Outputs removed');
}

function removeOutput(req, res) {
    OutputsModel.remove({
        "id": req.body.id
    }, function () {
        console.log('Output with id: ', req.body.id, ' was removed');
    });
    res.send('Output with id: ' + req.body.id + ' was removed');
}