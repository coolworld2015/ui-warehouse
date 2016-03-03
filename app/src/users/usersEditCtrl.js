(function () {
    'use strict';
    
    angular
        .module('app')
        .controller('UsersEditCtrl', UsersEditCtrl);

    UsersEditCtrl.$inject = ['$state', '$rootScope', '$filter', '$timeout', 'UsersService', 'UsersLocalStorage', '$stateParams'];

    function UsersEditCtrl($state, $rootScope, $filter, $timeout, UsersService, UsersLocalStorage, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            usersSubmit: usersSubmit,
            _editItem: editItem,
            usersDialog: usersDialog,
            usersEditBack: usersEditBack,
			_errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);

        init();

        function init() {
            if ($stateParams.item.name == undefined) {
                $state.go('main.users');
            }
            vm.total = $filter('number')(vm.sum, 2);
            $rootScope.loading = false;
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
                        editItem(item);
						$rootScope.myError = false;
						$state.go('main.users');
					})
					.catch(errorHandler);
			} else {
				UsersLocalStorage.editItem(item);
                $rootScope.loading = true;
                $timeout(function () {
                    $state.go('main.users');
                }, 100);
			}
        }

        function editItem(item) {
            var users = UsersService.users;
            for (var i = 0; i < users.length; i++) {
                if (users[i].id == item.id) {
                    users.splice(i, 1, item);
                    break;
                }
            }
        }

        function usersDialog() {
            var obj = {
                id: vm.id,
                name: vm.name
            };
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.users-dialog', {item: obj});
            }, 100);
        }

        function usersEditBack() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.users');
            }, 100);
        }
		
        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();