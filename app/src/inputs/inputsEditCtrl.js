(function () {
    'use strict';

    angular
        .module('app')
        .controller('InputsEditCtrl', InputsEditCtrl);

    InputsEditCtrl.$inject = ['$state', '$rootScope', '$filter', 'InputsService', '$stateParams'];

    function InputsEditCtrl($state, $rootScope, $filter, InputsService, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            inputsSubmit: inputsSubmit,
            inputsDialog: inputsDialog,
            inputsEditBack: inputsEditBack
        });

        angular.extend(vm, $stateParams.item);

        init();

        function init() {
            $rootScope.myError = false;
            $rootScope.loading = false;
            vm.total = $filter('number')(vm.total, 2);
        }

        function inputsSubmit() {
            if (vm.form.$invalid) {
                return;
            }

            $rootScope.myError = false;
            $rootScope.loading = true;

            var item = {
                id: vm.id,
                number: vm.number,
                client: vm.client,
                clientID: vm.clientID,
                date: vm.date,
                total: vm.total,
                description: vm.description
            };

            InputsService.editItem(item)
                .then(function () {
                    $rootScope.myError = false;
                    $state.go('main.inputs-invoice', {item: item});
                })
                .catch(function () {
                    $rootScope.loading = false;
                    $rootScope.myError = true;
                });
        }

        function inputsDialog() {
            var item = {
                id: vm.id,
                number: vm.number,
                client: vm.client,
                clientID: vm.clientID,
                date: vm.date,
                total: vm.total,
                description: vm.description
            };
            $state.go('main.inputs-dialog', {item: item});
        }

        function inputsEditBack() {
            $state.go('main.inputs');
        }
    }
})();