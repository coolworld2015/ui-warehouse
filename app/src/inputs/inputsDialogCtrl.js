(function () {
    'use strict';

    angular
        .module('app')
        .controller('InputsDialogCtrl', InputsDialogCtrl);

    InputsDialogCtrl.$inject = ['$state', '$q', '$rootScope', '$timeout', 'InputsService', 'InputsLocalStorage',
        'InputsInvoiceService', 'InputsInvoiceLocalStorage', 'GoodsService', 'ClientsService', '$stateParams',
        'InputsTransactionLocalStorage'];

    function InputsDialogCtrl($state, $q, $rootScope, $timeout, InputsService, InputsLocalStorage,
                              InputsInvoiceService, InputsInvoiceLocalStorage, GoodsService, ClientsService, $stateParams,
                              InputsTransactionLocalStorage) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            _getInputInvoicesOn: getInputInvoicesOn,
            inputsDelete: inputsDelete,
			_setClientSum: setClientSum,
			_setStoreSum: setStoreSum,			
            _deleteItem: deleteItem,
            _fillRequests: fillRequests,
            _modifyGoods: modifyGoods,
            _findGood: findGood,
            _editGood: editGood,
            _deleteInputsInvoiceItem: deleteInputsInvoiceItem,
            inputsEditBack: inputsEditBack,
            _errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);
		
        $timeout(function () {
            window.scrollTo(0, 0);
        });
		
        init();

        function init() {
            if ($stateParams.item.number == undefined) {
                $state.go('main.inputs');
            }

            vm.webUrl = $rootScope.myConfig.webUrl;

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                getInputInvoicesOn();
            } else {
                vm.inputInvoices = [].concat(InputsInvoiceLocalStorage.getInputInvoice());
                $rootScope.myError = false;
                $rootScope.loading = false;
            }

            vm.requests = [];
            vm.index = [];
            vm.i = 0;
        }

        function getInputInvoicesOn() {
            InputsInvoiceService.getInvoices()
                .then(function (data) {
                    vm.inputInvoices = data.data;
                    $rootScope.myError = false;
                    $rootScope.loading = false;
                })
                .catch(errorHandler);
        }

        function inputsDelete() {
            $rootScope.loading = true;
            $rootScope.myError = false;
			var sum = parseFloat($stateParams.item.total);
			
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                fillRequests();

                $q.serial(vm.requests)
                    .catch(errorHandler);

                ClientsService.findClient($stateParams.item.clientID)
                    .then(function (client) {
                        client.data.sum = parseFloat(client.data.sum) - parseFloat($stateParams.item.total);

                        ClientsService.editItem(client.data)
                            .then(function () {

                                InputsService.deleteItem(vm.id)
                                    .then(function () {
                                        deleteItem(vm.id);
										
										setClientSum($stateParams.item.clientID, -sum);
										
                                        $rootScope.myError = false;
                                        $state.go('main.inputs');
                                    })
                                    .catch(errorHandler);

                            })
                            .catch(errorHandler);
                    })
                    .catch(errorHandler);
            } else {
                InputsTransactionLocalStorage.setClientSum($stateParams.item.clientID, -sum);
				
                vm.inputInvoices.forEach(function (el) {
                    if (el.invoiceID == vm.id) {
                        InputsTransactionLocalStorage.setStoreSum(el.goodsID, -el.quantity);
                    }
                });

                InputsInvoiceLocalStorage.deleteItemInvoice($stateParams.item.id);
                InputsLocalStorage.deleteItem(vm.id);

                $timeout(function () {
                    $state.go('main.inputs');
                }, 100);
            }
        }
		
        function setClientSum(id, sum) {
            var clients = ClientsService.clients;
            for (var i = 0; i < clients.length; i++) {
                if (clients[i].id == id) {
                    clients[i].sum = parseFloat(clients[i].sum) + parseFloat(sum);
                }
            }
        }

        function setStoreSum(id, quantity) {
            var goods = GoodsService.goods;
            console.log(id + '  -  ' + quantity);
            for (var i = 0; i < goods.length; i++) {
                if (goods[i].id == id) {
                    goods[i].quantity = parseFloat(goods[i].quantity) - parseFloat(quantity);
                    goods[i].store = true;
                }
            }
        }
		
        function deleteItem(id) {
            var inputs = InputsService.inputs;
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].id == id) {
                    inputs.splice(i, 1);
                    break;
                }
            }
        }

        function fillRequests() {
            vm.inputInvoices.forEach(function (el) {
                if (el.invoiceID == $stateParams.item.id) {
                    vm.index.push(el);
                    vm.requests.push(modifyGoods);
                }
            })
        }

        function modifyGoods() {
            return findGood()
                .then(editGood)
                .then(deleteInputsInvoiceItem)
                .catch(errorHandler)
        }

        function findGood() {
            return GoodsService.findGood(vm.index[vm.i].goodsID)
                .then(function (good) {
                    var quantity = parseFloat(good.data.quantity) - parseFloat(vm.index[vm.i].quantity);
                    vm.item = {
                        id: good.data.id,
                        name: good.data.name,
                        price: good.data.price,
                        quantity: quantity,
                        store: good.data.store,
                        description: good.data.description,
                        goodsID: vm.index[vm.i].id
                    };
					
					setStoreSum(vm.index[vm.i].goodsID, vm.index[vm.i].quantity);
                });
        }

        function editGood() {
            return GoodsService.editItem(vm.item)
                .then(function () {
                    vm.i++;
                })
                .catch(errorHandler);
        }

        function deleteInputsInvoiceItem() {
            return InputsInvoiceService.deleteItem(vm.item.goodsID)
                .then(function () {
                })
                .catch(errorHandler);
        }

        function inputsEditBack() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.inputs');
            }, 100);
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();