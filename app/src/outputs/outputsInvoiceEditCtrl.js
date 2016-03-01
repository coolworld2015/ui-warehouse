(function () {
    'use strict';

    angular
        .module('app')
        .controller('OutputsInvoiceEditCtrl', OutputsInvoiceEditCtrl);

    OutputsInvoiceEditCtrl.$inject = ['$state', '$rootScope', '$filter', 'OutputsInvoiceService',
        'OutputsInvoiceLocalStorage', '$stateParams'];

    function OutputsInvoiceEditCtrl($state, $rootScope, $filter, OutputsInvoiceService,
        OutputsInvoiceLocalStorage, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            invoiceSubmit: invoiceSubmit,
            invoiceDialog: invoiceDialog,
            goOutputsInvoice: goOutputsInvoice,
            goOutputs: goOutputs
        });

        angular.extend(vm, $stateParams.invoice);

        init();

        function init() {
            $rootScope.myError = false;
            $rootScope.loading = false;
            vm.total = $filter('number')(vm.total, 2);
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
                    .catch(function () {
                        $rootScope.loading = false;
                        $rootScope.myError = true;
                    });
            } else {
                OutputsInvoiceLocalStorage.editItem(invoice);
                $state.go('main.outputs-invoice', {item: $stateParams.item});
            }
        }

        function invoiceDialog() {
            $state.go('main.outputs-invoice-dialog', {item: $stateParams.item, invoice: $stateParams.invoice});
        }

        function goOutputsInvoice() {
            $rootScope.myError = false;
            $rootScope.loading = true;
            $state.go('main.outputs-invoice', {item: $stateParams.item});
        }

        function goOutputs() {
            $rootScope.myError = false;
            $rootScope.loading = true;
            $state.go('main.outputs');
        }
    }
})();