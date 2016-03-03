(function () {
    'use strict';

    angular
        .module('app')
        .controller('InputsAddCtrl', InputsAddCtrl);

    InputsAddCtrl.$inject = ['$state', '$rootScope', '$filter', '$timeout', 'InputsService', 'InputsLocalStorage',
        '$stateParams', 'clients'];

    function InputsAddCtrl($state, $rootScope, $filter, $timeout, InputsService, InputsLocalStorage,
                           $stateParams, clients) {
        var vm = this;
        var optionalClient = {name: 'Select customer'};
        angular.extend(vm, $stateParams.item);

        angular.extend(vm, {
            init: init,
            updateChange: updateChange,
            selectedItem: optionalClient,
            inputsAddSubmit: inputsAddSubmit,
            _addItem: addItem,
            inputsAddBack: inputsAddBack,
            _errorHandler: errorHandler
        });

        init();

        function init() {
            if ($stateParams.item.count == undefined) {
                $state.go('main.inputs');
            }

            var now = new Date();
            vm.date = $filter('date')(now, 'dd/MM/yyyy H:mm:ss '); //TODO Russian style
            vm.date = $filter('date')(now, 'MM/dd/yyyy H:mm:ss ');
            vm.number = vm.count;

            vm.clients = clients;
            vm.clientsOptions = [].concat(vm.clients);
            vm.clientsOptions.unshift(optionalClient);
            $rootScope.myError = false;
            $rootScope.loading = false;
        }

        function updateChange(item) {
            vm.error = false;
            vm.clientID = item.id;
        }

        function inputsAddSubmit() {
            if (vm.selectedItem.name == 'Select customer') {
                vm.error = true;
                return;
            }

            if (vm.form.$invalid) {
                return;
            }

            $rootScope.myError = false;
            $rootScope.loading = true;

            var id = (Math.random() * 1000000).toFixed();
            var item = {
                id: id,
                number: vm.number,
                client: vm.selectedItem.name,
                clientID: vm.clientID,
                date: vm.date,
                total: 0,
                description: vm.description
            };

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                InputsService.addItem(item)
                    .then(function () {
                        addItem(item);
                        $rootScope.myError = false;
                        $state.go('main.inputs-edit', {item: item});
                    })
                    .catch(errorHandler);
            } else {
                InputsLocalStorage.addItem(item);
                $rootScope.loading = true;
                $timeout(function () {
                    $state.go('main.inputs-edit', {item: item});
                }, 100);
            }
        }

        function addItem(item) {
            InputsService.inputs.push(item);
        }

        function inputsAddBack() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.inputs');
            }, 100);
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();