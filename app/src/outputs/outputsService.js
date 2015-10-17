(function () {
    'use strict';

    angular
        .module('app')
        .factory('OutputsService', OutputsService);

    OutputsService.$inject = ['$rootScope', '$http', '$q'];

    function OutputsService($rootScope, $http, $q) {
        var webUrl = $rootScope.myConfig.webUrl;

        return {
            addItem: addItem,
            editItem: editItem,
            deleteItem: deleteItem
        };

        function addItem(item) {
            var url = webUrl + 'api/outputs/add';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }

        function editItem(item) {
            var url = webUrl + 'api/outputs/update';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }

        function deleteItem(id) {
            var url = webUrl + 'api/outputs/delete';
            var item = {
                "id": id
            };
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }
    }
})();

