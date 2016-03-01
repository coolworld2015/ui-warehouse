(function () {
    'use strict';

    angular
        .module('app')
        .controller('OutputsCtrl', OutputsCtrl);

    OutputsCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'outputs'];

    function OutputsCtrl($scope, $rootScope, $state, $timeout, outputs) {
        $scope.$watch('numPerPage', currentPage);
        $scope.$watch('currentPage', currentPage);
        var vm = this;

        angular.extend(vm, {
            init: init,
            currentPage: currentPage,
            numPages: numPages,
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
            vm.title = 'Sales Invoices';
            vm.sort = 'name';
			vm.outputs = [].concat(outputs);
			vm.outputsFilter = [];

            $scope.currentPage = 1;
            $scope.numPerPage = 10;
            $scope.maxSize = 5;

            $rootScope.myError = false;
            $rootScope.loading = false;
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

        function outputsEditForm(item) {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.outputs-edit', {item: item});
            }, 100);
        }

        function outputsAdd() {
			$rootScope.loading = true;
            var obj = {
                count: ++vm.outputs.length
            };
            $timeout(function () {
                $state.go('main.outputs-add', {item: obj});
            }, 100);
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
