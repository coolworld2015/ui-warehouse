describe('UsersAddCtrl', function () {
    var mockScope, mockUsersService, mockUsers, mockUser, UsersAddCtrl, env;

    beforeEach(function () {
        env = sinon.sandbox.create();
        angular.mock.module("app");
    });

    beforeEach(module('app', function ($provide) {
        mockUsers = [
            obj = {
                id: 1,
                name: 1,
                pass: 1,
                role: 1
            }
        ];

        mockUser = {
            id: 2,
            name: 2,
            pass: 2,
            role: 2
        };

        mockUsersService = {};

        mockUsersService.getUsers = function () {
            return [];
        };

        $provide.value('$scope', mockScope);

    }));

    beforeEach(inject(function (_$controller_) {
            UsersAddCtrl = _$controller_('UsersAddCtrl');
        })
    );

    it('should @usersAddSubmit add new user in users', function () {
//TODO
        //UsersAddCtrl.usersAddSubmit();

    });
});