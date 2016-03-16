(function () {
    'use strict';

    angular
        .module('app')
        .controller('GoodsAddCtrl', GoodsAddCtrl);

    GoodsAddCtrl.$inject = ['$state', '$rootScope', '$timeout', 'GoodsService', 'GoodsLocalStorage'];

    function GoodsAddCtrl($state, $rootScope, $timeout, GoodsService, GoodsLocalStorage) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            goodsAddSubmit: goodsAddSubmit,
            _addItem: addItem,
            goodsAddBack: goodsAddBack,
			_errorHandler: errorHandler
        });
		
        $timeout(function () {
            window.scrollTo(0, 0);
        });
		
        init();

        function init() {
            $rootScope.loading = false;
        }

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
                        addItem(item);
						$rootScope.myError = false;
						$state.go('main.goods');
					})
					.catch(errorHandler);
			} else {
                GoodsLocalStorage.addItem(item);
                $rootScope.loading = true;
                $timeout(function () {
                    $state.go('main.goods');
                }, 100);
            }
        }

        function addItem(item) {
            GoodsService.goods.push(item);
        }

        function goodsAddBack() {
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