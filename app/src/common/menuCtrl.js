(function () {
    'use strict';

    angular
        .module('app')
        .controller('MenuCtrl', MenuCtrl);
		
		MenuCtrl.$inject = ['$state'];		
		
		function MenuCtrl($state) {
			var vm = this;
			
            vm.isActive = function (param) {
                return ($state.current.name == param);
            };
        }
		
})();