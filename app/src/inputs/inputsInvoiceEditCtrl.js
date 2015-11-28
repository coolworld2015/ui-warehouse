(function () {
    'use strict';

    angular
        .module('app')
        .controller('InputsInvoiceEditCtrl', InputsInvoiceEditCtrl);

    InputsInvoiceEditCtrl.$inject = ['$state', '$rootScope', '$filter', 'InputsInvoiceService',
        'InputsInvoiceLocalStorage', '$stateParams'];

    function InputsInvoiceEditCtrl($state, $rootScope, $filter, InputsInvoiceService,
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
                InputsInvoiceService.editItem(invoice)
                    .then(function () {
                        $rootScope.myError = false;
                        $state.go('main.inputs-invoice', {item: $stateParams.item});
                    })
                    .catch(errorHandler);
            } else {
                InputsInvoiceLocalStorage.editItem(invoice);
                $state.go('main.inputs-invoice', {item: $stateParams.item});
            }
        }

        function invoiceDialog() {
            $state.go('main.inputs-invoice-dialog', {item: $stateParams.item, invoice: $stateParams.invoice});
        }

        function goInputsInvoice() {
            $rootScope.myError = false;
            $rootScope.loading = true;
            $state.go('main.inputs-invoice', {item: $stateParams.item});
        }

        function goInputs() {
            $rootScope.myError = false;
            $rootScope.loading = true;
            $state.go('main.inputs');
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();