(function () {
    'use strict';

    angular
        .module('app')
        .controller('InputsInvoiceEditCtrl', InputsInvoiceEditCtrl);

    InputsInvoiceEditCtrl.$inject = ['$state', '$rootScope', '$filter', '$timeout', 'InputsInvoiceService',
        'InputsInvoiceLocalStorage', '$stateParams'];

    function InputsInvoiceEditCtrl($state, $rootScope, $filter, $timeout, InputsInvoiceService,
        InputsInvoiceLocalStorage, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            invoiceSubmit: invoiceSubmit,
            invoiceDialog: invoiceDialog,
            goInputsInvoice: goInputsInvoice,
            goInputs: goInputs,
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
            vm.total = $filter('number')(vm.total, 2);
            $rootScope.myError = false;
            $rootScope.loading = false;
        }

        function invoiceSubmit() {
            if (vm.form.$invalid) {
                return;
            }

            $rootScope.myError = false;
            $rootScope.loading = true;

            var invoice = {
                id: vm.id,
                invoiceID: vm.invoiceID,
                goods: vm.goods,
                goodsID: vm.goodsID,
                price: vm.price,
                quantity: vm.quantity,
                total: vm.total,
                description: vm.description
            };

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                InputsInvoiceService.editItem(invoice)
                    .then(function () {
                        $rootScope.myError = false;
                        $state.go('main.inputs-invoice', {item: $stateParams.item});
                    })
                    .catch(errorHandler);
            } else {
                InputsInvoiceLocalStorage.editItem(invoice);
                $rootScope.loading = true;
                $timeout(function () {
                    $state.go('main.inputs-invoice', {item: $stateParams.item});
                }, 100);
            }
        }

        function invoiceDialog() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.inputs-invoice-dialog', {item: $stateParams.item, invoice: $stateParams.invoice});
            }, 100);
        }

        function goInputsInvoice() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.inputs-invoice', {item: $stateParams.item});
            }, 100);
        }

        function goInputs() {
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