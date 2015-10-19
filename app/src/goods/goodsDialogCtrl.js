(function () {
    'use strict';

    angular
        .module('app')
        .controller('GoodsDialogCtrl', GoodsDialogCtrl);

    GoodsDialogCtrl.$inject = ['$state', '$rootScope', 'GoodsService', 'GoodsLocalStorage', '$stateParams'];

    function GoodsDialogCtrl($state, $rootScope, GoodsService, GoodsLocalStorage, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            goodsDelete: goodsDelete,
            goodsEditBack: goodsEditBack,
			_errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);

        function goodsDelete() {
            $rootScope.loading = true;
            $rootScope.myError = false;
			
			if ($rootScope.mode == 'ON-LINE (Heroku)') {
				GoodsService.deleteItem(vm.id)
					.then(function () {
						$rootScope.myError = false;
						$state.go('main.goods');
					})
					.catch(function (data) {
						$rootScope.loading = false;
						$rootScope.myError = true;
					});
			} else {
                GoodsLocalStorage.deleteItem(vm.id);
				$state.go('main.goods');
            }
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