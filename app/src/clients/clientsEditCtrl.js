(function () {
    'use strict';

    angular
        .module('app')
        .controller('ClientsEditCtrl', ClientsEditCtrl);

    ClientsEditCtrl.$inject = ['$state', '$rootScope', '$filter', 'ClientsService', 'ClientsLocalStorage', '$stateParams'];

    function ClientsEditCtrl($state, $rootScope, $filter, ClientsService, ClientsLocalStorage, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            clientsSubmit: clientsSubmit,
            clientsDialog: clientsDialog,
            clientsEditBack: clientsEditBack,
			_errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);

        init();

        function init() {
            vm.total = $filter('number')(vm.sum, 2);
        }

        function clientsSubmit() {
            if (vm.form.$invalid) {
                return;
            }
			
			$rootScope.loading = true;
            $rootScope.myError = false;
			
            var item = {
                id: vm.id,
                name: vm.name,
                address: vm.address,
                phone: vm.phone,
                sum: vm.sum,
                description: vm.description
            };
			if ($rootScope.mode == 'ON-LINE (Heroku)') {
				ClientsService.editItem(item)
					.then(function () {
						$rootScope.myError = false;
						$state.go('main.clients');
					})
					.catch(errorHandler);;
			} else {
				ClientsLocalStorage.editItem(item);
				$state.go('main.clients');
			}
        }

        function clientsDialog() {
            var obj = {
                id: vm.id,
                name: vm.name
            };
            $state.go('main.clients-dialog', {item: obj});
        }

        function clientsEditBack() {
			$rootScope.loading = true;
            $state.go('main.clients');
        }
		
		function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();