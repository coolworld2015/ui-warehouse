(function () {
    'use strict';

    angular
        .module('app')
        .controller('GoodsDialogCtrl', GoodsDialogCtrl);

    GoodsDialogCtrl.$inject = ['$state', '$rootScope', 'GoodsService', '$stateParams'];

    function GoodsDialogCtrl($state, $rootScope, GoodsService, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            goodsDelete: goodsDelete,
            goodsEditBack: goodsEditBack
        });

        angular.extend(vm, $stateParams.item);

        function goodsDelete() {
            $rootScope.loading = true;
            $rootScope.myError = false;

            GoodsService.deleteItem(vm.id)
                .then(function () {
                    $rootScope.myError = false;
                    $state.go('main.goods');
                })
                .catch(function (data) {
                    $rootScope.loading = false;
                    $rootScope.myError = true;
                });
        }

        function goodsEditBack() {
            $state.go('main.goods');
        }
    }
})();