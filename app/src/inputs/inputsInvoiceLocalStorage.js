(function () {
    'use strict';

    angular
        .module('app')
        .factory('InputsInvoiceLocalStorage', InputsInvoiceLocalStorage);

    InputsInvoiceLocalStorage.$inject = ['$rootScope'];

    function InputsInvoiceLocalStorage($rootScope) {
        var webUrl = $rootScope.myConfig.webUrl;

        return {
            invoices: [],

            getInputInvoice: getInputInvoice,
            addItem: addItem,
            editItem: editItem,
            deleteItem: deleteItem,
            deleteItemInvoice: deleteItemInvoice,

            uploadInputInvoice: uploadInputInvoice
        };

        function getInputInvoice() {
            if (InputsInvoiceLocalStorage.invoices === undefined) {
                var invoices = localStorage.getItem('warehouse_inputs_invoices');
                invoices = JSON.parse(invoices);
                InputsInvoiceLocalStorage.invoices = invoices;
            }

            if (InputsInvoiceLocalStorage.invoices === null) {
                InputsInvoiceLocalStorage.invoices = [];
            }

            return InputsInvoiceLocalStorage.invoices.sort();
        }

        function addItem(item) {
            InputsInvoiceLocalStorage.invoices.push(item);
            setInputInvoice();
        }

        function editItem(item) {
            var invoices = InputsInvoiceLocalStorage.invoices;
            for (var i = 0; i < invoices.length; i++) {
                if (invoices[i].id == item.id) {
                    invoices.splice(i, 1, item);
                    setInputInvoice();
                    break;
                }
            }
        }

        function deleteItem(id) {
            var invoices = InputsInvoiceLocalStorage.invoices;
            for (var i = 0; i < invoices.length; i++) {
                if (invoices[i].id == id) {
                    invoices.splice(i, 1);
                    setInputInvoice();
                    break;
                }
            }
        }

        function deleteItemInvoice(id) {
            InputsInvoiceLocalStorage.invoices = InputsInvoiceLocalStorage.invoices.filter(function (el) {
                return el.invoiceID != id;
            });
            setInputInvoice();
        }

        function deleteItemInvoiceReduce(id) {
            InputsInvoiceLocalStorage.invoices = InputsInvoiceLocalStorage.invoices.reduce(function (invoices, invoice) {
                if (invoice.invoiceID != id) {
                    invoices.push(invoice);
                }
                return invoices;
            }, []);

            setInputInvoice();
        }

        function setInputInvoice() {
            localStorage.setItem('warehouse_inputs_invoices', JSON.stringify(InputsInvoiceLocalStorage.invoices));
        }

        function uploadInputInvoice(invoices) {
            localStorage.setItem('warehouse_inputs_invoices', JSON.stringify(invoices));
            InputsInvoiceLocalStorage.invoices = undefined;
        }
    }
})();