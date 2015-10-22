(function () {
    'use strict';

    angular
        .module('app')
        .controller('InputsCtrl', InputsCtrl);

    InputsCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'InputsService', 'InputsLocalStorage'];

    function InputsCtrl($scope, $rootScope, $state, $timeout, InputsService, InputsLocalStorage) {
        $scope.$watch('numPerPage', currentPage);
        $scope.$watch('currentPage', currentPage);
        var vm = this;

        angular.extend(vm, {
            init: init,
            currentPage: currentPage,
            numPages: numPages,
            inputsSort: inputsSort,
            inputsEditForm: inputsEditForm,
            inputsAdd: inputsAdd,
            goToBack: goToBack,
            goToHead: goToHead,
            inputsBack: inputsBack,
			_errorHandler: errorHandler
        });

        init();

        $timeout(function () {
            $scope.$broadcast('_scrollHere');
        });

        function init() {
            $scope.currentPage = 1;
            $scope.numPerPage = 10;
            $scope.maxSize = 5;

            vm.title = 'Purchase Invoices';
            vm.sort = 'name';
            
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                getInputsOn();
            } else {
                vm.inputs = [].concat(InputsLocalStorage.getInputs());
				$rootScope.myError = false;
				$rootScope.loading = false;
            }
		}
		
        function getInputsOn() {
            InputsService.getInputs()
				.then(function(data){
					$scope.filteredInputs = [];
					vm.inputs = data.data;
					currentPage();
					$rootScope.myError = false;
					$rootScope.loading = false;
				})
				.catch(errorHandler);
        }

        function currentPage() {
            if (Object.prototype.toString.call(vm.inputs) == '[object Array]') {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage);
                var end = parseInt(begin) + parseInt($scope.numPerPage);
                $scope.filteredInputs = vm.inputs.slice(begin, end);
                $scope.totalItems = vm.inputs.length;
            }
        }

        function numPages() {
            return Math.ceil(vm.inputs.length / $scope.numPerPage);
        }

        function inputsSort(val) {
            vm.sort = val;
            vm.rev = !vm.rev;
        }

        function inputsEditForm(item) {
            $state.go('main.inputs-edit', {item: item});
        }

        function inputsAdd() {
			$rootScope.loading = true;
            var obj = {
                count: ++vm.inputs.length
            };
            $state.go('main.inputs-add', {item: obj});
        }

        function goToBack() {
            $scope.$broadcast('scrollHere');
        }

        function goToHead() {
            $scope.$broadcast('scrollThere');
        }

        function inputsBack() {
            $state.go('main');
        }
		
		function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();
