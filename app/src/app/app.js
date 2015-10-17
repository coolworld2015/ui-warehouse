(function () {
    'use strict';
    
    angular
        .module('app', ['ui.router','ui.bootstrap']);
	
    angular
        .module('app')
        .run(runHandler);
		
	runHandler.$inject = ['$rootScope','$state'];
    function runHandler($rootScope, $state) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            var requireLogin = toState.data.requireLogin;
            if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
                event.preventDefault();
                $state.go('login');
            }
        });
    }

    angular
        .module('app')
        .run(init);

    init.$inject = ['$rootScope'];
    function init($rootScope) {
        $rootScope.myConfig = {
            webUrl: 'http://coolworld2015a1.herokuapp.com/' //TODO change URL
            //webUrl: 'http://localhost:3000/'
        };
    }

})();