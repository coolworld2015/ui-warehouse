(function () {
    'use strict';

    angular
        .module('app')
        .factory('OutputsTransactionService', OutputsTransactionService);

    OutputsTransactionService.$inject = ['$rootScope', 'GoodsService', 'OutputsService', 'ClientsService'];

    function OutputsTransactionService($rootScope, GoodsService, OutputsService, ClientsService) {
        var item, store, clientID, sum;

        return {
            addItem: addItem,
            _editGoodItem: editGoodItem,
            _editOutputItem: editOutputItem,
            _findClient: findClient,
            _editItem: editItem,
            _errorHandler: errorHandler
        };

        function addItem(store1, item1, clientID1, sum1) {
            item = item1;
            store = store1;
            clientID = clientID1;
            sum = sum1;

            return editGoodItem()
                .then(editOutputItem)
                .then(findClient)
                .then(editItem)
                .catch(errorHandler);
        }

        function editGoodItem() {
            return GoodsService.editItem(store)
        }

        function editOutputItem() {
            return OutputsService.editItem(item)
        }

        function findClient() {
            return ClientsService.findClient(clientID)
                .then(function (client) {
                    client.data.sum = parseFloat(client.data.sum) - parseFloat(sum);
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

