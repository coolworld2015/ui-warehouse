(function () {
    'use strict';

    angular
        .module('app')
        .controller('OutputsInvoiceCtrl', OutputsInvoiceCtrl);

    OutputsInvoiceCtrl.$inject = ['$state', '$rootScope', '$filter', 'invoice', '$stateParams'];

    function OutputsInvoiceCtrl($state, $rootScope, $filter, invoice, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            addInvoice: addInvoice,
            editInvoice: editInvoice,
            outputEditExitInvoice: outputEditExitInvoice,
            goOutputs: goOutputs
        });

        angular.extend(vm, $stateParams.item);

        init();

        function init() {
            $rootScope.myError = false;
            $rootScope.loading = false;

            vm.outputInvoice = invoice;
            vm.total = $filter('number')(vm.total, 2);
            vm.sortInvoice = 'invoiceID';
            vm.invoiceFilter = {invoiceID: $stateParams.item.id};
        }

        function editInvoice(invoice) {
            $state.go('main.outputs-invoice-edit', {item: $stateParams.item, invoice: invoice});
        }

        function addInvoice() {
            $rootScope.myError = false;
            $rootScope.loading = true;

            $state.go('main.outputs-invoice-add', {item: $stateParams.item});
        }

        function outputEditExitInvoice() {
            $state.go('main.outputs-edit', {item: $stateParams.item});
        }

        function goOutputs() {
            $rootScope.myError = false;
            $rootScope.loading = true;
            $state.go('main.outputs');
        }
    }
})();