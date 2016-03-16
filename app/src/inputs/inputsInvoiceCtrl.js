(function () {
    'use strict';

    angular
        .module('app')
        .controller('InputsInvoiceCtrl', InputsInvoiceCtrl);

    InputsInvoiceCtrl.$inject = ['$state', '$rootScope', '$filter', '$timeout', '$stateParams', 'inputInvoices'];

    function InputsInvoiceCtrl($state, $rootScope, $filter, $timeout, $stateParams, inputInvoices) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            addInvoice: addInvoice,
            editInvoice: editInvoice,
            inputEditExitInvoice: inputEditExitInvoice,
            goInputs: goInputs,
            _errorHandler: errorHandler
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

            vm.inputInvoices = [].concat(inputInvoices);

            vm.total = $filter('number')(vm.total, 2);
            vm.sortInvoice = 'invoiceID';
            vm.invoiceFilter = {invoiceID: $stateParams.item.id};

            $rootScope.myError = false;
            $rootScope.loading = false;
        }

        function editInvoice(invoice) {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.inputs-invoice-edit', {item: $stateParams.item, invoice: invoice});
            }, 100);
        }

        function addInvoice() {
            $rootScope.myError = false;
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.inputs-invoice-add', {item: $stateParams.item});
            }, 100);
        }

        function inputEditExitInvoice() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.inputs-edit', {item: $stateParams.item});
            }, 100);
        }

        function goInputs() {
            $rootScope.myError = false;
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