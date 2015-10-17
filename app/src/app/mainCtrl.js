(function () {
    'use strict';

    angular
        .module('app')
        .controller('MainCtrl', MainCtrl);
		
		MainCtrl.$inject = ['$rootScope', '$state'];		
		
		function MainCtrl($rootScope, $state) {
			var vm = this;
			
			angular.extend(vm, {
				init: init,
				go: go
			});
			
			init();
			
			function init() {
				$rootScope.loading = false;
			}
			
			function go() {
				$rootScope.loading = true;
			}
        }
		
})();