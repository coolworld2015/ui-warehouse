(function() {
    "use strict";

    angular
        .module('app')
        .directive('enter', enter);

    function enter() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.on('keyup', function() {
                    if (event.which === 13) {
                         scope.$apply(function() {
                            scope.$eval(attrs.enter)();
                        });
                    }
                });
            }
        }
    }
})();
