'use strict';

/* jasmine specs for services go here */

describe('ClubSelector', function() {


    var scope,
        elem,
        directive,
        compiled,
        template,
        html;

    beforeEach(function (){
        //load the module
        module('directives', 'templates/clubselect.html');

        //set our view html.
        html = '<clubselector clubs="clubs" selection="selection"></clubselector>';

        inject(function($compile, $rootScope, $templateCache) {
            //create a scope (you could just use $rootScope, I suppose)
            scope = $rootScope.$new();
            scope.clubs = ["PW", "GW", "SW", "LW"];
            scope.selection = [];

            //assign the template to the expected url called by the directive and put it in the cache
            template = $templateCache.get('templates/clubselect.html');
            $templateCache.put('templates/clubselect.html',template);

            //get the jqLite or jQuery element
            elem = angular.element(html);

            //compile the element into a function to
            // process the view.
            compiled = $compile(elem);

            //run the compiled view.
            compiled(scope);

            //call digest on the scope!
            scope.$digest();
        });
    });

    it('should have four buttons when clubs are set', function() {
        expect(elem.find('button').length).toBe(4);
        expect(scope.selection.length).toBe(0);
    });

    it('should add club to selection when button is clicked', function() {
        var gw = elem.find("#GW");
        gw.click();
        expect(scope.selection.length).toBe(1);
        gw.click();
        expect(scope.selection.length).toBe(2);

        expect(scope.selection[0]).toBe("GW");
    });

    it('should remove latest club when selection is clicked', function() {
        var gw = elem.find("#GW");
        var pw = elem.find("#PW");
        gw.click();
        pw.click();
        expect(scope.selection.length).toBe(2);

        var clubList = elem.find("#clubList");

        clubList.click();
        expect(scope.selection.length).toBe(1);
        expect(scope.selection[0]).toBe("GW");

        pw.click();
        gw.click();
        clubList.click();

        expect(scope.selection.length).toBe(2);
        expect(scope.selection[1]).toBe("PW");
    });
});