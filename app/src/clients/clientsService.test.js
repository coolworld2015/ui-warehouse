describe('clientsData', function () {
    var ClientsService, scope, mockClients, unsortedClients, sortedClients,
        mockCounter;

    beforeEach(module('app'));

    beforeEach(inject(function (_ClientsService_) {
        ClientsService = _ClientsService_;

        scope = {};

        mockClients = [{
            id: 1,
            name: 'a'
        }];

        unsortedClients = [{
            name: 'Ed'
        }, {
            name: 'Andrew'
        }];

        sortedClients = [{
            name: 'Andrew'
        }, {
            name: 'Ed'
        }];

        localStorage.setItem('warehouse_clients', JSON.stringify(mockClients));
    }));

    describe('getClients', function () {
        it('should exist method getClients', function () {
            ClientsService.getClients.should.have.been.defined;
            ClientsService.getClients.should.have.been.a('function');
        });

        it('should getClients return array', function () {
            ClientsService.getClients().should.deep.equal(mockClients);
        });


    });

    describe('setClients', function () {
        it('should exist method setClients', function () {
            ClientsService.setClients.should.have.been.defined;
            ClientsService.setClients.should.have.been.a('function');
        });

        it('should setClients set clients in localStorage', function () {
            ClientsService.setClients(mockClients);
            JSON.parse(localStorage.getItem('warehouse_clients')).should.be.deep.equal(mockClients);
        });
    });

});
