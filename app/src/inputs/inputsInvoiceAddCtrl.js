(function () {
    'use strict';

    angular
        .module('app')
        .controller('InputsInvoiceAddCtrl', InputsInvoiceAddCtrl);

    InputsInvoiceAddCtrl.$inject = ['$state', '$rootScope', '$filter', '$timeout', 'InputsLocalStorage', 'InputsInvoiceService',
        'InputsInvoiceLocalStorage', '$stateParams', 'goods',
        'InputsTransactionService', 'InputsTransactionLocalStorage'];

    function InputsInvoiceAddCtrl($state, $rootScope, $filter, $timeout, InputsLocalStorage, InputsInvoiceService,
                                  InputsInvoiceLocalStorage, $stateParams, goods,
                                  InputsTransactionService, InputsTransactionLocalStorage) {
        var vm = this;
        var optionalGoods = {name: 'Select commodities'};

        angular.extend(vm, {
            init: init,
            updateChange: updateChange,
            selectedItem: optionalGoods,
            addSubmit: addSubmit,
            goInputsInvoice: goInputsInvoice,
            goInputs: goInputs,
            _errorHandler: errorHandler,
            _loading: loading
        });

        angular.extend(vm, $stateParams.item);
		
        $timeout(function () {
            window.scrollTo(0, 0);
        });
		
        init();

        function init() {
            if ($stateParams.item.id == undefined) {
                $state.go('main.inputs');
            }

            var now = new Date();
            vm.date = $filter('date')(now, 'MM/dd/yyyy H:mm:ss ');
            vm.date = $filter('date')(now, 'dd/MM/yyyy H:mm:ss '); //russian style
            vm.description = '';

            vm.goods = goods;
            vm.goodsOptions = [].concat(vm.goods);
            vm.goodsOptions.unshift(optionalGoods);
            $rootScope.myError = false;
            $rootScope.loading = false;
        }

        function updateChange(item) {
            vm.error = false;
            if (item.price) {
                vm.goodsID = item.id;
                vm.price = parseFloat(item.price).toFixed(2);
                vm.priceFixed = item.price;
            } else {
                vm.price = '0.00';
            }
        }

        function addSubmit() {
            if (vm.selectedItem.name == 'Select commodities') {
                vm.error = true;
                return;
            }

            if (vm.form.$invalid) {
                return;
            }

            $rootScope.myError = false;
            $rootScope.loading = true;

            var id = (Math.random() * 1000000).toFixed();
            var invoice = {
                id: id,
                invoiceID: $stateParams.item.id,
                goods: vm.selectedItem.name,
                goodsID: vm.goodsID,
                price: vm.price,
                quantity: vm.quantity,
                total: parseFloat(vm.price) * parseFloat(vm.quantity),
                description: vm.description
            };

            var store = {
                id: vm.selectedItem.id,
                name: vm.selectedItem.name,
                price: vm.priceFixed,
                quantity: parseFloat(vm.selectedItem.quantity) + parseFloat(vm.quantity),
                store: true,
                description: vm.selectedItem.description
            };

            $stateParams.item.total = parseFloat($stateParams.item.total) + parseFloat(invoice.total);
            var sum = parseFloat(invoice.total);

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                InputsInvoiceService.addItem(invoice)
                    .then(function () {

                        InputsTransactionService.addItem(store, $stateParams.item, $stateParams.item.clientID, sum)
                            .then(function () {
                                $state.go('main.inputs-invoice', {item: $stateParams.item});
                            })
                            .catch(errorHandler);
                    })
                    .catch(errorHandler);
            } else {
                InputsInvoiceLocalStorage.addItem(invoice);
                inputSubmitTotal();

                InputsTransactionLocalStorage.setClientSum($stateParams.item.clientID, sum);
                InputsTransactionLocalStorage.setStoreSum(vm.goodsID, vm.quantity);

                vm.goods.filter(function (el) {
                    if (el.store === true) {
                        //$rootScope.store.push(el);
                        return el;
                    }
                });
                $rootScope.loading = true;
                $timeout(function () {
                    $state.go('main.inputs-invoice', {item: $stateParams.item});
                }, 100);
            }
        }

        function inputSubmitTotal() {
            var item = {
                id: $stateParams.item.id,
                number: $stateParams.item.number,
                client: $stateParams.item.client,
                clientID: $stateParams.item.clientID,
                date: $stateParams.item.date,
                total: $stateParams.item.total,
                description: $stateParams.item.description
            };

            InputsLocalStorage.editItem(item);
        }

        function goInputsInvoice() {
            loading();
            $timeout(function () {
                $state.go('main.inputs-invoice', {item: $stateParams.item});
            }, 100);
        }

        function goInputs() {
            loading();
            $timeout(function () {
                $state.go('main.inputs');
            }, 100);
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }

        function loading() {
            $rootScope.loading = true;
            $rootScope.myError = false;
        }
    }
})();