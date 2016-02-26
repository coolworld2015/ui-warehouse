(function () {
    'use strict';

    angular
        .module('app')
        .controller('GoodsEditCtrl', GoodsEditCtrl);

    GoodsEditCtrl.$inject = ['$state', '$rootScope', '$filter', 'GoodsService', 'GoodsLocalStorage', '$stateParams'];

    function GoodsEditCtrl($state, $rootScope, $filter, GoodsService, GoodsLocalStorage, $stateParams) {
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
				$state.go('main.goods');
            }
        }

        function goodsDialog() {
            var obj = {
                id: vm.id,
                name: vm.name
            };
            $state.go('main.goods-dialog', {item: obj});
        }

        function goodsEditBack() {
            $state.go('main.goods');
        }		
		
		function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();