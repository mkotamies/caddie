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

describe('ProfileService', function() {


    beforeEach(module('web'));

    var service;
    var roundService;
    var courseService;

    beforeEach(inject(function(ProfileService) {
        service = ProfileService;
        service.resetClubSelection();
    }));

    describe("listing clubs", function() {
        it('should give 7 woods, 7 irons and four wedges as all possible clubs', function() {
            var clubs = service.listAllClubs();
            expect(clubs.woods.length).toBe(7);
            expect(clubs.irons.length).toBe(7);
            expect(clubs.wedges.length).toBe(4);
        });

        it("should give all clubs if no save has been made", function() {
            var profileClubs = service.getClubs();
            var allClubs = service.listAllClubs();
            var allListed = _.union(allClubs.woods, allClubs.irons, allClubs.wedges);
            expect(profileClubs.opening).toEqual(allListed);
            expect(profileClubs.approach).toEqual(allListed);
            expect(profileClubs.chip).toEqual(allListed);
        });

        it("should give modified club list after modification", function() {
            var clubs = service.getClubs();
            clubs.opening.splice(1,1);
            clubs.approach.splice(0, 3);
            clubs.chip.splice(1, 1);
            service.saveClubSelection(clubs);

            var profileClubs = service.getClubs();

            expect(profileClubs.opening.length).toBe(17);
            expect(profileClubs.approach.length).toBe(15);
            expect(profileClubs.chip.length).toBe(17);
        });

        it("should give all clubs as chip clubs", function() {
           var chipClubs = service.getChipClubs();
           expect(chipClubs.length).toBe(18);
        });

        it("should only give clubs from users selection when asking chip clubs", function() {
            var clubs = service.getClubs();
            clubs.opening.splice(1,1);
            clubs.approach.splice(0, 3);
            clubs.chip.splice(1, 1);
            service.saveClubSelection(clubs);

            var chipClubs = service.getChipClubs();
            expect(chipClubs.length).toBe(17);
        });

        it("should sort clubs when saving profile", function() {
            var clubs = {
                opening : ["SW", "W3", "I5"],
                approach : ["LW", "I9", "I5"],
                chip : ["SW", "PW", "I5"]
            }
            service.saveClubSelection(clubs);

            var openingClubs = service.getOpeningClubs();
            expect(openingClubs).toEqual(["W3", "I5", "SW"]);
            var approachClubs = service.getApproachClubs();
            expect(approachClubs).toEqual(["I5", "I9", "LW"]);
            var chipClubs = service.getChipClubs();
            expect(chipClubs).toEqual(["I5", "PW", "SW"]);
        });
    });

});