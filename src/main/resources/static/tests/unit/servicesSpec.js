'use strict';

/* jasmine specs for services go here */

describe('CalcService tests', function() {

    var calcService;

    beforeEach(function() {
        module('web');

        inject(function(_calcService_) {
            calcService = _calcService_;
        });
    });

    it('should give game hcp of 20 for Vihti golf with hcp 18,8', function() {
        var result = calcService.calcGameHcp(18.8, 127, 71.3, 72);
        expect(result).toBe(20);
    });
});
