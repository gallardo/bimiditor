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

describe('binPNGEditorTest', function($log) {
    beforeEach(function() {
        browser().navigateTo('../../public_html/index.html');
    });


    it('should pass a "expect true to be true"', function() {
        expect(willBeTrue()).toBe(true);
    });

    it('should display dashes in the file info section if no img loaded', function(){
      expect(element('#pngFileNameValue').text())
      .toBe('--');
      expect(element('#pngFileTypeValue').text())
      .toBe('--');
      expect(element('#pngFileSizeValue').text())
      .toBe('--');
      expect(element('#pngFileLastModifiedDateValue').text())
      .toBe('--');
    });

    it('should not display the signature if no img loaded', function() {
      expect(element('#signature-textarea').count()).toBe(0);
    });

    // AG 2013-05-24: After several hours, I decided to give up:
    // it seems that there is no way to simulate the file upload.
    // The input.files cannot be modified by code, and it is not
    // possible either to create an event, set its target.files,
    // and fire it on the input.
    // This seems to be a JavaScript "feature", and is per-design,
    // due to security reasons.
    // Following block doesn't work. I keep it here for future
    // alternative solutions
    /*
    it('should fill-in the file info upon file upload', function() {
      pause();
      element('#image-file').query(function(e1, done){
        var evt = document.createEvent('Event');
        evt.initEvent('change', false, true);
        //e1[0].dispatchEvent(changeEvent);
        e1[0].files = [{
        name: 'test',
        type: 'image/png'
      }];
        e1[0].dispatchEvent(evt);
        done();
      });

      pause();
      //expect(element('#pngFileNameValue').text()).toBe('Lenna');
    });
    */

    it('should create the file from the example', function() {
      element('#get-example-file-icon').click();
      expect(element('#pngFileNameValue').text())
      .toBe(LENNA_64.name);
      expect(element('#pngFileTypeValue').text())
      .toBe(LENNA_64.type);
    });

    it('should display the file signature if example file loaded', function() {
      element('#get-example-file-icon').click();
      expect(element('#signature-textarea').count()).toBeGreaterThan(0);
      expect(element('#signature-textarea').val()).toBe(PNG.signature_hex);
    });

    it('should render 6 chunks for the lenna example', function() {
      element('#get-example-file-icon').click();
      expect(element('div[id^=chunk-]').count()).toBe(6);
    });

    it('should create 6 links in the topbar upon loading of the lenna example', function() {
      element('#get-example-file-icon').click();
      expect(element('#top-nav a[href^=#chunk-]').count()).toBe(6);
    });

    // AG 2013-06-07 Cannot get this working: the navbar doesn't react always to the browser().navigateTo() (!)
    // it('should update the topbar active element upon loading of the lenna example and scrolling down', function() {
    //   element('#get-example-file-icon').click();
    //   browser().navigateTo('#chunk-5');
    //   var selectorChunk5Active = '#top-nav li:has(a[href=#chunk-5]).active';
    //   expect(element(selectorChunk5Active).count()).toBe(1);
    // });
});
