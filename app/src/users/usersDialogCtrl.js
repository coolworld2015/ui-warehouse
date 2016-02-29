(function () {
    'use strict';

    angular
        .module('app')
        .controller('UsersDialogCtrl', UsersDialogCtrl);

    UsersDialogCtrl.$inject = ['$state', '$rootScope', '$timeout', 'UsersService', 'UsersLocalStorage', '$stateParams'];

    function UsersDialogCtrl($state, $rootScope, $timeout, UsersService, UsersLocalStorage, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            usersDelete: usersDelete,
            usersEditBack: usersEditBack,
            _errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);

        init();

        function init() {
            $rootScope.loading = false;
        }

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
                $rootScope.loading = true;
                $timeout(function () {
                    $state.go('main.users');
                }, 100);
            }
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