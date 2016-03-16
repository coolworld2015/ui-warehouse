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
            _deleteItem: deleteItem,
            clientsEditBack: clientsEditBack,
			_errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);
		
        $timeout(function () {
            window.scrollTo(0, 0);
        });
		
        init();

        function init() {
            if ($stateParams.item.id == undefined) {
                $state.go('main.clients');
            }
            $rootScope.loading = false;
        }

        function clientsDelete() {
			$rootScope.loading = true;
            $rootScope.myError = false;
			
			if ($rootScope.mode == 'ON-LINE (Heroku)') {
				ClientsService.deleteItem(vm.id)
					.then(function () {
                        deleteItem(vm.id);
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

        function deleteItem(id) {
            var clients = ClientsService.clients;
            for (var i = 0; i < clients.length; i++) {
                if (clients[i].id == id) {
                    clients.splice(i, 1);
                    break;
                }
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