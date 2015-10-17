(function () {
    'use strict';

    angular
        .module('app')
        .directive('scrollThere', scrollThere);

    scrollThere.$inject = ['$timeout'];

    function scrollThere($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                scope.$on('scrollThere', onScrollThere);

                function onScrollThere() {
                    $timeout(scope.scrollThere, 20);
                }

                scope.scrollThere = function () {
                    var grid = element[0];
                    grid.scrollTop = grid.scrollHeight - grid.clientHeight;
                    grid.focus();
                };
            }
        }
    }
})();