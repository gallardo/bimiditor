'use strict';

var app = angular.module('binPngEditorApp.directives', []);

/**
 * To use with bootstrap-scrollspy: this directive must be applied to the
 * element to spy on<sup>1</sup> to keep it synchronized with DOM changes. It
 * refreshes the scrollspy upon changes to the model specified as the
 * attribute's value.<br/>
 *
 * Example of use:
 * <blockquote>
 *    <div data-spy="scroll" data-target="#top-nav" chunk-stalker-nav-bar="myModel.fieldToSpy">
 * </blockquote>
 *
 * <sup>1</sup> The element to spy on is the element to which the
 * <tt>data-spy="scroll"</tt> atttribute has been applied.
 *
 * @see http://twitter.github.io/bootstrap/javascript.html#scrollspy
 */
app.directive('chunkStalkerNavBar', ['$log', '$timeout', function($log, $timeout) {
    return {
        restrict: 'A', // Attribute
        link: function(scope, elm, attrs) {
            if (!elm.attr('data-spy')) {
                $log.warn('The chunkStalkerNavBar directive must be applied to an element with a "data-spy" attribute');
                return;
            }
            // Refresh upon changes to model
            scope.$watch(attrs.chunkStalkerNavBar, function() {
                // Timeout: execute outside of the angular lifecycle
                $timeout(function() {
                    $(elm).scrollspy('refresh');
                });
            });
        }
    }
}]);

/**
 * Creates a bootstrap tooltip for the element where the directive is applied.
 * Its value will be rendered as tooltip text. Notice that it is not necessary to use the
 * bootstrap <tt>data-toggle="tooltip"</tt>
 *
 * Example of use:
 * <blockquote>
 *    <i id="save-file-icon" class="icon-download" tooltip="'Save edited image (not yet available)'"></i>
 * </blockquote>
 * @see https://groups.google.com/d/msg/angular/G2Sg39oiSXU/ExIJP1-82Z8J
 */
app.directive('tooltip', ['$log', function($log) {
    return {
        restrict: 'A',
        link: function(scope, elm, attrs) {
            var _tooltip = scope.$eval(attrs.tooltip);
            if (_tooltip) {
                $(elm)
                    .attr('title', _tooltip)
                    .tooltip({placement: "right"});
            }
        }
    }
}]);