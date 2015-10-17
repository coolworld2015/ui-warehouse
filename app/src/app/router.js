(function () {
    'use strict';

    angular
        .module('app')
        .config(routeConfig);

	routeConfig.$inject = ['$stateProvider','$urlRouterProvider'];

    function routeConfig($stateProvider, $urlRouterProvider) {
        var webUrl = 'http://coolworld2015a1.herokuapp.com/'; //TODO change URL
        //var webUrl = 'http://localhost:3000/';

		function resolveResource(url, sort) {
			resolver.$inject = ['$http', '$q', '$rootScope'];
			function resolver($http, $q, $rootScope) {
				return $http.get(url)
                    .then(function (result) {
                        $rootScope.loading = false;
                        return result.data.sort(sort);
                    })
                    .catch(function (reject) {
                        $rootScope.loading = false;
                        $rootScope.myError = true;
                        return $q.reject(reject);
                    });
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

        function sort1(a, b) {
            return parseInt(a.number) - parseInt(b.number);
        }

        $urlRouterProvider.otherwise('/login');
        //$urlRouterProvider.otherwise('/main');
		
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'login/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'loginCtrl',
                data: {
                    requireLogin: false
                }
            })

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
                    goods: resolveResource(webUrl + 'api/goods/get',sort)
                }
            })

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
                    goods: resolveResource(webUrl + 'api/goods/get',sort)
                }
            })

            .state('main.goods-add', {
                url: '/goods-add',
                params: {item:{}},
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
                params: {item:{}},
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
                params: {item:{}},
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
                    clients: resolveResource(webUrl + 'api/clients/get', sort)
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
                params: {item:{}},
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
                params: {item:{}},
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
                    inputs: resolveResource(webUrl + 'api/inputs/get', sort1)
                }
            })

            .state('main.inputs-add', {
                url: '/inputs-add',
                params: {item:{}},
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
                    clients: resolveResource(webUrl + 'api/clients/get', sort)
                }
            })

            .state('main.inputs-edit', {
                url: '/inputs-edit',
                params: {item:{}},
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
                params: {item:{}},
                views: {
                    'display': {
                        templateUrl: 'inputs/inputs-dialog.html',
                        controller: 'InputsDialogCtrl',
                        controllerAs: 'inputsDialogCtrl'
                    }
                },
                data: {
                    requireLogin: true
                },
                resolve: {
                    invoice: resolveResource(webUrl + 'api/invoicein/get', sort1)
                }
            })

            .state('main.inputs-invoice', {
                url: '/inputs-invoice',
                params: {item:{}},
                views: {
                    'display': {
                        templateUrl: 'inputs/inputs-invoice.html',
                        controller: 'InputsInvoiceCtrl',
                        controllerAs: 'inputsInvoiceCtrl'
                    }
                },
                data: {
                    requireLogin: true
                },
                resolve: {
                    invoice: resolveResource(webUrl + 'api/invoicein/get', sort1)
                }
            })

            .state('main.inputs-invoice-add', {
                url: '/inputs-invoice-add',
                params: {item:{}},
                views: {
                    'display': {
                        templateUrl: 'inputs/inputs-invoice-add.html',
                        controller: 'InputsInvoiceAddCtrl',
                        controllerAs: 'inputsInvoiceAddCtrl'
                    }
                },
                data: {
                    requireLogin: true
                },
                resolve: {
                    goods: resolveResource(webUrl + 'api/goods/get', sort)
                }
            })

            .state('main.inputs-invoice-edit', {
                url: '/inputs-invoice-edit',
                params: {item:{},invoice:{}},
                views: {
                    'display': {
                        templateUrl: 'inputs/inputs-invoice-edit.html',
                        controller: 'InputsInvoiceEditCtrl',
                        controllerAs: 'inputsInvoiceEditCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })

            .state('main.inputs-invoice-dialog', {
                url: '/inputs-invoice-dialog',
                params: {item:{},invoice:{}},
                views: {
                    'display': {
                        templateUrl: 'inputs/inputs-invoice-dialog.html',
                        controller: 'InputsInvoiceDialogCtrl',
                        controllerAs: 'inputsInvoiceDialogCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })

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
                },
                resolve: {
                    outputs: resolveResource(webUrl + 'api/outputs/get', sort1)
                }
            })

            .state('main.outputs-add', {
                url: '/outputs-add',
                params: {item:{}},
                views: {
                    'display': {
                        templateUrl: 'outputs/outputs-add.html',
                        controller: 'OutputsAddCtrl',
                        controllerAs: 'outputsAddCtrl'
                    }
                },
                data: {
                    requireLogin: true
                },
                resolve: {
                    clients: resolveResource(webUrl + 'api/clients/get', sort)
                }
            })

            .state('main.outputs-edit', {
                url: '/outputs-edit',
                params: {item:{}},
                views: {
                    'display': {
                        templateUrl: 'outputs/outputs-edit.html',
                        controller: 'OutputsEditCtrl',
                        controllerAs: 'outputsEditCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })

            .state('main.outputs-dialog', {
                url: '/outputs-dialog',
                params: {item:{}},
                views: {
                    'display': {
                        templateUrl: 'outputs/outputs-dialog.html',
                        controller: 'OutputsDialogCtrl',
                        controllerAs: 'outputsDialogCtrl'
                    }
                },
                data: {
                    requireLogin: true
                },
                resolve: {
                    invoice: resolveResource(webUrl + 'api/invoiceout/get', sort1)
                }
            })

            .state('main.outputs-invoice', {
                url: '/outputs-invoice',
                params: {item:{}},
                views: {
                    'display': {
                        templateUrl: 'outputs/outputs-invoice.html',
                        controller: 'OutputsInvoiceCtrl',
                        controllerAs: 'outputsInvoiceCtrl'
                    }
                },
                data: {
                    requireLogin: true
                },
                resolve: {
                    invoice: resolveResource(webUrl + 'api/invoiceout/get', sort1)
                }
            })

            .state('main.outputs-invoice-add', {
                url: '/outputs-invoice-add',
                params: {item:{}},
                views: {
                    'display': {
                        templateUrl: 'outputs/outputs-invoice-add.html',
                        controller: 'OutputsInvoiceAddCtrl',
                        controllerAs: 'outputsInvoiceAddCtrl'
                    }
                },
                data: {
                    requireLogin: true
                },
                resolve: {
                    goods: resolveResource(webUrl + 'api/goods/get', sort)
                }
            })

            .state('main.outputs-invoice-edit', {
                url: '/outputs-invoice-edit',
                params: {item:{},invoice:{}},
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
                params: {item:{},invoice:{}},
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
                    users: resolveResource(webUrl + 'api/users/get', sort)
                }
            })

            .state('main.users-add', {
                url: '/users-add',
                params: {item:{}},
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
                params: {item:{}},
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
                params: {item:{}},
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
            })
    }
})();