(function () {
    'use strict';

    angular
        .module('app')
        .controller('InputsInvoiceCtrl', InputsInvoiceCtrl);

    InputsInvoiceCtrl.$inject = ['$state', '$rootScope', '$filter', 'InputsInvoiceService', 'InputsInvoiceLocalStorage', '$stateParams'];

    function InputsInvoiceCtrl($state, $rootScope, $filter, InputsInvoiceService, InputsInvoiceLocalStorage, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
			_getInputInvoicesOn: getInputInvoicesOn,
            addInvoice: addInvoice,
            editInvoice: editInvoice,
            inputEditExitInvoice: inputEditExitInvoice,
            goInputs: goInputs,
            _errorHandler: errorHandler			
        });

        angular.extend(vm, $stateParams.item);

        init();

        function init() {
            $rootScope.myError = false;
            $rootScope.loading = false;

			if ($rootScope.mode == 'ON-LINE (Heroku)') {
                getInputInvoicesOn();
            } else {
                vm.inputInvoices = [].concat(InputsInvoiceLocalStorage.getInputInvoice());
				$rootScope.myError = false;
				$rootScope.loading = false;
            }
			
            vm.total = $filter('number')(vm.total, 2);
            vm.sortInvoice = 'invoiceID';
            vm.invoiceFilter = {invoiceID: $stateParams.item.id};
        }
		
        function getInputInvoicesOn() {
			InputsInvoiceService.getInvoices()
				.then(function(data){
					vm.inputInvoices = data.data;
					$rootScope.myError = false;
					$rootScope.loading = false;
				})
				.catch(errorHandler);
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
		
        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }		
    }
})();