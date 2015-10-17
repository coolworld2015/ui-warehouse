(function () {
    'use strict';

    angular
        .module('app')
        .controller('UsersDialogCtrl', UsersDialogCtrl);

    UsersDialogCtrl.$inject = ['$state', '$rootScope', 'UsersService', '$stateParams'];

    function UsersDialogCtrl($state, $rootScope, UsersService, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            usersDelete: usersDelete,
            usersEditBack: usersEditBack
        });

        angular.extend(vm, $stateParams.item);

        function usersDelete() {
            $rootScope.loading = true;
            $rootScope.myError = false;

            UsersService.deleteItem(vm.id)
                .then(function () {
                    $rootScope.myError = false;
                    $state.go('main.users');
                })
                .catch(function (data) {
                    $rootScope.loading = false;
                    $rootScope.myError = true;
                });
        }

        function usersEditBack() {
            $state.go('main.users');
        }
    }
})();