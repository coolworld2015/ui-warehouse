(function () {
    'use strict';

    angular
        .module('app')
        .controller('ClientsEditCtrl', ClientsEditCtrl);

    ClientsEditCtrl.$inject = ['$state', '$rootScope', '$filter', 'ClientsService', '$stateParams'];

    function ClientsEditCtrl($state, $rootScope, $filter, ClientsService, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            clientsSubmit: clientsSubmit,
            clientsDialog: clientsDialog,
            clientsEditBack: clientsEditBack
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

			ClientsService.editItem(item)
				.then(function () {
					$rootScope.myError = false;
					$state.go('main.clients');
				})
				.catch(function () {
					$rootScope.loading = false;
					$rootScope.myError = true;
				});
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
    }
})();