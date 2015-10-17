(function () {
    'use strict';

    angular
        .module('app')
        .factory('InputsService', InputsService);

    InputsService.$inject = ['$rootScope', '$http', '$q'];

    function InputsService($rootScope, $http, $q) {
        var webUrl = $rootScope.myConfig.webUrl;

        return {
            addItem: addItem,
            editItem: editItem,
            deleteItem: deleteItem
        };

        function addItem(item) {
            var url = webUrl + 'api/inputs/add';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                });
        }

        function editItem(item) {
            var url = webUrl + 'api/inputs/update';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                });
        }

        function deleteItem(id) {
            var url = webUrl + 'api/inputs/delete';
            var item = {
                "id": id
            };
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                });
        }
    }
})();

