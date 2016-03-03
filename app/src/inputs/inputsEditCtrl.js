(function () {
    'use strict';

    angular
        .module('app')
        .controller('InputsEditCtrl', InputsEditCtrl);

    InputsEditCtrl.$inject = ['$state', '$rootScope', '$filter', '$timeout', 'InputsService', 'InputsLocalStorage', '$stateParams'];

    function InputsEditCtrl($state, $rootScope, $filter, $timeout, InputsService, InputsLocalStorage, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            inputsSubmit: inputsSubmit,
            _editItem: editItem,
            inputsDialog: inputsDialog,
            inputsEditBack: inputsEditBack
        });

        angular.extend(vm, $stateParams.item);

        $timeout(function () {
            window.scrollTo(0, 0);
        });

		init();
        
		function init() {
            if ($stateParams.item.id == undefined) {
                $state.go('main.inputs');
            }

            vm.total = $filter('number')(vm.total, 2);
            $rootScope.myError = false;
            $rootScope.loading = false;
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
			
			if ($rootScope.mode == 'ON-LINE (Heroku)') {
				InputsService.editItem(item)
					.then(function () {
                        editItem(item);
						$rootScope.myError = false;
						$state.go('main.inputs-invoice', {item: item});
					})
					.catch(function () {
						$rootScope.loading = false;
						$rootScope.myError = true;
					});
			} else {
                InputsLocalStorage.editItem(item);
                $rootScope.loading = true;
                $timeout(function () {
                    $state.go('main.inputs-invoice', {item: item});
                }, 100);
            }
        }

        function editItem(item) {
            var inputs = InputsService.inputs;
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].id == item.id) {
                    inputs.splice(i, 1, item);
                    break;
                }
            }
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
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.inputs-dialog', {item: item});
            }, 100);
        }

        function inputsEditBack() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.inputs');
            }, 100);
        }
    }
})();