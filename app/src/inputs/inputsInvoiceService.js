(function () {
    'use strict';

    angular
        .module('app')
        .factory('InputsInvoiceService', InputsInvoiceService);

    InputsInvoiceService.$inject = ['$rootScope', '$http', '$q'];

    function InputsInvoiceService($rootScope, $http, $q) {
        var webUrl = $rootScope.myConfig.webUrl;

        return {
            inputs_invoice: [],
			getInvoices: getInvoices,
            addItem: addItem,
            editItem: editItem,
            deleteItem: deleteItem
        };
		
        function getInvoices() {
            var url = webUrl + 'api/invoicein/get';
            return $http.get(url)
                .then(function (result) {
                    result.data.sort();
                    return result;
                });
        }
		
        function addItem(item) {
            var url = webUrl + 'api/invoicein/add';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                });
        }

        function editItem(item) {
            var url = webUrl + 'api/invoicein/update';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                });
        }

        function deleteItem(id) {
            var url = webUrl + 'api/invoicein/delete';
            var item = {
                "id": id
            };
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                });
        }
    }
})();

