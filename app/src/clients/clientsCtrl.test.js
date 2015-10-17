describe('ClientsCtrl', function () {
    var ClientsCtrl, mockScope, mockClientsData, env;

    beforeEach(function () {
        env = sinon.sandbox.create();
        angular.mock.module("app");
    });

    beforeEach(module('app', function ($provide) {
        mockClientsData = {
            clients: [
                {name: '1'},
                {name: '2'}
            ],
            counter: 3
        };

        mockClientsData.getClients = function () {
            return this.clients;
        };

        mockScope = {$watch: env.stub()};

        $provide.value('$scope', mockScope);

        $provide.value('ClientsService', mockClientsData);
    }));

    beforeEach(inject(function (_$controller_) {
            ClientsCtrl = _$controller_('ClientsCtrl');
        })
    );

    it('should @init set clients and clientsCount in controller scope', function () {
        ClientsCtrl.clients.should.be.equal(mockClientsData.clients);
    });

});