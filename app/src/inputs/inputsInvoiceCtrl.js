(function () {
    'use strict';

    angular
        .module('app')
        .controller('InputsInvoiceCtrl', InputsInvoiceCtrl);

    InputsInvoiceCtrl.$inject = ['$state', '$rootScope', '$filter', 'invoice', '$stateParams'];

    function InputsInvoiceCtrl($state, $rootScope, $filter, invoice, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            addInvoice: addInvoice,
            editInvoice: editInvoice,
            inputEditExitInvoice: inputEditExitInvoice,
            goInputs: goInputs
        });

        angular.extend(vm, $stateParams.item);

        init();

        function init() {
            $rootScope.myError = false;
            $rootScope.loading = false;

            vm.inputInvoice = invoice;
            vm.total = $filter('number')(vm.total, 2);
            vm.sortInvoice = 'invoiceID';
            vm.invoiceFilter = {invoiceID: $stateParams.item.id};
        }

        function editInvoice(invoice) {
            $state.go('main.inputs-invoice-edit', {item: $stateParams.item, invoice: invoice});
        }

        function addInvoice() {
            $rootScope.myError = false;
            $rootScope.loading = true;

            $state.go('main.inputs-invoice-add', {item: $stateParams.item});
        }

        function inputEditExitInvoice() {
            $state.go('main.inputs-edit', {item: $stateParams.item});
        }

        function goInputs() {
            $rootScope.myError = false;
            $rootScope.loading = true;
            $state.go('main.inputs');
        }
    }
})();