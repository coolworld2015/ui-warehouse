(function () {
    'use strict';

    angular
        .module('app')
        .controller('ClientsDialogCtrl', ClientsDialogCtrl);

    ClientsDialogCtrl.$inject = ['$state', '$rootScope', '$timeout', 'ClientsService', 'ClientsLocalStorage', '$stateParams'];

    function ClientsDialogCtrl($state, $rootScope, $timeout, ClientsService, ClientsLocalStorage, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            clientsDelete: clientsDelete,
            clientsEditBack: clientsEditBack,
			_errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);

        init();

        function init() {
            $rootScope.loading = false;
        }

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
                $rootScope.loading = true;
                $timeout(function () {
                    $state.go('main.clients');
                }, 100);
            }
        }

        function clientsEditBack() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.clients');
            }, 100);
        }
		
		function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();