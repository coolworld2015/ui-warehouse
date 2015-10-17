(function () {
    'use strict';

    angular
        .module('app')
        .controller('UsersAddCtrl', UsersAddCtrl);

    UsersAddCtrl.$inject = ['$state', '$rootScope', 'UsersService'];

    function UsersAddCtrl($state, $rootScope, UsersService) {
        var vm = this;

        angular.extend(vm, {
            usersAddSubmit: usersAddSubmit,
            usersAddBack: usersAddBack
        });

        function usersAddSubmit() {
            if (vm.form.$invalid) {
                return;
            }

            $rootScope.myError = false;
            $rootScope.loading = true;

            var id = (Math.random() * 1000000).toFixed();
            var item = {
                id: id,
                name: vm.name,
                pass: vm.pass,
                description: vm.description
            };

            UsersService.addItem(item)
                .then(function () {
                    $rootScope.myError = false;
                    $state.go('main.users');
                })
                .catch(function () {
                    $rootScope.loading = false;
                    $rootScope.myError = true;
                });
        }

        function usersAddBack() {
            $state.go('main.users');
        }
    }
})();
