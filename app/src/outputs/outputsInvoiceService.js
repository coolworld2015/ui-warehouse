(function () {
    'use strict';

    angular
        .module('app')
        .factory('OutputsInvoiceService', OutputsInvoiceService);

    OutputsInvoiceService.$inject = ['$rootScope', '$http', '$q'];

    function OutputsInvoiceService($rootScope, $http, $q) {
        var webUrl = $rootScope.myConfig.webUrl;

        return {
			getInvoices: getInvoices,
            addItem: addItem,
            editItem: editItem,
            deleteItem: deleteItem
        };
		
        function getInvoices() {
            var url = webUrl + 'api/invoiceout/get';
            return $http.get(url)
                .then(function (result) {
                    result.data.sort();
                    return result;
                });
        }
		
        function addItem(item) {
            var url = webUrl + 'api/invoiceout/add';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }

        function editItem(item) {
            var url = webUrl + 'api/invoiceout/update';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }

        function deleteItem(id) {
            var url = webUrl + 'api/invoiceout/delete';
            var item = {
                "id": id
            };
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }
    }
})();

