var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser());

app.listen(process.env.PORT || 3000, function () {
    console.log('Server is running on 3000');
});

app.get('/', function (req, res) {
	//res.sendFile(__dirname + '/build/index.html');
    res.send('It is just API Server...');
});

app.get('/styles.css', function (req, res) {
    res.sendFile(__dirname + '/build/styles.css');
});

app.get('/app.js', function (req, res) {
    res.sendFile(__dirname + '/build/app.js');
});

app.get('/templates.js', function (req, res) {
    res.sendFile(__dirname + '/build/templates.js');
});

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//------------------------------------------------------------------------
var Clients = require('./clients').Clients;

app.get('/api/clients/get', Clients.getClients);

app.get('/api/clients/find/:id', Clients.findClient);
app.post('/api/clients/find', Clients.findPostClient);

app.get('/api/clients/edit/:id/:name', Clients.editClient);
app.post('/api/clients/edit/', Clients.editPostClient);
app.post('/api/clients/update', Clients.updateClient);

app.post('/api/clients/add', Clients.addClient);
app.post('/api/clients/save', Clients.saveClient);

app.get('/api/clients/drop', Clients.removeAllClients);
app.post('/api/clients/drop', Clients.removeAllClients);
app.post('/api/clients/delete', Clients.removeClient);

//------------------------------------------------------------------------
var Goods = require('./goods').Goods;

app.get('/api/goods/get', Goods.getGoods);
app.post('/api/goods/find', Goods.findPostItem);

app.post('/api/goods/add', Goods.addItem);
app.post('/api/goods/update', Goods.updateItem);
app.post('/api/goods/delete', Goods.removesItem);

app.get('/api/goods/drop', Goods.removeAllGoods);

//------------------------------------------------------------------------
var Users = require('./users').Users;

app.get('/api/users/get', Users.getUsers);
app.post('/api/users/find', Users.findPostUser);
app.get('/api/users/findByName/:name', Users.findByName);

app.post('/api/users/add', Users.addUser);
app.post('/api/users/update', Users.updateUser);
app.post('/api/users/delete', Users.removeUser);

app.get('/api/users/drop', Users.removeAllUsers);

//------------------------------------------------------------------------
var mongoAudit = require('./audit').Audit;

app.get('/api/audit/get', mongoAudit.getAudit);
app.post('/api/audit/add', mongoAudit.addAudit);

//------------------------------------------------------------------------
var Inputs = require('./inputs').Inputs;

app.get('/api/inputs/get', Inputs.getInputs);
app.post('/api/inputs/find', Inputs.findPostInput);

app.post('/api/inputs/add', Inputs.addInput);
app.post('/api/inputs/update', Inputs.updateInput);
app.post('/api/inputs/delete', Inputs.removeInput);

app.get('/api/inputs/drop', Inputs.removeAllInputs);

//------------------------------------------------------------------------
var Outputs = require('./outputs').Outputs;

app.get('/api/outputs/get', Outputs.getOutputs);
app.post('/api/outputs/find', Outputs.findPostOutput);

app.post('/api/outputs/add', Outputs.addOutput);
app.post('/api/outputs/update', Outputs.updateOutput);
app.post('/api/outputs/delete', Outputs.removeOutput);

app.get('/api/outputs/drop', Outputs.removeAllOutputs);

//------------------------------------------------------------------------
var InvoiceIn = require('./invoicein').InvoiceIn;

app.get('/api/invoicein/get', InvoiceIn.getInvoices);
app.post('/api/invoicein/find', InvoiceIn.findPostInvoice);

app.post('/api/invoicein/add', InvoiceIn.addInvoice);
app.post('/api/invoicein/update', InvoiceIn.updateInvoice);
app.post('/api/invoicein/delete', InvoiceIn.removeInvoice);

app.get('/api/invoicein/drop', InvoiceIn.removeAllInvoices);

//------------------------------------------------------------------------
var InvoiceOut = require('./invoiceout').InvoiceOut;

app.get('/api/invoiceout/get', InvoiceOut.getInvoices);
app.post('/api/invoiceout/find', InvoiceOut.findPostInvoice);

app.post('/api/invoiceout/add', InvoiceOut.addInvoice);
app.post('/api/invoiceout/update', InvoiceOut.updateInvoice);
app.post('/api/invoiceout/delete', InvoiceOut.removeInvoice);

app.get('/api/invoiceout/drop', InvoiceOut.removeAllInvoices);