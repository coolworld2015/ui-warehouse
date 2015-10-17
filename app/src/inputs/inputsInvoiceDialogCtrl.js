(function () {
    'use strict';

    angular
        .module('app')
        .controller('InputsInvoiceDialogCtrl', InputsInvoiceDialogCtrl);

    InputsInvoiceDialogCtrl.$inject = ['$state', '$rootScope', 'InputsInvoiceService', 'InputsService', 'GoodsService', 'ClientsService', '$stateParams'];

    function InputsInvoiceDialogCtrl($state, $rootScope, InputsInvoiceService, InputsService, GoodsService, ClientsService, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            itemDelete: itemDelete,
            goInputsInvoice: goInputsInvoice,
            _errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.invoice);

        function itemDelete() {
            $rootScope.loading = true;
            $rootScope.myError = false;

            var inputItem = {
                id: $stateParams.item.id,
                number: $stateParams.item.number,
                client: $stateParams.item.client,
                clientID: $stateParams.item.clientID,
                date: $stateParams.item.date,
                total: $stateParams.item.total - vm.total,
                description: $stateParams.item.description
            };

            $stateParams.item.total = inputItem.total;
            var sum = parseFloat($stateParams.invoice.total);

            InputsInvoiceService.deleteItem(vm.id)
                .then(function () {

                    InputsService.editItem(inputItem)
                        .then(function () {

                            GoodsService.findGood($stateParams.invoice.goodsID)
                                .then(function (good) {
                                    good.data.quantity = parseFloat(good.data.quantity) - parseFloat(vm.quantity);

                                    GoodsService.editItem(good.data)
                                        .then(function () {

                                            ClientsService.findClient($stateParams.item.clientID)
                                                .then(function (client) {
                                                    client.data.sum = parseFloat(client.data.sum) - parseFloat(sum);

                                                    ClientsService.editItem(client.data)
                                                        .then(function () {
                                                            $rootScope.myError = false;
                                                            $state.go('main.inputs-invoice', {item: $stateParams.item});
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

        function goInputsInvoice() {
            $state.go('main.inputs-invoice', {item: $stateParams.item});
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();