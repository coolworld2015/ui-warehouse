(function () {
    'use strict';

    angular
        .module('app')
        .controller('ClientsDialogCtrl', ClientsDialogCtrl);

    ClientsDialogCtrl.$inject = ['$state', '$rootScope', 'ClientsService', 'ClientsLocalStorage', '$stateParams'];

    function ClientsDialogCtrl($state, $rootScope, ClientsService, ClientsLocalStorage, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            clientsDelete: clientsDelete,
            clientsEditBack: clientsEditBack,
			_errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);

        function clientsDelete() {
			$rootScope.loading = true;
            $rootScope.myError = false;
			
			if ($rootScope.mode == 'ON-LINE (Heroku)') {
				ClientsService.deleteItem(vm.id)
					.then(function () {
						$rootScope.myError = false;
						$state.go('main.clients');
					})
					.catch(errorHandler);
			} else {
                ClientsLocalStorage.deleteItem(vm.id);
                $state.go('main.clients');
            }
        }

        function clientsEditBack() {
            $state.go('main.clients');
        }
		
		function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();