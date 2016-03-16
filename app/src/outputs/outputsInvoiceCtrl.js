(function () {
    'use strict';

    angular
        .module('app')
        .controller('OutputsInvoiceCtrl', OutputsInvoiceCtrl);

    OutputsInvoiceCtrl.$inject = ['$state', '$rootScope', '$filter', '$timeout', 'outputInvoices', '$stateParams'];

    function OutputsInvoiceCtrl($state, $rootScope, $filter, $timeout, outputInvoices, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            addInvoice: addInvoice,
            editInvoice: editInvoice,
            outputEditExitInvoice: outputEditExitInvoice,
            goOutputs: goOutputs,
            _errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);
		
        $timeout(function () {
            window.scrollTo(0, 0);
        });
		
        init();

        function init() {
            if ($stateParams.item.id == undefined) {
                $state.go('main.outputs');
            }

            vm.outputInvoices = [].concat(outputInvoices);

            vm.total = $filter('number')(vm.total, 2);
            vm.sortInvoice = 'invoiceID';
            vm.invoiceFilter = {invoiceID: $stateParams.item.id};

            $rootScope.myError = false;
            $rootScope.loading = false;
        }

        function editInvoice(invoice) {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.outputs-invoice-edit', {item: $stateParams.item, invoice: invoice});
            }, 100);
        }

        function addInvoice() {
            $rootScope.myError = false;
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.outputs-invoice-add', {item: $stateParams.item});
            }, 100);
        }

        function outputEditExitInvoice() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.outputs-edit', {item: $stateParams.item});
            }, 100);
        }

        function goOutputs() {
            $rootScope.myError = false;
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