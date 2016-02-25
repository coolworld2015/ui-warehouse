(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$rootScope', '$state', '$timeout', 'UsersService', 'UsersLocalStorage'];

    function LoginCtrl($rootScope, $state, $timeout, UsersService, UsersLocalStorage) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            toLogin: toLogin,
            checkUser: checkUser,
            _check: check,
            _errorHandler: errorHandler
        });

        init();

        function init() {
            $rootScope.currentUser = undefined;
            $rootScope.loading = false;
            $rootScope.myError = false;
            $timeout(function () {
                $rootScope.message = false;
            }, 1000);
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

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                getUsersOn(name, pass);
            } else {
                vm.users = UsersLocalStorage.getUsers();
                check(vm.users, name, pass);
                $rootScope.myError = false;
                $rootScope.loading = false;
            }
        }

        function getUsersOn(name, pass) {
            vm.error = false;
            UsersService.findByName(name)
                .then(function (data) {
                    $rootScope.loading = false;
                    var user = data.data;

                    if (user && (user.name == name && user.pass == pass)) {
                        $rootScope.currentUser = {
                            name: name,
                            pass: pass
                        };
                        $state.go('main');
                    } else {
                        vm.error = true;
                    }
                })
                .catch(errorHandler);
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
                    } else {
                        vm.error = true;
                    }
                }
            }
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();
