(function () {
    'use strict';

    angular
        .module('app')
        .controller('GoodsAddCtrl', GoodsAddCtrl);

    GoodsAddCtrl.$inject = ['$state', '$rootScope', 'GoodsService'];

    function GoodsAddCtrl($state, $rootScope, GoodsService) {
        var vm = this;

        angular.extend(vm, {
            goodsAddSubmit: goodsAddSubmit,
            goodsAddBack: goodsAddBack
        });

        function goodsAddSubmit() {
            if (vm.form.$invalid) {
                return;
            }

            $rootScope.myError = false;
            $rootScope.loading = true;

            var id = (Math.random() * 1000000).toFixed();
            var item = {
                id: id,
                name: vm.name,
                price: vm.price,
				quantity: 0,			
				store: false,				
                description: vm.description
            };

            GoodsService.addItem(item)
                .then(function () {
                    $rootScope.myError = false;
                    $state.go('main.goods');
                })
                .catch(function (data) {
                    $rootScope.loading = false;
                    $rootScope.myError = true;
                });
        }

        function goodsAddBack() {
            $state.go('main.goods');
        }
    }
})();