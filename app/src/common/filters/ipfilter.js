(function () {
    "use strict";

        angular
            .module('app')
            .filter('ipfilter', ipfilter);              // ::ffff:10.136.89.162

        function ipfilter() {
            return function (item) {
                var b = item.split(':');
                return b[3];
            };
        }
})();
