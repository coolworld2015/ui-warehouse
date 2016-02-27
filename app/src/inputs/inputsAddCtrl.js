(function () {
    'use strict';

    angular
        .module('app')
        .controller('InputsAddCtrl', InputsAddCtrl);

    InputsAddCtrl.$inject = ['$state', '$rootScope', '$filter', 'InputsService', 'InputsLocalStorage', '$stateParams',
        'clients', 'ClientsLocalStorage'];

    function InputsAddCtrl($state, $rootScope, $filter, InputsService, InputsLocalStorage, $stateParams,
        clients, ClientsLocalStorage) {
        var vm = this;
		
        var optionalClient = {name: 'Select customer'};
        angular.extend(vm, $stateParams.item);

        angular.extend(vm, {
            init: init,
            updateChange: updateChange,
            selectedItem: optionalClient,
            inputsAddSubmit: inputsAddSubmit,
            inputsAddBack: inputsAddBack,
			_errorHandler: errorHandler
        });
		
		init();
        
		function init() {
            var now = new Date();
            vm.date = $filter('date')(now, 'MM/dd/yyyy H:mm:ss ');
            //vm.date = $filter('date')(now, 'dd/MM/yyyy H:mm:ss '); //TODO Russian style
            vm.number = vm.count;
			
			vm.clients = clients;
			vm.clientsOptions = [].concat(vm.clients);
			vm.clientsOptions.unshift(optionalClient);
			$rootScope.myError = false;
			$rootScope.loading = false;
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

        function inputsAddSubmit() {
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
				InputsService.addItem(item)
					.then(function () {
						$rootScope.myError = false;
						$state.go('main.inputs-edit', {item: item});
					})
					.catch(errorHandler);
			} else {
                InputsLocalStorage.addItem(item);
                $state.go('main.inputs-edit', {item: item});
            }
        }

        function inputsAddBack() {
            $state.go('main.inputs');
        }
		
		function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();