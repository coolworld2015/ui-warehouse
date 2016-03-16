(function () {
    'use strict';

    angular
        .module('app')
        .controller('ClientsAddCtrl', ClientsAddCtrl);

    ClientsAddCtrl.$inject = ['$state', '$rootScope', '$timeout', 'ClientsService', 'ClientsLocalStorage'];

    function ClientsAddCtrl($state, $rootScope, $timeout, ClientsService, ClientsLocalStorage) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            clientsAddSubmit: clientsAddSubmit,
            _addItem: addItem,
            clientsAddBack: clientsAddBack,
			_errorHandler: errorHandler
        });

		$timeout(function () {
            window.scrollTo(0, 0);
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
                        addItem(item);
						$rootScope.myError = false;
						$state.go('main.clients');
					})
					.catch(errorHandler);
			} else {
                ClientsLocalStorage.addItem(item);
                $rootScope.loading = true;
                $timeout(function () {
                    $state.go('main.clients');
                }, 100);
            }
         }

        function addItem(item) {
            ClientsService.clients.push(item);
        }

        function clientsAddBack() {
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