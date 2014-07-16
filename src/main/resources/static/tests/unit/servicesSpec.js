'use strict';

/* jasmine specs for services go here */

describe('CourseService', function() {


    beforeEach(module('web', 'MockFeeder'));

    var service;

    beforeEach(inject(function (CourseService) {
        service = CourseService;
    }));

    describe("listing all clubs", function() {

        var list;
        it("should give 3 clubs", function() {

            service.listClubs(function(data) {
               list =  data;
            });

            waitsFor(function() {
                return list;
            }, "list should be populated", 500);

            runs(function() {
               expect(list.length).toBe(3);
            });
        });
    });

    describe("getting data of Vihti Golf", function() {

        var clubData;

        var $httpBackend;

        beforeEach(inject(function ($injector, clubJSON) {

            $httpBackend = $injector.get('$httpBackend');

            $httpBackend.whenGET('./clubs.json').respond(
                clubJSON
            );

        }));

        beforeEach(function() {

            $httpBackend.expectGET("./clubs.json");

            service.getClubData("Vihti Golf", function(data) {
               clubData = data;
            });

            $httpBackend.flush();

            waitsFor(function() {
                return clubData;
            }, "club data is loaded", 1000);
        });

        it(" should return 2 courses", function() {
            expect(clubData.courses.length).toBe(2);
        });
        it(" should return 18 holes for course", function() {
            expect(Object.keys(clubData.courses[0].holes).length).toBe(18);
        });
    });
});

describe('CalcService', function() {


    beforeEach(module('web'));

    var service;
    var roundService;
    var courseService;

    beforeEach(inject(function(CalcService, RoundService, CourseService) {
        service = CalcService;
        roundService = RoundService;
        courseService = CourseService;
    }));

    describe("calculating game hcp", function() {
        it('should give game hcp of 20 for Vihti golf with hcp 18,8', function() {
            var result = service.calculateGameHcp(18.8, 127, 71.3, 72);
            expect(result).toBe(20);
        });

        it('should give null game hcp when accurate hcp is not give', function() {
            var result = service.calculateGameHcp(null, 127, 71.3, 72);
            expect(result).toBe(null);
        });
    });

});
