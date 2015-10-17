(function () {
    'use strict';

    angular
        .module('app')
        .factory('IdlyUserLogoutService', IdlyUserLogoutService);

    IdlyUserLogoutService.$inject = ['$timeout', '$state'];

    function IdlyUserLogoutService($timeout, $state) {
        var IDLY_USER_TIMEOUT = 60 * 1000;
        var timeout = 0;

        return {
            startWatch: startWatch
        };

        function startWatch() {
            $timeout.cancel(timeout);
            timeout = $timeout(logout, IDLY_USER_TIMEOUT);
        }

        function logout() {
            $state.go('login');
        }
    }
})();
