(function () {
	'use strict';
	
    angular
        .module('app')
        .factory('GoodsService', GoodsService);
		
	GoodsService.$inject = ['$rootScope', '$http', '$q'];
	
    function GoodsService($rootScope, $http, $q) {
		var webUrl = $rootScope.myConfig.webUrl;
		
        return {
            goods: [],
			getGoods: getGoods,
            addItem: addItem,
            editItem: editItem,
            deleteItem: deleteItem,
            findGood: findGood,
			_sort: sort
        };
		
        function getGoods() {
            var url = webUrl + 'api/goods/get';
            return $http.get(url)
                .then(function (result) {
                    result.data.sort(sort);
                    return result;
                });
        }
		
        function addItem(item) {
            var url = webUrl + 'api/goods/add';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                });
        }
		
        function editItem(item) {
            var url = webUrl + 'api/goods/update';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                });
        }

        function deleteItem(id) {
            var url = webUrl + 'api/goods/delete';
            var item = {
                "id": id
            };
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                });
        }

        function findGood(id) {
            var url = webUrl + 'api/goods/find';
            var item = {
                "id": id
            };
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                });
        }
		
        function sort(a, b) {
            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
            if (nameA < nameB) {
                return -1
            }
            if (nameA > nameB) {
                return 1
            }
            return 0;
        }
	}
})();