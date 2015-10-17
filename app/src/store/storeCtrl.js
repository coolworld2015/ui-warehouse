(function () {
    'use strict';

    angular
        .module('app')
        .controller('StoreCtrl', StoreCtrl);

    StoreCtrl.$inject = ['$scope', '$state', '$timeout', 'goods'];

    function StoreCtrl($scope, $state, $timeout, goods) {
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
            storeBack: storeBack
        });

        init();

        $timeout(function () {
            $scope.$broadcast('_scrollHere');
        });

        function init() {
            $scope.currentPage = 1;
            $scope.numPerPage = 10;//GoodsService.numPerPage;
            $scope.maxSize = 5;

            vm.title = 'Store';
            vm.sort = 'name';
            vm.store = initStore(goods);
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
    }
})();