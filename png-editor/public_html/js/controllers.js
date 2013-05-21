'use strict';

/* Controllers */
angular.module('binPngEditorApp.controllers', [])
        .controller('BinPngEditorCtrl', ['$scope', function($scope) {

        $scope.pngFile = {
            name: '--',
            type: '--',
            size: '--'
        };
        $scope.setFile = function(element) {
            $scope.$apply(function() {
                $scope.pngFile = element.files[0];
                $scope.pngFile.loaded = true;
            });
        };
        /**
         * 
         * @param {PngImage} image
         */
        $scope.setImage = function(image) {
            $scope.$apply(function() {
                $scope.pngImage = image;
            });
        };
    }]);
