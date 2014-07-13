'use strict';

/* jasmine specs for services go here */

describe('CalcService', function() {


    beforeEach(module('web'));

    var service;

    beforeEach(inject(function(CalcService) {
        service = CalcService;
    }));

    describe("calcGameHcp", function() {
        it('should give game hcp of 20 for Vihti golf with hcp 18,8', function() {
            var result = service.calcGameHcp(18.8, 127, 71.3, 72);
            expect(result).toBe(20);
        });
    });

});
