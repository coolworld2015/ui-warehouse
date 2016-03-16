(function () {
    'use strict';

    angular
        .module('app')
        .controller('OutputsInvoiceEditCtrl', OutputsInvoiceEditCtrl);

    OutputsInvoiceEditCtrl.$inject = ['$state', '$rootScope', '$filter', '$timeout', 'OutputsInvoiceService',
        'OutputsInvoiceLocalStorage', '$stateParams'];

    function OutputsInvoiceEditCtrl($state, $rootScope, $filter, $timeout, OutputsInvoiceService,
        OutputsInvoiceLocalStorage, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            invoiceSubmit: invoiceSubmit,
            invoiceDialog: invoiceDialog,
            goOutputsInvoice: goOutputsInvoice,
            goOutputs: goOutputs,
            _errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.invoice);
		
        $timeout(function () {
            window.scrollTo(0, 0);
        });
		
        init();

        function init() {
            if ($stateParams.item.id == undefined) {
                $state.go('main.outputs');
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
                OutputsInvoiceService.editItem(invoice)
                    .then(function () {
                        $rootScope.myError = false;
                        $state.go('main.outputs-invoice', {item: $stateParams.item});
                    })
                    .catch(errorHandler);
            } else {
                OutputsInvoiceLocalStorage.editItem(invoice);
                $rootScope.loading = true;
                $timeout(function () {
                    $state.go('main.outputs-invoice', {item: $stateParams.item});
                }, 100);
            }
        }

        function invoiceDialog() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.outputs-invoice-dialog', {item: $stateParams.item, invoice: $stateParams.invoice});
            }, 100);
        }

        function goOutputsInvoice() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.outputs-invoice', {item: $stateParams.item});
            }, 100);
        }

        function goOutputs() {
            $rootScope.myError = false;
            $rootScope.loading = true;
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