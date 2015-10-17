(function () {
    'use strict';

    angular
        .module('app')
        .controller('OutputsCtrl', OutputsCtrl);

    OutputsCtrl.$inject = ['$scope', '$state', '$timeout', 'outputs'];

    function OutputsCtrl($scope, $state, $timeout, outputs) {
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
            outputsBack: outputsBack
        });

        init();

        $timeout(function () {
            $scope.$broadcast('_scrollHere');
        });

        function init() {
            $scope.currentPage = 1;
            $scope.numPerPage = 10;//OutputsService.numPerPage;
            $scope.maxSize = 5;

            vm.title = 'Sales Invoices';
            vm.sort = 'name';
            vm.outputs = outputs;
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
            var obj = {
                count: ++outputs.length
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
            $state.go('main');
        }
    }
})();
