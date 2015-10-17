(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$rootScope','$state','UsersService'];

    function LoginCtrl($rootScope, $state, UsersService) {
        var vm = this;
		
        angular.extend(vm, {
			init: init,
            toLogin: toLogin,
			checkUser: checkUser,
			_check: check
        });
		
		init();
			
		function init() {
			$rootScope.loading = false;
            $rootScope.currentUser = undefined;
		}
		
        function toLogin() {
            if (vm.form.$invalid) {
                return;
            }
            checkUser(vm.name, vm.pass);
        }
		
        function checkUser(name, pass) {
			$rootScope.myError = false;
			$rootScope.loading = true;

			UsersService.getUsers()
				.then(function (data) {
					$rootScope.loading = false;
					var users = data.data;
					check(users, name, pass);
				})
				.catch(function (data) {
					$rootScope.loading = false;
					$rootScope.myError = true;
					console.log('catch - ' + data.status);
					console.log(data);
				});
        }
		
		function check(users, name, pass) {
			if (users) {
				for (var i = 0; i < users.length; i++) {
					if (users[i].name == name && users[i].pass == pass) {
                        $rootScope.currentUser = {
                            name: name,
                            pass: pass
                        };
						$state.go('main');
					}
				}
			vm.error = true;
			}	
		}
	
    }
})();
