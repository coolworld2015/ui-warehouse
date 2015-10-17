describe('usersService', function () {
    var UsersService, mockUsers;

    beforeEach(module('app'));

    beforeEach(inject(function (_UsersService_) {
        UsersService = _UsersService_;

        mockUsers = [{
            login: '1',
            pass: '1'
        }];

    }));

    describe('getUsers', function () {
        it('should exist method @getUsers', function(){
            UsersService.getUsers.should.be.defined;
        });

        it('should @getUsers get list of users', function () {
            localStorage.setItem('warehouse_users', JSON.stringify(mockUsers));
            UsersService.getUsers().should.be.deep.equal(mockUsers);
        });
    });

    describe('setUsers', function () {
        it('should @setUsers set users list to localeStorage', function () {
            UsersService.setUsers(mockUsers);
            JSON.parse(localStorage.getItem('warehouse_users')).should.be.deep.equal(mockUsers);
        })
    });
});