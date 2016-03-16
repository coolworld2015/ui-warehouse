(function () {
    'use strict';

    angular
        .module('app')
        .controller('OutputsDialogCtrl', OutputsDialogCtrl);

    OutputsDialogCtrl.$inject = ['$state', '$q', '$rootScope', '$timeout', 'OutputsService', 'OutputsLocalStorage',
        'OutputsInvoiceService', 'OutputsInvoiceLocalStorage', 'GoodsService', 'ClientsService', '$stateParams',
        'OutputsTransactionLocalStorage'];

    function OutputsDialogCtrl($state, $q, $rootScope, $timeout, OutputsService, OutputsLocalStorage,
                               OutputsInvoiceService, OutputsInvoiceLocalStorage, GoodsService, ClientsService, $stateParams,
                               OutputsTransactionLocalStorage) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            _getOutputInvoicesOn: getOutputInvoicesOn,
            outputsDelete: outputsDelete,
            _deleteItem: deleteItem,
            _fillRequests: fillRequests,
            _modifyGoods: modifyGoods,
            _findGood: findGood,
            _editGood: editGood,
            _deleteOutputsInvoiceItem: deleteOutputsInvoiceItem,
            outputsEditBack: outputsEditBack,
            _errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);
		
        $timeout(function () {
            window.scrollTo(0, 0);
        });
		
        init();

        function init() {
            if ($stateParams.item.number == undefined) {
                $state.go('main.outputs');
            }

            vm.webUrl = $rootScope.myConfig.webUrl;

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                getOutputInvoicesOn();
            } else {
                vm.outputInvoices = [].concat(OutputsInvoiceLocalStorage.getOutputInvoice());
                $rootScope.myError = false;
                $rootScope.loading = false;
            }

            vm.requests = [];
            vm.index = [];
            vm.i = 0;
        }

        function getOutputInvoicesOn() {
            OutputsInvoiceService.getInvoices()
                .then(function (data) {
                    vm.outputInvoices = data.data;
                    $rootScope.myError = false;
                    $rootScope.loading = false;
                })
                .catch(errorHandler);
        }

        function outputsDelete() {
            $rootScope.loading = true;
            $rootScope.myError = false;

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                fillRequests();

                $q.serial(vm.requests)
                    .catch(errorHandler);

                ClientsService.findClient($stateParams.item.clientID)
                    .then(function (client) {
                        client.data.sum = parseFloat(client.data.sum) + parseFloat($stateParams.item.total);

                        ClientsService.editItem(client.data)
                            .then(function () {

                                OutputsService.deleteItem(vm.id)
                                    .then(function () {
                                        deleteItem(vm.id);
                                        $rootScope.myError = false;
                                        $state.go('main.outputs');
                                    })
                                    .catch(errorHandler);

                            })
                            .catch(errorHandler);
                    })
                    .catch(errorHandler);
            } else {
                var sum = parseFloat($stateParams.item.total);
                OutputsTransactionLocalStorage.setClientSum($stateParams.item.clientID, -sum);

                vm.outputInvoices.forEach(function (el) {
                    if (el.invoiceID == vm.id) {
                        OutputsTransactionLocalStorage.setStoreSum(el.goodsID, -el.quantity);
                    }
                });

                OutputsInvoiceLocalStorage.deleteItemInvoice($stateParams.item.id);
                OutputsLocalStorage.deleteItem(vm.id);

                $rootScope.loading = true;
                $timeout(function () {
                    $state.go('main.outputs');
                }, 100);
            }
        }

        function deleteItem(id) {
            var outputs = OutputsService.outputs;
            for (var i = 0; i < outputs.length; i++) {
                if (outputs[i].id == id) {
                    outputs.splice(i, 1);
                    break;
                }
            }
        }

        function fillRequests() {
            vm.outputInvoices.forEach(function (el) {
                if (el.invoiceID == $stateParams.item.id) {
                    vm.index.push(el);
                    vm.requests.push(modifyGoods);
                }
            })
        }

        function modifyGoods() {
            return findGood()
                .then(editGood)
                .then(deleteOutputsInvoiceItem)
                .catch(errorHandler)
        }

        function findGood() {
            return GoodsService.findGood(vm.index[vm.i].goodsID)
                .then(function (good) {
                    var quantity = parseFloat(good.data.quantity) + parseFloat(vm.index[vm.i].quantity);
                    vm.item = {
                        id: good.data.id,
                        name: good.data.name,
                        price: good.data.price,
                        quantity: quantity,
                        store: good.data.store,
                        description: good.data.description,
                        goodsID: vm.index[vm.i].id
                    };
                });
        }

        function editGood() {
            return GoodsService.editItem(vm.item)
                .then(function () {
                    vm.i++;
                })
                .catch(errorHandler);
        }

        function deleteOutputsInvoiceItem() {
            return OutputsInvoiceService.deleteItem(vm.item.goodsID)
                .then(function () {
                })
                .catch(errorHandler);
        }

        function outputsEditBack() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.outputs');
            }, 100);
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();