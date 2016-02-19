(function () {
    'use strict';

    angular
        .module('app')
        .controller('StoreCtrl', StoreCtrl);

    StoreCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'goods'];

    function StoreCtrl($scope, $rootScope, $state, $timeout, goods) {
        $scope.$watch('numPerPage', currentPage);
        $scope.$watch('currentPage', currentPage);
        var vm = this;

        angular.extend(vm, {
            init: init,
            _initStore: initStore,
            _currentPage: currentPage,
            numPages: numPages,
            storeSort: storeSort,
            storeEditForm: storeEditForm,
            goToBack: goToBack,
			goToHead: goToHead,			
            storeBack: storeBack,
			_errorHandler: errorHandler	
        });

        $timeout(function () {
            window.scrollTo(0, 0);
        });

        init();

        function init() {
            vm.title = 'Store';
            vm.sort = 'name';
			vm.store = initStore(goods);
			vm.goodsFilter = [];
			
            $scope.currentPage = 1;
            $scope.numPerPage = 10;
            $scope.maxSize = 5;

            $rootScope.myError = false;
            $rootScope.loading = false;
		}

		function initStore(goods) {	
			var store = [];
			goods.filter(function (item) {
                if (item.store === true) {
				//if (item.description == '1') {
                    store.push(item);
                }
            });
			return store;
		}

        function currentPage() {
            if (Object.prototype.toString.call(vm.store) == '[object Array]') {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage);
                var end = parseInt(begin) + parseInt($scope.numPerPage);
                $scope.filteredGoods = vm.store.slice(begin, end);
                $scope.totalItems = vm.store.length;
            }
        }

        function numPages() {
            return Math.ceil(vm.store.length / $scope.numPerPage);
        }

        function storeSort(val) {
            vm.sort = val;
            vm.rev = !vm.rev;
        }

        function storeEditForm(item) {
            $state.go('main.store-edit', {item: item});
        }

        function goToBack() {
            $scope.$broadcast('scrollHere');
        }

		function goToHead() {
            $scope.$broadcast('scrollThere');
        }		
		
        function storeBack() {
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