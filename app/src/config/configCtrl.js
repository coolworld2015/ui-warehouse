(function () {
    'use strict';

    angular
        .module('app')
        .controller('ConfigCtrl', ConfigCtrl);

    ConfigCtrl.$inject = ['$scope', '$rootScope', '$state', '$http', '$timeout',
        'ClientsLocalStorage', 'GoodsLocalStorage'];

    function ConfigCtrl($scope, $rootScope, $state, $http, $timeout,
                        ClientsLocalStorage, GoodsLocalStorage) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            toggleMode: toggleMode,
            doAction: doAction,
            toMain: toMain
        });

        init();

        function init() {
            vm.webUrl = $rootScope.myConfig.webUrl;
            vm.mode = $rootScope.mode;
            $rootScope.myError = false;
            $rootScope.loading = false;

            vm.options = [
                {name: 'Select transaction', value: 'none'},
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
                    ClientsLocalStorage.uploadClients(results.data);
                    complete();
                })
                .catch(function (data) {
                    error();
                });
        }

        function getGoodsHeroku() {
            var url = vm.webUrl + 'api/goods/get';
            $http.get(url)
                .then(function (results) {
                    GoodsLocalStorage.uploadGoods(results.data);
                    complete();
                })
                .catch(function (data) {
                    error();
                });
        }

        function loading() {
            $rootScope.loading = true;
            $rootScope.myError = false;
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
            $rootScope.loading = false;
            vm.error = false;
            vm.loading = false;
            vm.complete = true;
        }

        function toMain() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main');
            }, 100);
        }
    }
})();

