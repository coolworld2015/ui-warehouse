describe('directive: scrollHere', function() {

    var $compile, $rootScope, $timeout;

    beforeEach(module('app'));

    beforeEach(function () {
        env = sinon.sandbox.create();
    });

    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
    }));

    it('should call @scrollHere method on "scrollHere" event', function() {
        var scope = $rootScope.$new();
        $compile('<div scroll-here></div>')(scope);
        scope.scrollHere = env.spy();

        $rootScope.$broadcast('scrollHere');

        $timeout.flush();

        scope.scrollHere.should.have.been.called;
    });

});
