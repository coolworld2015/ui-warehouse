(function () {
	'use strict';
	
    angular
        .module('app')
        .factory('ClientsService', ClientsService);
		
    ClientsService.$inject = ['$rootScope', '$http'];
	
    function ClientsService($rootScope, $http) {
        var webUrl = $rootScope.myConfig.webUrl;
		
        return {
            clients: [],
			getClients: getClients,
            addItem: addItem,
            editItem: editItem,
            deleteItem: deleteItem,
			findClient: findClient,
			_sort: sort
        };
		
        function getClients() {
            var url = webUrl + 'api/clients/get';
            return $http.get(url)
                .then(function (result) {
                    result.data.sort(sort);
                    return result;
                });
        }
		
        function addItem(item) {
            var url = webUrl + 'api/clients/add';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                });
        }
		
        function editItem(item) {
            var url = webUrl + 'api/clients/update';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                });
        }

        function deleteItem(id) {
            var url = webUrl + 'api/clients/delete';
            var item = {
                "id": id
            };
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                });
        }

		function findClient(id) {
            var url = webUrl + 'api/clients/find';
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
