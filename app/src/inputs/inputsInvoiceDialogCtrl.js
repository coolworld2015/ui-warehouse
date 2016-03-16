(function () {
    'use strict';

    angular
        .module('app')
        .controller('InputsInvoiceDialogCtrl', InputsInvoiceDialogCtrl);

    InputsInvoiceDialogCtrl.$inject = ['$state', '$rootScope', '$timeout', 'InputsInvoiceService', 'InputsService',
        'InputsInvoiceLocalStorage', 'GoodsService', 'ClientsService', '$stateParams',
        'InputsLocalStorage', 'InputsTransactionLocalStorage'];

    function InputsInvoiceDialogCtrl($state, $rootScope, $timeout, InputsInvoiceService, InputsService,
                                     InputsInvoiceLocalStorage, GoodsService, ClientsService, $stateParams,
                                     InputsLocalStorage, InputsTransactionLocalStorage) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            itemDelete: itemDelete,
            goInputsInvoice: goInputsInvoice,
            _errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.invoice);
		
        $timeout(function () {
            window.scrollTo(0, 0);
        });
		
        init();

        function init() {
            if ($stateParams.item.id == undefined) {
                $state.go('main.inputs');
            }
            $rootScope.loading = false;
        }

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

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
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
            } else {
                InputsInvoiceLocalStorage.deleteItem(vm.id);

                InputsTransactionLocalStorage.setClientSum($stateParams.item.clientID, -sum);
                InputsTransactionLocalStorage.setStoreSum($stateParams.invoice.goodsID, -vm.quantity);
                InputsLocalStorage.setInput();

                $rootScope.loading = true;
                $timeout(function () {
                    $state.go('main.inputs-invoice', {item: $stateParams.item});
                }, 100);
            }
        }

        function goInputsInvoice() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.inputs-invoice', {item: $stateParams.item});
            }, 100);
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();