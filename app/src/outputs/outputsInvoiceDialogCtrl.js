(function () {
    'use strict';

    angular
        .module('app')
        .controller('OutputsInvoiceDialogCtrl', OutputsInvoiceDialogCtrl);

    OutputsInvoiceDialogCtrl.$inject = ['$state', '$rootScope', 'OutputsInvoiceService', 'OutputsService', 'GoodsService', 'ClientsService', '$stateParams'];

    function OutputsInvoiceDialogCtrl($state, $rootScope, OutputsInvoiceService, OutputsService, GoodsService, ClientsService, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            itemDelete: itemDelete,
            goOutputsInvoice: goOutputsInvoice,
            _errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.invoice);

        function itemDelete() {
            $rootScope.loading = true;
            $rootScope.myError = false;

            var outputItem = {
                id: $stateParams.item.id,
                number: $stateParams.item.number,
                client: $stateParams.item.client,
                clientID: $stateParams.item.clientID,
                date: $stateParams.item.date,
                total: $stateParams.item.total - vm.total,
                description: $stateParams.item.description
            };

            $stateParams.item.total = outputItem.total;
            var sum = parseFloat($stateParams.invoice.total);

            OutputsInvoiceService.deleteItem(vm.id)
                .then(function () {

                    OutputsService.editItem(outputItem)
                        .then(function () {

                            GoodsService.findGood($stateParams.invoice.goodsID)
                                .then(function (good) {
                                    good.data.quantity = parseFloat(good.data.quantity) + parseFloat(vm.quantity);

                                    GoodsService.editItem(good.data)
                                        .then(function () {

                                            ClientsService.findClient($stateParams.item.clientID)
                                                .then(function (client) {
                                                    client.data.sum = parseFloat(client.data.sum) + parseFloat(sum);

                                                    ClientsService.editItem(client.data)
                                                        .then(function () {
                                                            $rootScope.myError = false;
                                                            $state.go('main.outputs-invoice', {item: $stateParams.item});
                                                        })
                                                        .catch(errorHandler);
                                                })
                                                .catch(errorHandler);
                                        })
                                        .catch(errorHandler);

                                }).catch(errorHandler);
                        })
                        .catch(errorHandler);
                })
                .catch(errorHandler);
        }

        function goOutputsInvoice() {
            $state.go('main.outputs-invoice', {item: $stateParams.item});
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();