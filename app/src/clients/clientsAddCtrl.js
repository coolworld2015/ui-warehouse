(function () {
    'use strict';

    angular
        .module('app')
        .controller('ClientsAddCtrl', ClientsAddCtrl);

    ClientsAddCtrl.$inject = ['$state', '$rootScope', 'ClientsService'];

    function ClientsAddCtrl($state, $rootScope, ClientsService) {
        var vm = this;

        angular.extend(vm, {
            clientsAddSubmit: clientsAddSubmit,
            clientsAddBack: clientsAddBack
        });

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
			
			ClientsService.addItem(item)
				.then(function () {
					$rootScope.myError = false;
					$state.go('main.clients');
				})
				.catch(function (data) {
					$rootScope.loading = false;
					$rootScope.myError = true;
				});
         }

        function clientsAddBack() {
            $state.go('main.clients');
        }
    }
})();