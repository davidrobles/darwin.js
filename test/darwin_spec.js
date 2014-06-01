describe('Simple object', function() {
    var ga;

    beforeEach(function() {
        ga = new Darwin.GA({});
    });

    it('should say hi', function() {
        expect("hello").toEqual("hello");
    });
});
