(function () {
    'use strict';

    angular
        .module('app')
        .controller('GoodsCtrl', GoodsCtrl);

    GoodsCtrl.$inject = ['$scope', '$state', '$timeout', 'goods'];

    function GoodsCtrl($scope, $state, $timeout, goods) {
        $scope.$watch('numPerPage', numPerPageWatcher);			
        $scope.$watch('currentPage', currentPageWatcher);
        var vm = this;

        angular.extend(vm, {
            init: init,
			numPerPageWatcher: numPerPageWatcher,			
            currentPageWatcher: currentPageWatcher,
            numPages: numPages,
            goodsSort: goodsSort,
            goodsEditForm: goodsEditForm,
            goodsAdd: goodsAdd,
            goToBack: goToBack,
			goToHead: goToHead,			
            goodsBack: goodsBack
        });

        init();

        $timeout(function () {
            $scope.$broadcast('_scrollHere');
        });

        function init() {
            $scope.currentPage = 1;
            $scope.numPerPage = 10;//GoodsService.numPerPage;
            $scope.maxSize = 5;

            vm.title = 'Commodities';
            vm.sort = 'name';
            vm.goods = goods;
        }
		
        function numPerPageWatcher() {
            var begin = (($scope.currentPage - 1) * $scope.numPerPage);
            var end = parseInt(begin) + parseInt($scope.numPerPage);
            $scope.filteredGoods = vm.goods.slice(begin, end);
            $scope.totalItems = vm.goods.length;
			//GoodsService.numPerPage = $scope.numPerPage;
        }
		
        function currentPageWatcher() {
            var begin = (($scope.currentPage - 1) * $scope.numPerPage);
            var end = parseInt(begin) + parseInt($scope.numPerPage);
            $scope.filteredGoods = vm.goods.slice(begin, end);
            $scope.totalItems = vm.goods.length;
        }

        function numPages() {
            return Math.ceil(vm.goods.length / $scope.numPerPage);
        }

        function goodsSort(val) {
            vm.sort = val;
            vm.rev = !vm.rev;
        }

        function goodsEditForm(item) {
            $state.go('main.goods-edit', {item: item});
        }

        function goodsAdd() {
            var obj = {
                name: '',
                price: '',
                description: ''
            };
            $state.go('main.goods-add', {item: obj});
        }

        function goToBack() {
            $scope.$broadcast('scrollHere');
        }

		function goToHead() {
            $scope.$broadcast('scrollThere');
        }		
		
        function goodsBack() {
            $state.go('main');
        }
    }
})();