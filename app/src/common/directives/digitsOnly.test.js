describe('directive: digitsOnly', function() {

    var $compile, $rootScope, scope, inputEl, form;

    beforeEach(function () {
        env = sinon.sandbox.create();
    });

    function setupDirective() {
        inputEl = angular.element('<input value="" digits-only/>');
        $compile(inputEl)(scope);
        scope.$digest();
    }

    beforeEach(module('app'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        setupDirective();
    }));

    describe('onKeyDown tests with event mock', function() {
        it('should work ok if digit was entered', function() {
            var event = {
                keyCode: 48,
                preventDefault: env.stub()
            };
            scope.onKeyDown(event);
            event.preventDefault.should.have.not.been.called;
        });

        it('should prevent from entering letters', function() {
            var event = {
                keyCode: 70,
                preventDefault: env.stub()
            };

            scope.onKeyDown(event);
            event.preventDefault.should.have.been.called;
        });
    });
});