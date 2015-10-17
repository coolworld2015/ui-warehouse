(function () {
    'use strict';

    angular
        .module('app')
        .controller('UsersCtrl', UsersCtrl);

    UsersCtrl.$inject = ['$scope', '$state', 'users'];

    function UsersCtrl($scope, $state, users) {
        $scope.$watch('numPerPage', numPerPageWatcher);			
        $scope.$watch('currentPage', currentPageWatcher);
        var vm = this;

        angular.extend(vm, {
            init: init,
			numPerPageWatcher: numPerPageWatcher,			
            currentPageWatcher: currentPageWatcher,
            numPages: numPages,
            usersSort: usersSort,
            usersEditForm: usersEditForm,
            usersAdd: usersAdd,
            goToBack: goToBack,
			goToHead: goToHead,			
            usersBack: usersBack
        });

        init();

        function init() {
            $scope.currentPage = 1;
            $scope.numPerPage = 10;//UsersService.numPerPage;
            $scope.maxSize = 5;

            vm.title = 'Users';
            vm.sort = 'name';
            vm.users = users;
        }
		
        function numPerPageWatcher() {
            var begin = (($scope.currentPage - 1) * $scope.numPerPage);
            var end = parseInt(begin) + parseInt($scope.numPerPage);
            $scope.filteredUsers = vm.users.slice(begin, end);
            $scope.totalItems = vm.users.length;
			//UsersService.numPerPage = $scope.numPerPage;
        }
		
        function currentPageWatcher() {
            var begin = (($scope.currentPage - 1) * $scope.numPerPage);
            var end = parseInt(begin) + parseInt($scope.numPerPage);
            $scope.filteredUsers = vm.users.slice(begin, end);
            $scope.totalItems = vm.users.length;
        }

        function numPages() {
            return Math.ceil(vm.clients.length / $scope.numPerPage);
        }

        function usersSort(val) {
            vm.sort = val;
            vm.rev = !vm.rev;
        }

        function usersEditForm(item) {
            $state.go('main.users-edit', {item: item});
        }

        function usersAdd() {
            var obj = {
                name: '',
                pass: '',
                role: ''
            };
            $state.go('main.users-add', {item: obj});
        }

        function goToBack() {
            $scope.$broadcast('scrollHere');
        }
		
		function goToHead() {
            $scope.$broadcast('scrollThere');
        }	
		
        function usersBack() {
            $state.go('main');
        }
    }
})();