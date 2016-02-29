(function () {
    'use strict';

    angular
        .module('app')
        .controller('GoodsCtrl', GoodsCtrl);

    GoodsCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'goods'];

    function GoodsCtrl($scope, $rootScope, $state, $timeout, goods) {
        $scope.$watch('numPerPage', currentPage);
        $scope.$watch('currentPage', currentPage);
        var vm = this;

        angular.extend(vm, {
            init: init,
            currentPage: currentPage,
            numPages: numPages,
            goodsEditForm: goodsEditForm,
            goodsAdd: goodsAdd,
            goToBack: goToBack,
            goToHead: goToHead,
            goodsBack: goodsBack,
            _errorHandler: errorHandler
        });

        $timeout(function () {
            window.scrollTo(0, 0);
        });

        init();

        function init() {
            vm.title = 'Commodities';
            vm.sort = 'name';
            vm.goods = goods;
            vm.goodsFilter = [];

            $scope.currentPage = 1;
            $scope.numPerPage = 10;
            $scope.maxSize = 5;

            $rootScope.myError = false;
            $rootScope.loading = false;
        }

        function currentPage() {
            if (Object.prototype.toString.call(vm.goods) == '[object Array]') {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage);
                var end = parseInt(begin) + parseInt($scope.numPerPage);
                $scope.filteredGoods = vm.goods.slice(begin, end);
                $scope.totalItems = vm.goods.length;
            }
        }

        function numPages() {
            return Math.ceil(vm.goods.length / $scope.numPerPage);
        }

        function goodsEditForm(item) {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.goods-edit', {item: item});
            }, 100);
        }

        function goodsAdd() {
            var obj = {
                name: '',
                price: '',
                description: ''
            };
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.goods-add', {item: obj});
            }, 100);
        }

        function goToBack() {
            $scope.$broadcast('scrollHere');
        }

        function goToHead() {
            $scope.$broadcast('scrollThere');
        }

        function goodsBack() {
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