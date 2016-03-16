(function () {
    'use strict';

    angular
        .module('app')
        .controller('OutputsAddCtrl', OutputsAddCtrl);

    OutputsAddCtrl.$inject = ['$state', '$rootScope', '$filter', '$timeout', 'OutputsService', 'OutputsLocalStorage',
        '$stateParams', 'clients'];

    function OutputsAddCtrl($state, $rootScope, $filter, $timeout, OutputsService, OutputsLocalStorage,
                            $stateParams, clients) {
        var vm = this;
        var optionalClient = {name: 'Select customer'};
        angular.extend(vm, $stateParams.item);

        angular.extend(vm, {
            init: init,
            updateChange: updateChange,
            selectedItem: optionalClient,
            outputsAddSubmit: outputsAddSubmit,
            _addItem: addItem,
            outputsAddBack: outputsAddBack,
            _errorHandler: errorHandler
        });
		
        $timeout(function () {
            window.scrollTo(0, 0);
        });
		
        init();

        function init() {
            if ($stateParams.item.count == undefined) {
                $state.go('main.outputs');
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

        function outputsAddSubmit() {
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
                OutputsService.addItem(item)
                    .then(function () {
                        addItem(item);
                        $rootScope.myError = false;
                        $state.go('main.outputs-edit', {item: item});
                    })
                    .catch(errorHandler);
            } else {
                OutputsLocalStorage.addItem(item);
                $rootScope.loading = true;
                $timeout(function () {
                    $state.go('main.outputs-edit', {item: item});
                }, 100);
            }
        }

        function addItem(item) {
            OutputsService.outputs.push(item);
        }

        function outputsAddBack() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.outputs');
            }, 100);
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();