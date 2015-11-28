(function () {
    'use strict';

    angular
        .module('app')
        .controller('StoreCtrl', StoreCtrl);

    StoreCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'GoodsService', 'GoodsLocalStorage'];

    function StoreCtrl($scope, $rootScope, $state, $timeout, GoodsService, GoodsLocalStorage) {
        $scope.$watch('numPerPage', currentPage);
        $scope.$watch('currentPage', currentPage);
        var vm = this;

        angular.extend(vm, {
            init: init,
            currentPage: currentPage,
            numPages: numPages,
            storeSort: storeSort,
            storeEditForm: storeEditForm,
            goToBack: goToBack,
			goToHead: goToHead,			
            storeBack: storeBack,
			_errorHandler: errorHandler	
        });

        $timeout(function () {
            $scope.$broadcast('_scrollHere');
        });

        function init() {
            vm.title = 'Store';
            vm.sort = 'name';
			
            $scope.currentPage = 1;
            $scope.numPerPage = 10;
            $scope.maxSize = 5;
			
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                getGoodsOn();
            } else {
                vm.goods = GoodsLocalStorage.getGoods();
				vm.store = initStore(vm.goods);
				$rootScope.myError = false;
				$rootScope.loading = false;
            }
		}
		
        function getGoodsOn() {			
            GoodsService.getGoods()
				.then(function(data){
					$scope.filteredClients = [];
					vm.store = initStore(data.data);
					currentPage();
					$rootScope.myError = false;
					$rootScope.loading = false;
				})
				.catch(errorHandler);
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
            $state.go('main');
        }
		
		function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();