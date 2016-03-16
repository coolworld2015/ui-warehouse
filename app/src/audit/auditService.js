(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuditService', AuditService);
		
	AuditService.$inject = ['$rootScope', '$http'];
	
    function AuditService($rootScope, $http) {
		var webUrl = $rootScope.myConfig.webUrl;
		
        return {
			getAudit: getAudit,
            addItem: addItem
        };
		
        function getAudit() {
            var url = webUrl + 'api/audit/get';
            return $http.get(url)
                .then(function (result) {
                    return result;
                });
        }

         function addItem(item) {
            var url = webUrl + 'api/audit/add';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                });
        }
    }
})();