(function () {
    'use strict';

    angular
        .module('app')
        .controller('InputsAddCtrl', InputsAddCtrl);

    InputsAddCtrl.$inject = ['$state', '$rootScope', '$filter', 'InputsService', '$stateParams', 'clients'];

    function InputsAddCtrl($state, $rootScope, $filter, InputsService, $stateParams, clients) {
        var vm = this;
        var optionalClient = {name: 'Select customer'};
        angular.extend(vm, $stateParams.item);

        angular.extend(vm, {
            init: init,
            updateChange: updateChange,
            selectedItem: optionalClient,
            inputsAddSubmit: inputsAddSubmit,
            inputsAddBack: inputsAddBack
        });

        init();

        function init() {
            var now = new Date();
            vm.date = $filter('date')(now, 'MM/dd/yyyy H:mm:ss ');
            vm.date = $filter('date')(now, 'dd/MM/yyyy H:mm:ss '); //russian style

            vm.clientsOptions = [].concat(clients);
            vm.clientsOptions.unshift(optionalClient);
            vm.number = vm.count;
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

            InputsService.addItem(item)
                .then(function () {
                    $rootScope.myError = false;
                    $state.go('main.inputs-edit', {item: item});
                    //$state.go('main.inputs');
                })
                .catch(function () {
                    $rootScope.loading = false;
                    $rootScope.myError = true;
                });
        }

        function inputsAddBack() {
            $state.go('main.inputs');
        }
    }
})();