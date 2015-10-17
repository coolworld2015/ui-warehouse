(function () {
    'use strict';

    angular
        .module('app')
        .controller('UsersCtrl', UsersCtrl);

    UsersCtrl.$inject = ['$scope', '$rootScope', '$state', 'UsersService'];

    function UsersCtrl($scope, $rootScope, $state, UsersService) {
        $scope.$watch('numPerPage', currentPage);			
        $scope.$watch('currentPage', currentPage);
        var vm = this;

        angular.extend(vm, {
            init: init,
			currentPage: currentPage,			
            numPages: numPages,
            usersSort: usersSort,
            usersEditForm: usersEditForm,
            usersAdd: usersAdd,
            goToBack: goToBack,
			goToHead: goToHead,		
            usersBack: usersBack,
			_errorHandler: errorHandler
        });

        init();

        function init() {
            $scope.currentPage = 1;
            $scope.numPerPage = 10;
            $scope.maxSize = 5;

            vm.title = 'Users';
            vm.sort = 'name';
			
            UsersService.getUsers()
				.then(function(data){
					$scope.filteredUsers = [];
					vm.users = data.data;
					currentPage();
					$rootScope.myError = false;
					$rootScope.loading = false;
				})
				.catch(errorHandler);
        }
		
        function currentPage() {
            if (Object.prototype.toString.call(vm.users) == '[object Array]') {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage);
                var end = parseInt(begin) + parseInt($scope.numPerPage);
                $scope.filteredUsers = vm.users.slice(begin, end);
                vm.totalItems = vm.users.length;
            }
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
		
        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();