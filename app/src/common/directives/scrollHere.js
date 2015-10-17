(function () {
    'use strict';

    angular
        .module('app')
        .directive('scrollHere', scrollHere);

    scrollHere.$inject = ['$timeout'];

    function scrollHere($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                scope.$on('scrollHere', onScrollHere);

                function onScrollHere() {
                    $timeout(scope.scrollHere, 20);
                }

                scope.scrollHere = function () {
                    var grid = element[0];
                    grid.scrollTop = grid.scrollHeight - grid.clientHeight;
                    grid.focus();
                };
            }
        }
    }
})();
