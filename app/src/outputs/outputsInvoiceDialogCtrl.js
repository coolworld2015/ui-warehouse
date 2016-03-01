(function () {
    'use strict';

    angular
        .module('app')
        .controller('OutputsInvoiceDialogCtrl', OutputsInvoiceDialogCtrl);

    OutputsInvoiceDialogCtrl.$inject = ['$state', '$rootScope', '$timeout', 'OutputsInvoiceService', 'OutputsService',
        'OutputsInvoiceLocalStorage', 'GoodsService', 'ClientsService', '$stateParams'];

    function OutputsInvoiceDialogCtrl($state, $rootScope, $timeout, OutputsInvoiceService, OutputsService,
        OutputsInvoiceLocalStorage, GoodsService, ClientsService, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            itemDelete: itemDelete,
            goOutputsInvoice: goOutputsInvoice,
            _errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.invoice);

        init();

        function init() {
            if ($stateParams.item.id == undefined) {
                $state.go('main.outputs');
            }
            $rootScope.loading = false;
        }

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

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
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
            } else {
                OutputsInvoiceLocalStorage.deleteItem(vm.id);

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
                    $state.go('main.outputs-invoice', {item: $stateParams.item});
                }, 100);
            }
        }

        function goOutputsInvoice() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.outputs-invoice', {item: $stateParams.item});
            }, 100);
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();