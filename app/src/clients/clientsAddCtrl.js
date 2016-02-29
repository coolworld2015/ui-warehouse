(function () {
    'use strict';

    angular
        .module('app')
        .controller('ClientsAddCtrl', ClientsAddCtrl);

    ClientsAddCtrl.$inject = ['$state', '$rootScope', 'ClientsService', 'ClientsLocalStorage'];

    function ClientsAddCtrl($state, $rootScope, ClientsService, ClientsLocalStorage) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            clientsAddSubmit: clientsAddSubmit,
            clientsAddBack: clientsAddBack,
			_errorHandler: errorHandler
        });

        init();

        function init() {
            $rootScope.loading = false;
        }

        function clientsAddSubmit() {
            if (vm.form.$invalid) {
                return;
            }
			
            $rootScope.myError = false;
            $rootScope.loading = true;
			
            var id = (Math.random() * 1000000).toFixed();
            var item = {
                id: id,
                name: vm.name,
                address: vm.address,
                phone: vm.phone,
                description: vm.description,
                sum: 0
            };
			
			if ($rootScope.mode == 'ON-LINE (Heroku)') {
				ClientsService.addItem(item)
					.then(function () {
						$rootScope.myError = false;
						$state.go('main.clients');
					})
					.catch(errorHandler);
			} else {
                ClientsLocalStorage.addItem(item);
                $state.go('main.clients');
            }
         }

        function clientsAddBack() {
            $state.go('main.clients');
        }
		
		function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();