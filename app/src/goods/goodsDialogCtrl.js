(function () {
    'use strict';

    angular
        .module('app')
        .controller('GoodsDialogCtrl', GoodsDialogCtrl);

    GoodsDialogCtrl.$inject = ['$state', '$rootScope', '$timeout', 'GoodsService', 'GoodsLocalStorage', '$stateParams'];

    function GoodsDialogCtrl($state, $rootScope, $timeout, GoodsService, GoodsLocalStorage, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            goodsDelete: goodsDelete,
            goodsEditBack: goodsEditBack,
			_errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);

        init();

        function init() {
            $rootScope.loading = false;
        }

        function goodsDelete() {
            $rootScope.loading = true;
            $rootScope.myError = false;
			
			if ($rootScope.mode == 'ON-LINE (Heroku)') {
				GoodsService.deleteItem(vm.id)
					.then(function () {
						$rootScope.myError = false;
						$state.go('main.goods');
					})
					.catch(errorHandler);
			} else {
                GoodsLocalStorage.deleteItem(vm.id);
                $rootScope.loading = true;
                $timeout(function () {
                    $state.go('main.goods');
                }, 100);
            }
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