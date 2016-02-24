(function () {
    'use strict';

    angular
        .module('app')
        .controller('OutputsCtrl', OutputsCtrl);

    OutputsCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'OutputsService', 'OutputsLocalStorage'];

    function OutputsCtrl($scope, $rootScope, $state, $timeout, OutputsService, OutputsLocalStorage) {
        $scope.$watch('numPerPage', currentPage);
        $scope.$watch('currentPage', currentPage);
        var vm = this;

        angular.extend(vm, {
            init: init,
            currentPage: currentPage,
            numPages: numPages,
            outputsSort: outputsSort,
            outputsEditForm: outputsEditForm,
            outputsAdd: outputsAdd,
            goToBack: goToBack,
            goToHead: goToHead,
            outputsBack: outputsBack,
			_errorHandler: errorHandler
        });

        $timeout(function () {
            window.scrollTo(0, 0);
        });

        init();

        function init() {
            $scope.currentPage = 1;
            $scope.numPerPage = 10;
            $scope.maxSize = 5;
			vm.outputs = [];
			vm.outputsFilter = [];
			
            vm.title = 'Sales Invoices';
            vm.sort = 'name';
			
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                getOutputsOn();
            } else {
                vm.outputs = [].concat(OutputsLocalStorage.getOutputs());
				$rootScope.myError = false;
				$rootScope.loading = false;
            }
		}
		
        function getOutputsOn() {
            OutputsService.getOutputs()
				.then(function(data){
					$scope.filteredOutputs = [];
					vm.outputs = data.data;
					currentPage();
					$rootScope.myError = false;
					$rootScope.loading = false;
				})
				.catch(errorHandler);
        }

        function currentPage() {
            if (Object.prototype.toString.call(vm.outputs) == '[object Array]') {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage);
                var end = parseInt(begin) + parseInt($scope.numPerPage);
                $scope.filteredOutputs = vm.outputs.slice(begin, end);
                $scope.totalItems = vm.outputs.length;
            }
        }

        function numPages() {
            return Math.ceil(vm.outputs.length / $scope.numPerPage);
        }

        function outputsSort(val) {
            vm.sort = val;
            vm.rev = !vm.rev;
        }

        function outputsEditForm(item) {
            $state.go('main.outputs-edit', {item: item});
        }

        function outputsAdd() {
			$rootScope.loading = true;
            var obj = {
                count: ++vm.outputs.length
            };
            $state.go('main.outputs-add', {item: obj});
        }

        function goToBack() {
            $scope.$broadcast('scrollHere');
        }

        function goToHead() {
            $scope.$broadcast('scrollThere');
        }

        function outputsBack() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main');
            }, 100);
        }
		
		function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();
