(function () {
    'use strict';

    angular
        .module('app')
        .controller('OutputsDialogCtrl', OutputsDialogCtrl);

    OutputsDialogCtrl.$inject = ['$state', '$q', '$rootScope', 'OutputsService', 'invoice', 'GoodsService', 'ClientsService', '$stateParams'];

    function OutputsDialogCtrl($state, $q, $rootScope, OutputsService, invoice, GoodsService, ClientsService, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            outputsDelete: outputsDelete,
            _fillRequests: fillRequests,
            _modifyGoods: modifyGoods,
            _findGood: findGood,
            _editGood: editGood,
            outputsEditBack: outputsEditBack,
			_errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);
		
        init();

        function init() {
            vm.webUrl = $rootScope.myConfig.webUrl;
            vm.outputInvoice = invoice;
            vm.requests = [];
            vm.index = [];
            vm.i = 0;
        }
		
        function outputsDelete() {
            $rootScope.loading = true;
            $rootScope.myError = false;

            fillRequests();

            $q.serial(vm.requests)
                .catch(errorHandler);

            ClientsService.findClient($stateParams.item.clientID)
                .then(function (client) {
                    client.data.sum = parseFloat(client.data.sum) + parseFloat($stateParams.item.total);

                    ClientsService.editItem(client.data)
                        .then(function () {
                        })
                        .catch(errorHandler);
                })
                .catch(errorHandler);

            OutputsService.deleteItem(vm.id)
                .then(function () {
                    $rootScope.myError = false;
                    $state.go('main.outputs');
                })
                .catch(errorHandler);
        }
		
        function fillRequests() {
            vm.outputInvoice.forEach(function (el) {
                if (el.invoiceID == $stateParams.item.id) {
                    vm.index.push(el);
                    vm.requests.push(modifyGoods);
                }
            })
        }

        function modifyGoods() {
            return findGood()
                .then(editGood)
                .catch(errorHandler)
        }

        function findGood() {
            return GoodsService.findGood(vm.index[vm.i].goodsID)
                .then(function (good) {
                    var quantity = parseFloat(good.data.quantity) + parseFloat(vm.index[vm.i].quantity);
                    vm.item = {
                        id: good.data.id,
                        name: good.data.name,
                        price: good.data.price,
                        quantity: quantity,
                        store: good.data.store,
                        description: good.data.description
                    };
                });
        }

        function editGood() {
            return GoodsService.editItem(vm.item)
                .then(function () {
                    vm.i++;
                })
                .catch(errorHandler);
        }
		
        function outputsEditBack() {
            $state.go('main.outputs');
        }
		
        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }		
    }
})();