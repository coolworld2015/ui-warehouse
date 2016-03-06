(function () {
    'use strict';

    angular
        .module('app')
        .factory('OutputsInvoiceLocalStorage', OutputsInvoiceLocalStorage);

    OutputsInvoiceLocalStorage.$inject = ['$rootScope'];

    function OutputsInvoiceLocalStorage($rootScope) {
        var webUrl = $rootScope.myConfig.webUrl;

        return {
            invoices: [],

            getOutputInvoice: getOutputInvoice,
            addItem: addItem,
            editItem: editItem,
            deleteItem: deleteItem,
            deleteItemInvoice: deleteItemInvoice,

            uploadInputInvoice: uploadInputInvoice
        };

        function getOutputInvoice() {
            if (OutputsInvoiceLocalStorage.invoices === undefined) {
                var invoices = localStorage.getItem('ui-warehouse.outputs.invoices');
                invoices = JSON.parse(invoices);
                OutputsInvoiceLocalStorage.invoices = invoices;
            }

            if (OutputsInvoiceLocalStorage.invoices === null) {
                OutputsInvoiceLocalStorage.invoices = [];
            }

            return OutputsInvoiceLocalStorage.invoices.sort();
        }

        function addItem(item) {
            OutputsInvoiceLocalStorage.invoices.push(item);
            setInputInvoice();
        }

        function editItem(item) {
            var invoices = OutputsInvoiceLocalStorage.invoices;
            for (var i = 0; i < invoices.length; i++) {
                if (invoices[i].id == item.id) {
                    invoices.splice(i, 1, item);
                    setInputInvoice();
                    break;
                }
            }
        }

        function deleteItem(id) {
            var invoices = OutputsInvoiceLocalStorage.invoices;
            for (var i = 0; i < invoices.length; i++) {
                if (invoices[i].id == id) {
                    invoices.splice(i, 1);
                    setInputInvoice();
                    break;
                }
            }
        }

        function deleteItemInvoice(id) {
            OutputsInvoiceLocalStorage.invoices = OutputsInvoiceLocalStorage.invoices.filter(function (el) {
                return el.invoiceID != id;
            });
            setInputInvoice();
        }

        function deleteItemInvoiceReduce(id) {
            OutputsInvoiceLocalStorage.invoices = OutputsInvoiceLocalStorage.invoices.reduce(function (invoices, invoice) {
                if (invoice.invoiceID != id) {
                    invoices.push(invoice);
                }
                return invoices;
            }, []);

            setInputInvoice();
        }

        function setInputInvoice() {
            localStorage.setItem('ui-warehouse.outputs.invoices', JSON.stringify(OutputsInvoiceLocalStorage.invoices));
        }

        function uploadInputInvoice(invoices) {
            localStorage.setItem('ui-warehouse.outputs.invoices', JSON.stringify(invoices));
            OutputsInvoiceLocalStorage.invoices = undefined;
        }
    }
})();
