(function () {
    'use strict';

    angular
        .module('app')
        .controller('ConfigCtrl', ConfigCtrl);

    ConfigCtrl.$inject = ['$scope', '$rootScope', '$state', '$http', 'ClientsService', 'GoodsService'];

    function ConfigCtrl($scope, $rootScope, $state, $http, ClientsService, GoodsService) {
        var vm = this;
        angular.extend(vm, {
			init: init,
            toggleMode: toggleMode,
            doAction: doAction,
            toMain: toMain
        });
		
		init();
 
		function init() {
            vm.mode= $rootScope.mode;
            vm.error= false;
            vm.complete= false;

			vm.options = [
				{name: 'Select transaction', value:'none'}, 
				//{name: 'Get clients (ASP)', value: 'asp.clients'},
				//{name: 'Get commodities (ASP)', value: 'asp.goods'},
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
				
                case 'asp.clients':
                {
					getClientsAsp();
                    break;
                }	
				
                case 'asp.goods':
                {
                    getgoodsAsp();
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
		
		function getClientsAsp(result) {
            var url = 'http://localhost/base/json_clients.asp';
            $http.get(url)
                .then(function (results) {
					console.log(results.data.dataSet);
					ClientsService.uploadClients(results.data.dataSet);
					complete();
                })
                .catch(function (data) {
                    console.log('catch - ' + data.status);
                    console.log(data);
					error();
                });
        }
		
        function getgoodsAsp(result) {
			var url = 'http://localhost/base/json_goods.asp';
            $http.get(url)
                .then(function (results) {
					console.log(results.data.dataSet);
					GoodsService.uploadGoods(results.data.dataSet);
					complete();
                })
                .catch(function (data) {
                    console.log('catch - ' + data.status);
                    console.log(data);
					error();
                });	
        }
		
        function getClientsHeroku() {
			var url = 'http://coolworld.herokuapp.com/api/clients/get';
            $http.get(url)
                .then(function (results) {
					console.log(results.data);
					ClientsService.uploadClients(results.data);
					complete();
                })
                .catch(function (data) {
                    console.log('catch - ' + data.status);
                    console.log(data);
					error();
                });
        }  
		
        function getGoodsHeroku() {
			var url = 'http://coolworld.herokuapp.com/api/goods/get';
            $http.get(url)
                .then(function (results) {
					console.log(results.data);
					GoodsService.uploadGoods(results.data);
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
            vm.error = true;
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

