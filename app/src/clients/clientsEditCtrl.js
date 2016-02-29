(function () {
    'use strict';

    angular
        .module('app')
        .controller('ClientsEditCtrl', ClientsEditCtrl);

    ClientsEditCtrl.$inject = ['$state', '$rootScope', '$filter', '$timeout', 'ClientsService', 'ClientsLocalStorage', '$stateParams'];

    function ClientsEditCtrl($state, $rootScope, $filter, $timeout, ClientsService, ClientsLocalStorage, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            clientsSubmit: clientsSubmit,
            clientsDialog: clientsDialog,
            clientsEditBack: clientsEditBack,
            _errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);

        init();

        function init() {
            if ($stateParams.item.name == undefined) {
                $state.go('main.clients');
            }
            vm.total = $filter('number')(vm.sum, 2);
            $rootScope.loading = false;
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
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                ClientsService.editItem(item)
                    .then(function () {
                        $rootScope.myError = false;
                        $state.go('main.clients');
                    })
                    .catch(errorHandler);
            } else {
                ClientsLocalStorage.editItem(item);
                $rootScope.loading = true;
                $timeout(function () {
                    $state.go('main.clients');
                }, 100);
            }
        }

        function clientsDialog() {
            var obj = {
                id: vm.id,
                name: vm.name
            };
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.clients-dialog', {item: obj});
            }, 100);
        }

        function clientsEditBack() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.clients');
            }, 100);
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();