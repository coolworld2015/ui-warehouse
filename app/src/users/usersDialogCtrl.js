(function () {
    'use strict';

    angular
        .module('app')
        .controller('UsersDialogCtrl', UsersDialogCtrl);

    UsersDialogCtrl.$inject = ['$state', '$rootScope', 'UsersService', 'UsersLocalStorage', '$stateParams'];

    function UsersDialogCtrl($state, $rootScope, UsersService, UsersLocalStorage, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            usersDelete: usersDelete,
            usersEditBack: usersEditBack,
			_errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);

        function usersDelete() {
            $rootScope.loading = true;
            $rootScope.myError = false;
			
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
				UsersService.deleteItem(vm.id)
					.then(function () {
						$rootScope.myError = false;
						$state.go('main.users');
					})
					.catch(errorHandler);
			} else {
				UsersLocalStorage.deleteItem(vm.id);
				$state.go('main.users');
			}
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