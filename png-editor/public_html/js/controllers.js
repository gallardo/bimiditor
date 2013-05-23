'use strict';

/* Controllers */
angular.module('binPngEditorApp.controllers', [])
        .controller('BinPngEditorCtrl', ['$scope', function($scope) {

        $scope.pngFile = {
            name: '--',
            type: '--',
            size: '--'
        };
        $scope.setFile = function(file) {
            if (file.type === "image/png") {
                parseImage(file);
            } else {
                $("#FileInfoDiv").append($(
                        "<p>File format <strong>" + file.type +
                        "</strong> not supported.</p>"
                        ));
            }

            $scope.$apply(function() {
                $scope.pngFile = file;
                $scope.pngFile.loaded = true;
            });
        };
        /**
         * 
         * @param {PngImage} image
         */
        $scope.setImage = function(image) {
            $scope.$apply(function() {
                $scope.pngImageModel = image;
            });
        };
    }]);

/**
 * @class PngImage wrapper to interface with angular
 * @param {PngImage} image
 */
function PngImageModel(image) {
    var _image = image;
    var _that = {
        signatureHex: _image.getSignatureHex()
    };
    return _that;
}
;