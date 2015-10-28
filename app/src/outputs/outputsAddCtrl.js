(function () {
    'use strict';

    angular
        .module('app')
        .controller('OutputsAddCtrl', OutputsAddCtrl);

    OutputsAddCtrl.$inject = ['$state', '$rootScope', '$filter', 'OutputsService', 'OutputsLocalStorage', '$stateParams', 'ClientsService', 'ClientsLocalStorage'];

    function OutputsAddCtrl($state, $rootScope, $filter, OutputsService, OutputsLocalStorage, $stateParams, ClientsService, ClientsLocalStorage) {
        var vm = this;
        var optionalClient = {name: 'Select customer'};
        angular.extend(vm, $stateParams.item);

        angular.extend(vm, {
            init: init,
            updateChange: updateChange,
            selectedItem: optionalClient,
            outputsAddSubmit: outputsAddSubmit,
            outputsAddBack: outputsAddBack,
			_errorHandler: errorHandler
        });

        init();

        function init() {
            var now = new Date();
            vm.date = $filter('date')(now, 'MM/dd/yyyy H:mm:ss ');
            vm.date = $filter('date')(now, 'dd/MM/yyyy H:mm:ss '); //russian style
            vm.number = vm.count;
			
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                getClientsOn();
            } else {
                vm.clients = ClientsLocalStorage.getClients();
				vm.clientsOptions = [].concat(vm.clients);
				vm.clientsOptions.unshift(optionalClient);
				$rootScope.myError = false;
				$rootScope.loading = false;
            }
        }
		
        function getClientsOn() {
            ClientsService.getClients()
				.then(function(data){
					vm.clientsOptions = [].concat(data.data);
					vm.clientsOptions.unshift(optionalClient);
					$rootScope.myError = false;
					$rootScope.loading = false;
				})
				.catch(errorHandler);
        }
		
        function updateChange(item) {
            vm.error = false;
            vm.clientID = item.id;
        }

        function outputsAddSubmit() {
            if (vm.selectedItem.name == 'Select customer') {
                vm.error = true;
                return;
            }

            if (vm.form.$invalid) {
                return;
            }

            $rootScope.myError = false;
            $rootScope.loading = true;

            var id = (Math.random() * 1000000).toFixed();
            var item = {
                id: id,
                number: vm.number,
                client: vm.selectedItem.name,
                clientID: vm.clientID,
                date: vm.date,
                total: 0,
                description: vm.description
            };
			
			if ($rootScope.mode == 'ON-LINE (Heroku)') {
				OutputsService.addItem(item)
					.then(function () {
						$rootScope.myError = false;
						$state.go('main.outputs-edit', {item: item});
					})
					.catch(errorHandler);
			} else {
				OutputsLocalStorage.addItem(item);
                $state.go('main.outputs-edit', {item: item});
			}
        }

        function outputsAddBack() {
            $state.go('main.outputs');
        }
		
		function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();