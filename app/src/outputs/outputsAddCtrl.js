(function () {
    'use strict';

    angular
        .module('app')
        .controller('OutputsAddCtrl', OutputsAddCtrl);

    OutputsAddCtrl.$inject = ['$state', '$rootScope', '$filter', 'OutputsService', '$stateParams', 'clients'];

    function OutputsAddCtrl($state, $rootScope, $filter, OutputsService, $stateParams, clients) {
        var vm = this;
        var optionalClient = {name: 'Select customer'};
        angular.extend(vm, $stateParams.item);

        angular.extend(vm, {
            init: init,
            updateChange: updateChange,
            selectedItem: optionalClient,
            outputsAddSubmit: outputsAddSubmit,
            outputsAddBack: outputsAddBack
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

            OutputsService.addItem(item)
                .then(function () {
                    $rootScope.myError = false;
                    $state.go('main.outputs-edit', {item: item});
                    //$state.go('main.outputs');
                })
                .catch(function () {
                    $rootScope.loading = false;
                    $rootScope.myError = true;
                });
        }

        function outputsAddBack() {
            $state.go('main.outputs');
        }
    }
})();