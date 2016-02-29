(function () {
    'use strict';

    angular
        .module('app')
        .controller('GoodsEditCtrl', GoodsEditCtrl);

    GoodsEditCtrl.$inject = ['$state', '$rootScope', '$filter', '$timeout', 'GoodsService', 'GoodsLocalStorage', '$stateParams'];

    function GoodsEditCtrl($state, $rootScope, $filter, $timeout, GoodsService, GoodsLocalStorage, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            goodsSubmit: goodsSubmit,
            goodsDialog: goodsDialog,
            goodsEditBack: goodsEditBack,
            _errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);

        init();

        function init() {
            vm.total = $filter('number')(vm.sum, 2);
            $rootScope.loading = false;
        }

        function goodsSubmit() {
            var item = {
                id: vm.id,
                name: vm.name,
                price: vm.price,
                quantity: 0,
                store: vm.store,
                description: vm.description
            };

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                GoodsService.editItem(item)
                    .then(function () {
                        $rootScope.myError = false;
                        $state.go('main.goods');
                    })
                    .catch(errorHandler);
            } else {
                GoodsLocalStorage.editItem(item);
                $rootScope.loading = true;
                $timeout(function () {
                    $state.go('main.goods');
                }, 100);
            }
        }

        function goodsDialog() {
            var obj = {
                id: vm.id,
                name: vm.name
            };
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.goods-dialog', {item: obj});
            }, 100);
        }

        function goodsEditBack() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main.goods');
            }, 100);
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();