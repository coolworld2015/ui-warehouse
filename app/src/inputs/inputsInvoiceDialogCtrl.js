(function () {
    'use strict';

    angular
        .module('app')
        .controller('InputsInvoiceDialogCtrl', InputsInvoiceDialogCtrl);

    InputsInvoiceDialogCtrl.$inject = ['$state', '$rootScope', '$timeout', 'InputsInvoiceService', 'InputsService',
        'InputsInvoiceLocalStorage', 'GoodsService', 'ClientsService', '$stateParams'];

    function InputsInvoiceDialogCtrl($state, $rootScope, $timeout, InputsInvoiceService, InputsService,
         InputsInvoiceLocalStorage, GoodsService, ClientsService, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            itemDelete: itemDelete,
            goInputsInvoice: goInputsInvoice,
            _errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.invoice);

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

//                var id = $scope.invoiceRecordID;
//                InputInvoiceService.deleteItem(id);
//
//                $scope.total = parseFloat($scope.total) - parseFloat($scope.invoiceTotal);
//                $scope.inputSubmitTotal();
//
//                inputTransaction.setClientSum($scope.clientID, -$scope.invoiceTotal);
//                inputTransaction.setStoreSum($scope.goodsID, -$scope.invoiceQuantity);
//
//                $scope.sum = parseFloat($scope.total).toFixed(2);
//                $rootScope.view = 'inputEditForm';

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