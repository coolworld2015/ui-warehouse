(function () {
    'use strict';

    angular
        .module('app')
        .controller('InputsCtrl', InputsCtrl);

    InputsCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'inputs'];

    function InputsCtrl($scope, $rootScope, $state, $timeout, inputs) {
        $scope.$watch('numPerPage', currentPage);
        $scope.$watch('currentPage', currentPage);
        var vm = this;

        angular.extend(vm, {
            init: init,
            currentPage: currentPage,
            numPages: numPages,
            inputsEditForm: inputsEditForm,
            inputsAdd: inputsAdd,
            goToBack: goToBack,
            goToHead: goToHead,
            inputsBack: inputsBack,
            _errorHandler: errorHandler
        });

        $timeout(function () {
            window.scrollTo(0, 0);
        });

        init();

        function init() {
            vm.title = 'Purchase Invoices';
            vm.sort = 'name';
            vm.inputs = [].concat(inputs);
            vm.inputsFilter = [];

            $scope.currentPage = 1;
            $scope.numPerPage = 10;
            $scope.maxSize = 5;

            $rootScope.myError = false;
            $rootScope.loading = false;
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

        function inputsEditForm(item) {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.inputs-edit', {item: item});
            }, 100);
        }

        function inputsAdd() {
            $rootScope.loading = true;
            var obj = {
                count: ++vm.inputs.length
            };
            $timeout(function () {
                $state.go('main.inputs-add', {item: obj});
            }, 100);
        }

        function goToBack() {
            $scope.$broadcast('scrollHere');
        }

        function goToHead() {
            $scope.$broadcast('scrollThere');
        }

        function inputsBack() {
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
