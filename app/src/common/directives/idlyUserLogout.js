(function() {
    "use strict";

    angular
        .module('app')
        .directive('idlyUserLogout', idlyUserLogout);

    idlyUserLogout.$inject = ['IdlyUserLogoutService'];

    function idlyUserLogout(IdlyUserLogoutService) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                IdlyUserLogoutService.startWatch();

                element.bind('click', onClick);

                function onClick() {
                    IdlyUserLogoutService.startWatch();
                }
            }
        }
    }
})();