(function () {
    'use strict';

    angular
        .module('app')
        .controller('OutputsEditCtrl', OutputsEditCtrl);

    OutputsEditCtrl.$inject = ['$state', '$rootScope', '$filter', 'OutputsService', '$stateParams'];

    function OutputsEditCtrl($state, $rootScope, $filter, OutputsService, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            outputsSubmit: outputsSubmit,
            outputsDialog: outputsDialog,
            outputsEditBack: outputsEditBack
        });

        angular.extend(vm, $stateParams.item);

        init();

        function init() {
            $rootScope.myError = false;
            $rootScope.loading = false;
            vm.total = $filter('number')(vm.total, 2);
        }

        function outputsSubmit() {
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

            OutputsService.editItem(item)
                .then(function () {
                    $rootScope.myError = false;
                    $state.go('main.outputs-invoice', {item: item});
                })
                .catch(function () {
                    $rootScope.loading = false;
                    $rootScope.myError = true;
                });
        }

        function outputsDialog() {
            var item = {
                id: vm.id,
                number: vm.number,
                client: vm.client,
                clientID: vm.clientID,
                date: vm.date,
                total: vm.total,
                description: vm.description
            };
            $state.go('main.outputs-dialog', {item: item});
        }

        function outputsEditBack() {
            $state.go('main.outputs');
        }
    }
})();