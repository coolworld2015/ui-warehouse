(function () {
    'use strict';

    angular
        .module('app')
        .controller('ClientsDialogCtrl', ClientsDialogCtrl);

    ClientsDialogCtrl.$inject = ['$state', '$rootScope', 'ClientsService', '$stateParams'];

    function ClientsDialogCtrl($state, $rootScope, ClientsService, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            clientsDelete: clientsDelete,
            clientsEditBack: clientsEditBack
        });

        angular.extend(vm, $stateParams.item);

        function clientsDelete() {
			$rootScope.loading = true;
            $rootScope.myError = false;
			
			ClientsService.deleteItem(vm.id)
				.then(function () {
					$rootScope.myError = false;
					$state.go('main.clients');
				})
				.catch(function (data) {
					$rootScope.loading = false;
					$rootScope.myError = true;
				});
        }

        function clientsEditBack() {
            $state.go('main.clients');
        }
    }
})();