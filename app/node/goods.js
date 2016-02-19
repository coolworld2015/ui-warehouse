var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser());

var GoodsModel = require('./mongo').GoodsModel;

var Goods = {
    getGoods: getGoods,
    findPostItem: findPostItem,
    updateItem: updateItem,

    addItem: addItem,
	removeAllGoods: removeAllGoods,
    removesItem: removesItem
};

module.exports.Goods = Goods;

function getGoods(req, res) {
    return GoodsModel.find(function (err, goods) {
        if (!err) {
            return res.send(goods);
        } else {
            res.statusCode = 500;
            return res.send({error: 'Server error'});
        }
    });
}

function findPostItem(req, res) {
    GoodsModel.findOne({
        id: req.body.id
    }, function (err, item) {
        if (err) {
            res.send({error: err.message});
        }
        console.log(item);
        res.send(item);
    });
}

function updateItem(req, res) {
    GoodsModel.findOne({
        id: req.body.id
    }, function (err, item) {
        if (err) {
            res.send({error: err.message});
        }

        item.name = req.body.name;
        item.price = req.body.price;
        item.quantity = req.body.quantity;
        item.store = req.body.store;
        item.description = req.body.description;

        item.save(function (err) {
            if (!err) {
                res.send(item);
            } else {
                return res.send(err);
            }
        });
    });
}

function addItem(req, res) {
    GoodsModel.create({
            id: req.body.id,
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            store: req.body.store,
            description: req.body.description
        },
        function (err, item) {
            if (err) {
                return res.send({error: 'Server error'});
            }
            res.send(item);
        });
}

function removeAllGoods(req, res, err) {
    GoodsModel.remove({}, function (err) {
    });
    res.send('Collection Goods removed');
}

function removesItem(req, res) {
    GoodsModel.remove({
        "id": req.body.id
    }, function () {
        console.log('Item with id: ', req.body.id, ' was removed');
    });
    res.send('Item with id: ' + req.body.id + ' was removed');
}