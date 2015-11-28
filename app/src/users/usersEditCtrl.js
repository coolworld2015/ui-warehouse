(function () {
    'use strict';
    
    angular
        .module('app')
        .controller('UsersEditCtrl', UsersEditCtrl);

    UsersEditCtrl.$inject = ['$state', '$rootScope', '$filter', 'UsersService', 'UsersLocalStorage', '$stateParams'];

    function UsersEditCtrl($state, $rootScope, $filter, UsersService, UsersLocalStorage, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            usersSubmit: usersSubmit,
            usersDialog: usersDialog,
            usersEditBack: usersEditBack,
			_errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);

        function init() {
            vm.total = $filter('number')(vm.sum, 2);
        }

        function usersSubmit() {
            if (vm.form.$invalid) {
                return;
            }

            $rootScope.myError = false;
            $rootScope.loading = true;

            var item = {
                id: vm.id,
                name: vm.name,
                pass: vm.pass,
                description: vm.description
            };
			
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
				UsersService.editItem(item)
					.then(function () {
						$rootScope.myError = false;
						$state.go('main.users');
					})
					.catch(errorHandler);
			} else {
				UsersLocalStorage.editItem(item);
				$state.go('main.users');
			}
        }

        function usersDialog() {
            var obj = {
                id: vm.id,
                name: vm.name
            };
            $state.go('main.users-dialog', {item: obj});
        }

        function usersEditBack() {
            $state.go('main.users');
        }
		
        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();