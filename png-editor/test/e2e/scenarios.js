'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

/** A dsl returning a "true" future */
angular.scenario.dsl('willBeTrue', function() {
    return function(selector) {

        return this.addFutureAction('Returning true', function(appWindow, $document, done) {
            done(null, true);
        });
    };
});

describe('binPNGEditorTest', function() {
    beforeEach(function() {
        browser().navigateTo('../../public_html/index.html');
    });


    it('should pass a "expect true to be true"', function() {
        expect(willBeTrue()).toBe(true);
    });
});
