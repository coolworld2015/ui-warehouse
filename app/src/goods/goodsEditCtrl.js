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
            _editItem: editItem,
            goodsDialog: goodsDialog,
            goodsEditBack: goodsEditBack,
            _errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);
		
        $timeout(function () {
            window.scrollTo(0, 0);
        });
		
        init();

        function init() {
            if ($stateParams.item.name == undefined) {
                $state.go('main.goods');
            }
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
                        editItem(item);
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

        function editItem(item) {
            var goods = GoodsService.goods;
            for (var i = 0; i < goods.length; i++) {
                if (goods[i].id == item.id) {
                    goods.splice(i, 1, item);
                    break;
                }
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