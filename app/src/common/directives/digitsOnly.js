(function () {
    "use strict";

    angular
        .module('app')
        .directive('digitsOnly', digitsOnly);

    function digitsOnly() {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.on('keydown', onKeyDown);
                scope.onKeyDown = onKeyDown;

                function onKeyDown(event) {
                    var charCode = event.keyCode;
                    if (
                        (charCode > 47 && charCode < 58) || 						// Digits
                        (charCode > 95 && charCode < 105) || 						// Numpad
                        (charCode == 110 || charCode == 190 || charCode == 188) ||  // Dots&Coma
                        (charCode == 8 || charCode == 46) || 						// Backspace&Delete
                        (charCode >= 37 && charCode <= 40) ||  						// Arrows
                        (charCode == 9)  						                    // Tab
                    )
                        return true;
                    else {
                        event.preventDefault();
                    }
                }
            }
        };
    }
})();