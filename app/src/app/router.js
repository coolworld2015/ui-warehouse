(function () {
    'use strict';

    angular
        .module('app')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function routeConfig($stateProvider, $urlRouterProvider) {

        function resolveResource(url, state, sort) {
            resolver.$inject = ['$http', '$q', '$rootScope', 'ClientsLocalStorage', 'ClientsService',
                'GoodsLocalStorage', 'GoodsService', 'UsersLocalStorage', 'UsersService',
				'InputsLocalStorage', 'InputsService'];
            function resolver($http, $q, $rootScope, ClientsLocalStorage, ClientsService,
                              GoodsLocalStorage, GoodsService, UsersLocalStorage, UsersService,
							  InputsLocalStorage, InputsService) {

                var data;
                var webUrl = $rootScope.myConfig.webUrl;

                if ($rootScope.mode == 'OFF-LINE (LocalStorage)') {
                    switch (state) {
                        case 'store':
                            data = GoodsLocalStorage.getGoods();
                            return data;
                            break;

                        case 'goods':
                            data = GoodsLocalStorage.getGoods();
                            return data;
                            break;

                        case 'clients':
                            data = ClientsLocalStorage.getClients();
                            return data;
                            break;

                        case 'users':
                            data = UsersLocalStorage.getUsers();
                            return data;
                            break;                        
							
						case 'inputs':
                            data = InputsLocalStorage.getInputs();
                            return data;
                            break;
                    }
                } else {
                    switch (state) {
                        case 'goods':
                            if ($rootScope.goods === undefined) {
                                return $http.get(webUrl + url)
                                    .then(function (result) {
                                        GoodsService.goods = result.data;
                                        $rootScope.goods = true;
                                        $rootScope.loading = false;
                                        return GoodsService.goods.sort(sort);
                                    })
                                    .catch(function (reject) {
                                        $rootScope.loading = false;
                                        $rootScope.myError = true;
                                        return $q.reject(reject);
                                    });
                            } else {
                                return GoodsService.goods.sort(sort);
                            }
                            break;

                        case 'clients':
                            if ($rootScope.clients === undefined) {
                                return $http.get(webUrl + url)
                                    .then(function (result) {
                                        ClientsService.clients = result.data;
                                        $rootScope.clients = true;
                                        $rootScope.loading = false;
                                        return ClientsService.clients.sort(sort);
                                    })
                                    .catch(function (reject) {
                                        $rootScope.loading = false;
                                        $rootScope.myError = true;
                                        return $q.reject(reject);
                                    });
                            } else {
                                return ClientsService.clients.sort(sort);
                            }
                            break;

                        case 'users':
                            if ($rootScope.users === undefined) {
                                return $http.get(webUrl + url)
                                    .then(function (result) {
                                        UsersService.users = result.data;
                                        $rootScope.users = true;
                                        $rootScope.loading = false;
                                        return UsersService.users.sort(sort);
                                    })
                                    .catch(function (reject) {
                                        $rootScope.loading = false;
                                        $rootScope.myError = true;
                                        return $q.reject(reject);
                                    });
                            } else {
                                return UsersService.users.sort(sort);
                            }
                            break;
							
                        case 'inputs':
                            if ($rootScope.inputs === undefined) {
                                return $http.get(webUrl + url)
                                    .then(function (result) {
                                        InputsService.inputs = result.data;
                                        $rootScope.inputs = true;
                                        $rootScope.loading = false;
                                        return InputsService.inputs;
                                    })
                                    .catch(function (reject) {
                                        $rootScope.loading = false;
                                        $rootScope.myError = true;
                                        return $q.reject(reject);
                                    });
                            } else {
                                return InputsService.inputs;
                            }
                            break;							
                    }

                }
            }
            return resolver;
        }

        function sort(a, b) {
            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
            if (nameA < nameB) {
                return -1
            }
            if (nameA > nameB) {
                return 1
            }
            return 0;
        }

        function sortNumber(a, b) {
            return parseInt(a.number) - parseInt(b.number);
        }

        //$urlRouterProvider.otherwise('/login');  //TODO
        $urlRouterProvider.otherwise('/main');

        $stateProvider
            .state('main', {
                url: '/main',
                data: {
                    requireLogin: true
                },
                views: {
                    '': {
                        template: //'<div ui-view="menu"></div>' +
                            '<div ui-view="display"></div>'
                    },
                    'menu@main': {
                        templateUrl: 'common/menu.html',
                        controller: 'MenuCtrl',
                        controllerAs: 'menuCtrl'
                    },
                    'display@main': {
                        templateUrl: 'app/main.html',
                        controller: 'MainCtrl',
                        controllerAs: 'mainCtrl'
                    }
                }
            })
//-------------------------------------------------------------------------------------------------------
            .state('login', {
                url: '/login',
                templateUrl: 'login/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'loginCtrl',
                data: {
                    requireLogin: false
                }
            })
//-------------------------------------------------------------------------------------------------------
            .state('main.config', {
                url: '/config',
                views: {
                    'display': {
                        templateUrl: 'config/config.html',
                        controller: 'ConfigCtrl',
                        controllerAs: 'configCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })
//-------------------------------------------------------------------------------------------------------
            .state('main.store', {
                url: '/store',
                views: {
                    'display': {
                        templateUrl: 'store/store.html',
                        controller: 'StoreCtrl',
                        controllerAs: 'storeCtrl'
                    }
                },
                data: {
                    requireLogin: true
                },
                resolve: {
                    goods: resolveResource('api/goods/get', 'goods', sort)
                }
            })
//-------------------------------------------------------------------------------------------------------
            .state('main.goods', {
                url: '/goods',
                views: {
                    'display': {
                        templateUrl: 'goods/goods.html',
                        controller: 'GoodsCtrl',
                        controllerAs: 'goodsCtrl'
                    }
                },
                data: {
                    requireLogin: true
                },
                resolve: {
                    goods: resolveResource('api/goods/get', 'goods', sort)
                }
            })

            .state('main.goods-add', {
                url: '/goods-add',
                params: {item: {}},
                views: {
                    'display': {
                        templateUrl: 'goods/goods-add.html',
                        controller: 'GoodsAddCtrl',
                        controllerAs: 'goodsAddCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })

            .state('main.goods-edit', {
                url: '/goods-edit',
                params: {item: {}},
                views: {
                    'display': {
                        templateUrl: 'goods/goods-edit.html',
                        controller: 'GoodsEditCtrl',
                        controllerAs: 'goodsEditCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })

            .state('main.goods-dialog', {
                url: '/goods-dialog',
                params: {item: {}},
                views: {
                    'display': {
                        templateUrl: 'goods/goods-dialog.html',
                        controller: 'GoodsDialogCtrl',
                        controllerAs: 'goodsDialogCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })
//-------------------------------------------------------------------------------------------------------
            .state('main.clients', {
                url: '/clients',
                views: {
                    'display': {
                        templateUrl: 'clients/clients.html',
                        controller: 'ClientsCtrl',
                        controllerAs: 'clientsCtrl'
                    }
                },
                data: {
                    requireLogin: true
                },
                resolve: {
                    clients: resolveResource('api/clients/get', 'clients', sort)
                }
            })

            .state('main.clients-add', {
                url: '/clients-add',
                views: {
                    'display': {
                        templateUrl: 'clients/clients-add.html',
                        controller: 'ClientsAddCtrl',
                        controllerAs: 'clientsAddCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })

            .state('main.clients-edit', {
                url: '/clients-edit',
                params: {item: {}},
                views: {
                    'display': {
                        templateUrl: 'clients/clients-edit.html',
                        controller: 'ClientsEditCtrl',
                        controllerAs: 'clientsEditCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })

            .state('main.clients-dialog', {
                url: '/clients-dialog',
                params: {item: {}},
                views: {
                    'display': {
                        templateUrl: 'clients/clients-dialog.html',
                        controller: 'ClientsDialogCtrl',
                        controllerAs: 'clientsDialogCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })
//-------------------------------------------------------------------------------------------------------
            .state('main.inputs', {
                url: '/inputs',
                views: {
                    'display': {
                        templateUrl: 'inputs/inputs.html',
                        controller: 'InputsCtrl',
                        controllerAs: 'inputsCtrl'
                    }
                },
                data: {
                    requireLogin: true
                },
                resolve: {
                    inputs: resolveResource('api/inputs/get', 'inputs', sort)
                }
            })

            .state('main.inputs-add', {
                url: '/inputs-add',
                params: {item: {}},
                views: {
                    'display': {
                        templateUrl: 'inputs/inputs-add.html',
                        controller: 'InputsAddCtrl',
                        controllerAs: 'inputsAddCtrl'
                    }
                },
                data: {
                    requireLogin: true
                },
                resolve: {
                    clients: resolveResource('api/clients/get', 'clients', sort)
                }
            })

            .state('main.inputs-edit', {
                url: '/inputs-edit',
                params: {item: {}},
                views: {
                    'display': {
                        templateUrl: 'inputs/inputs-edit.html',
                        controller: 'InputsEditCtrl',
                        controllerAs: 'inputsEditCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })

            .state('main.inputs-dialog', {
                url: '/inputs-dialog',
                params: {item: {}},
                views: {
                    'display': {
                        templateUrl: 'inputs/inputs-dialog.html',
                        controller: 'InputsDialogCtrl',
                        controllerAs: 'inputsDialogCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })

            .state('main.inputs-invoice', {
                url: '/inputs-invoice',
                params: {item: {}},
                views: {
                    'display': {
                        templateUrl: 'inputs/inputs-invoice.html',
                        controller: 'InputsInvoiceCtrl',
                        controllerAs: 'inputsInvoiceCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })

            .state('main.inputs-invoice-add', {
                url: '/inputs-invoice-add',
                params: {item: {}},
                views: {
                    'display': {
                        templateUrl: 'inputs/inputs-invoice-add.html',
                        controller: 'InputsInvoiceAddCtrl',
                        controllerAs: 'inputsInvoiceAddCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })

            .state('main.inputs-invoice-edit', {
                url: '/inputs-invoice-edit',
                params: {item: {}, invoice: {}},
                views: {
                    'display': {
                        templateUrl: 'inputs/inputs-invoice-edit.html',
                        controller: 'InputsInvoiceEditCtrl',
                        controllerAs: 'inputsInvoiceEditCtrl'
                    }
                }
            })

            .state('main.inputs-invoice-dialog', {
                url: '/inputs-invoice-dialog',
                params: {item: {}, invoice: {}},
                views: {
                    'display': {
                        templateUrl: 'inputs/inputs-invoice-dialog.html',
                        controller: 'InputsInvoiceDialogCtrl',
                        controllerAs: 'inputsInvoiceDialogCtrl'
                    }
                }
            })
//-------------------------------------------------------------------------------------------------------
            .state('main.outputs', {
                url: '/outputs',
                views: {
                    'display': {
                        templateUrl: 'outputs/outputs.html',
                        controller: 'OutputsCtrl',
                        controllerAs: 'outputsCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })

            .state('main.outputs-add', {
                url: '/outputs-add',
                params: {item: {}},
                views: {
                    'display': {
                        templateUrl: 'outputs/outputs-add.html',
                        controller: 'OutputsAddCtrl',
                        controllerAs: 'outputsAddCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })

            .state('main.outputs-edit', {
                url: '/outputs-edit',
                params: {item: {}},
                views: {
                    'display': {
                        templateUrl: 'outputs/outputs-edit.html',
                        controller: 'OutputsEditCtrl',
                        controllerAs: 'outputsEditCtrl'
                    }
                }
            })

            .state('main.outputs-dialog', {
                url: '/outputs-dialog',
                params: {item: {}},
                views: {
                    'display': {
                        templateUrl: 'outputs/outputs-dialog.html',
                        controller: 'OutputsDialogCtrl',
                        controllerAs: 'outputsDialogCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })

            .state('main.outputs-invoice', {
                url: '/outputs-invoice',
                params: {item: {}},
                views: {
                    'display': {
                        templateUrl: 'outputs/outputs-invoice.html',
                        controller: 'OutputsInvoiceCtrl',
                        controllerAs: 'outputsInvoiceCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })

            .state('main.outputs-invoice-add', {
                url: '/outputs-invoice-add',
                params: {item: {}},
                views: {
                    'display': {
                        templateUrl: 'outputs/outputs-invoice-add.html',
                        controller: 'OutputsInvoiceAddCtrl',
                        controllerAs: 'outputsInvoiceAddCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })

            .state('main.outputs-invoice-edit', {
                url: '/outputs-invoice-edit',
                params: {item: {}, invoice: {}},
                views: {
                    'display': {
                        templateUrl: 'outputs/outputs-invoice-edit.html',
                        controller: 'OutputsInvoiceEditCtrl',
                        controllerAs: 'outputsInvoiceEditCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })

            .state('main.outputs-invoice-dialog', {
                url: '/outputs-invoice-dialog',
                params: {item: {}, invoice: {}},
                views: {
                    'display': {
                        templateUrl: 'outputs/outputs-invoice-dialog.html',
                        controller: 'OutputsInvoiceDialogCtrl',
                        controllerAs: 'outputsInvoiceDialogCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })
//-------------------------------------------------------------------------------------------------------
            .state('main.users', {
                url: '/users',
                views: {
                    'display': {
                        templateUrl: 'users/users.html',
                        controller: 'UsersCtrl',
                        controllerAs: 'usersCtrl'
                    }
                },
                data: {
                    requireLogin: true
                },
                resolve: {
                    users: resolveResource('api/users/get', 'users', sort)
                }
            })

            .state('main.users-add', {
                url: '/users-add',
                params: {item: {}},
                views: {
                    'display': {
                        templateUrl: 'users/users-add.html',
                        controller: 'UsersAddCtrl',
                        controllerAs: 'usersAddCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })

            .state('main.users-edit', {
                url: '/users-edit',
                params: {item: {}},
                views: {
                    'display': {
                        templateUrl: 'users/users-edit.html',
                        controller: 'UsersEditCtrl',
                        controllerAs: 'usersEditCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })

            .state('main.users-dialog', {
                url: '/users-dialog',
                params: {item: {}},
                views: {
                    'display': {
                        templateUrl: 'users/users-dialog.html',
                        controller: 'UsersDialogCtrl',
                        controllerAs: 'usersDialogCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            });
//-------------------------------------------------------------------------------------------------------
    }
})();