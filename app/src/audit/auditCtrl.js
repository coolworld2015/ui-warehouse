(function () {
    'use strict';

    angular
        .module('app')
        .controller('AuditCtrl', AuditCtrl);

    AuditCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'audit'];

    function AuditCtrl($scope, $rootScope, $state, $timeout, audit) {
        $scope.$watch('numPerPage', currentPage);
        $scope.$watch('currentPage', currentPage);
        var vm = this;

        angular.extend(vm, {
            init: init,
            currentPage: currentPage,
            auditEditForm: auditEditForm,
            auditAdd: auditAdd,
            goToBack: goToBack,
            goToHead: goToHead,
            auditBack: auditBack,
            _errorHandler: errorHandler
        });

        $timeout(function () {
            window.scrollTo(0, 0);
        });

        init();

        function init() {
            vm.title = 'Audit';
            vm.audit = audit;
            vm.auditFilter = [];

            $scope.currentPage = 1;
            $scope.numPerPage = 10;
            $scope.maxSize = 5;

            $rootScope.myError = false;
            $rootScope.loading = false;
        }

        function currentPage() {
            if (Object.prototype.toString.call(vm.audit) == '[object Array]') {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage);
                var end = parseInt(begin) + parseInt($scope.numPerPage);
                $scope.filteredAudit = vm.audit.slice(begin, end);
                $scope.totalItems = vm.audit.length;
            }
        }

        function auditEditForm(item) {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('audit-edit', {item: item});
            }, 100);
        }

        function auditAdd() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('audit-add');
            }, 100);
        }

        function goToBack() {
            $scope.$broadcast('scrollHere');
        }

        function goToHead() {
            $scope.$broadcast('scrollThere');
        }

        function auditBack() {
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