(function () {
	'use strict';

	angular
		.module('app')
		.controller('MainCtrl', MainCtrl);

	MainCtrl.$inject = ['$state', '$rootScope', '$timeout'];

	function MainCtrl($state, $rootScope, $timeout) {
		var vm = this;

		angular.extend(vm, {
			init: init,
			go: go
		});

		$timeout(function () {
			window.scrollTo(0, 0);
		});

		init();

		function init() {
			$rootScope.myError = false;
			$rootScope.loading = false;
			$timeout(function () {
				$rootScope.message = false;
			}, 1000);
		}

		function go(state) {
			$rootScope.loading = true;
			$timeout(function () {
				$state.go(state);
			}, 100);
		}
	}

})();