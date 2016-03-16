var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser());

var AuditModel = require('./mongo').AuditModel;

var Audit = {
    getAudit: getAudit,
    addAudit: addAudit,
    _removeAllAudit: removeAllAudit
};

module.exports.Audit = Audit;

function getAudit(req, res) {
    return AuditModel.find(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            res.statusCode = 500;
            return res.send({error: 'Server error'});
        }
    }).sort({date: -1});                            //TODO sort reverse
}

function addAudit(req, res) {
    var date = new Date().toJSON().slice(0, 10);
    var time = new Date().toTimeString().slice(0, 8);
    AuditModel.create({
            id: req.body.id,
            name: req.body.name,
            date: date + ' ' + time,
            ip: req.ip,
            description: req.body.description
        },
        function (err, audit) {
            if (err) {
                return res.send({error: 'Server error'});
            } else {
                res.send(audit);
            }
        });
}

function removeAllAudit(req, res, err) {
    AuditModel.remove({}, function (err) {
    });
    res.send('Collection Audit removed');
}