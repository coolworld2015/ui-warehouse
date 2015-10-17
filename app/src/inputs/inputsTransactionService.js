(function () {
    'use strict';

    angular
        .module('app')
        .factory('InputsTransactionService', InputsTransactionService);

    InputsTransactionService.$inject = ['$rootScope', 'GoodsService', 'InputsService', 'ClientsService'];

    function InputsTransactionService($rootScope, GoodsService, InputsService, ClientsService) {
        var item, store, clientID, sum;

        return {
            addItem: addItem,
            _editGoodItem: editGoodItem,
            _editInputItem: editInputItem,
            _findClient: findClient,
            _editItem: editItem,
            _errorHandler: errorHandler
        };

        function addItem(storeParam, itemParam, clientIDParam, sumParam) {
            item = itemParam;
            store = storeParam;
            clientID = clientIDParam;
            sum = sumParam;

            return editGoodItem()
                .then(editInputItem)
                .then(findClient)
                .then(editItem)
                .catch(errorHandler);
        }

        function editGoodItem() {
            return GoodsService.editItem(store)
        }

        function editInputItem() {
            return InputsService.editItem(item)
        }

        function findClient() {
            return ClientsService.findClient(clientID)
                .then(function (client) {
                    client.data.sum = parseFloat(client.data.sum) + parseFloat(sum);
                    return client;
                })
        }

        function editItem(client) {
            return ClientsService.editItem(client.data)
                .then(function (data) {
                    return data;
                })
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();

