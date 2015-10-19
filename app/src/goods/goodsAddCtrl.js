(function () {
    'use strict';

    angular
        .module('app')
        .controller('GoodsAddCtrl', GoodsAddCtrl);

    GoodsAddCtrl.$inject = ['$state', '$rootScope', 'GoodsService', 'GoodsLocalStorage'];

    function GoodsAddCtrl($state, $rootScope, GoodsService, GoodsLocalStorage) {
        var vm = this;

        angular.extend(vm, {
            goodsAddSubmit: goodsAddSubmit,
            goodsAddBack: goodsAddBack,
			_errorHandler: errorHandler
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
			
			if ($rootScope.mode == 'ON-LINE (Heroku)') {
				GoodsService.addItem(item)
					.then(function () {
						$rootScope.myError = false;
						$state.go('main.goods');
					})
					.catch(function (data) {
						$rootScope.loading = false;
						$rootScope.myError = true;
					});
			} else {
                GoodsLocalStorage.addItem(item);
				$state.go('main.goods');
            }
        }

        function goodsAddBack() {
            $state.go('main.goods');
        }		
		
		function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();