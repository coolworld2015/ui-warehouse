(function () {
    'use strict';

    angular
        .module('app')
        .controller('ConfigCtrl', ConfigCtrl);

    ConfigCtrl.$inject = ['$scope', '$rootScope', '$state', '$http', 'ClientsLocalStorage', 'GoodsLocalStorage'];

    function ConfigCtrl($scope, $rootScope, $state, $http, ClientsLocalStorage, GoodsLocalStorage) {
        var vm = this;
		
        angular.extend(vm, {
			init: init,
            toggleMode: toggleMode,
            doAction: doAction,
            toMain: toMain
        });
		
		function init() {
			vm.webUrl = $rootScope.myConfig.webUrl;
            vm.mode= $rootScope.mode;
			$rootScope.myError = false;
			$rootScope.loading = false;

			vm.options = [
				{name: 'Select transaction', value:'none'}, 
				{name: 'Get clients (Heroku)', value: 'heroku.clients.get'},
				{name: 'Get goods (Heroku)', value: 'heroku.goods.get'}
			];
			vm.selectedItem = vm.options[0];
		}

        function toggleMode() {
            if (vm.mode == 'OFF-LINE (LocalStorage)') {
                vm.mode = 'ON-LINE (Heroku)';
                $rootScope.mode = 'ON-LINE (Heroku)';
            } else {
                vm.mode = 'OFF-LINE (LocalStorage)';
                $rootScope.mode = 'OFF-LINE (LocalStorage)';
            }
            localStorage.setItem('warehouse_mode', JSON.stringify(vm.mode));
            toMain();
        }

        function doAction() {
            loading();

            switch (vm.selectedItem.value) {
				case 'none':
				{
					error();
                    break;
                }

                case 'heroku.clients.get':
                {
					getClientsHeroku();
                    break;
                }
				
                case 'heroku.goods.get':
                {
					getGoodsHeroku();
                    break;
                }				
            }
        }
		 			
        function getClientsHeroku() {
			var url = vm.webUrl + 'api/clients/get';
            $http.get(url)
                .then(function (results) {
					console.log(results.data);
					ClientsLocalStorage.uploadClients(results.data);
					complete();
                })
                .catch(function (data) {
                    console.log('catch - ' + data.status);
                    console.log(data);
					error();
                });
        }  
		
        function getGoodsHeroku() {
			var url = vm.webUrl + 'api/goods/get';
            $http.get(url)
                .then(function (results) {
					console.log(results.data);
					GoodsLocalStorage.uploadGoods(results.data);
					complete();
                })
                .catch(function (data) {
                    console.log('catch - ' + data.status);
                    console.log(data);
					error();
                });
        } 
		
        function loading() {
            $scope.$broadcast('scrollThere');
            vm.complete = false;
            vm.error = false;
            vm.loading = true;
        }

        function error() {
            vm.complete = false;
			vm.loading = false;
			$rootScope.loading = false;
			$rootScope.myError = true;
        }

        function complete() {
            vm.error = false;
            vm.loading = false;
            vm.complete = true;
        }

        function toMain() {
            $state.go('main');
        }
    }
})();

