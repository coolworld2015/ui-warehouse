(function () {
    'use strict';

    angular
        .module('app')
        .controller('ClientsCtrl', ClientsCtrl);

    ClientsCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'clients'];

    function ClientsCtrl($scope, $rootScope, $state, $timeout, clients) {
        $scope.$watch('numPerPage', currentPage);
        $scope.$watch('currentPage', currentPage);
        var vm = this;

        angular.extend(vm, {
            init: init,
            currentPage: currentPage,
            numPages: numPages,
            clientsEditForm: clientsEditForm,
            clientsAdd: clientsAdd,
            goToBack: goToBack,
            goToHead: goToHead,
            clientsBack: clientsBack,
            _errorHandler: errorHandler
        });

        $timeout(function () {
            window.scrollTo(0, 0);
        });

        init();

        function init() {
            vm.title = 'Customers';
            vm.sort = 'name';
            vm.clients = clients;
            vm.clientsFilter = [];

            $scope.currentPage = 1;
            $scope.numPerPage = 10;
            $scope.maxSize = 5;

            $rootScope.myError = false;
            $rootScope.loading = false;
        }

        function currentPage() {
            if (Object.prototype.toString.call(vm.clients) == '[object Array]') {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage);
                var end = parseInt(begin) + parseInt($scope.numPerPage);
                $scope.filteredClients = vm.clients.slice(begin, end);
                $scope.totalItems = vm.clients.length;
            }
        }

        function numPages() {
            return Math.ceil(vm.clients.length / $scope.numPerPage);
        }

        function clientsEditForm(item) {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.clients-edit', {item: item});
            }, 100);
        }

        function clientsAdd() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.clients-add');
            }, 100);
        }

        function goToBack() {
            $scope.$broadcast('scrollHere');
        }

        function goToHead() {
            $scope.$broadcast('scrollThere');
        }

        function clientsBack() {
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