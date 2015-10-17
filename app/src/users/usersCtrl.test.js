describe('UsersCtrl', function () {
    var mockScope, mockUsersService, mockUsers, UsersCtrl, env;

    beforeEach(function () {
        env = sinon.sandbox.create();
        angular.mock.module("app");
    });

    beforeEach(module('app', function ($provide) {
        mockUsers = [
            {
                login: '1',
                pass: '1'
            }
        ];

        mockUsersService = {};

        mockUsersService.getUsers = function () {
            return mockUsers;
        };

        mockScope = {$watch: env.stub()};

        $provide.value('$scope', mockScope);

        $provide.value('usersService', mockUsersService);
    }));

    beforeEach(inject(function (_$controller_) {
            UsersCtrl = _$controller_('UsersCtrl');
        })
    );

    it('should @init set users on controller scope', function () {
        UsersCtrl.users.should.deep.equal(mockUsers);
    });
});