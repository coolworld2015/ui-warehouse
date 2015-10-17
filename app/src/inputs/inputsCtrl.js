(function () {
    'use strict';

    angular
        .module('app')
        .controller('InputsCtrl', InputsCtrl);

    InputsCtrl.$inject = ['$scope', '$state', '$timeout', 'inputs'];

    function InputsCtrl($scope, $state, $timeout, inputs) {
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
            inputsBack: inputsBack
        });

        init();

        $timeout(function () {
            $scope.$broadcast('_scrollHere');
        });

        function init() {
            $scope.currentPage = 1;
            $scope.numPerPage = 10;//InputsService.numPerPage;
            $scope.maxSize = 5;

            vm.title = 'Purchase Invoices';
            vm.sort = 'name';
            vm.inputs = inputs;
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
            var obj = {
                count: ++inputs.length
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
    }
})();
