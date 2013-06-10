'use strict';

/* Controllers */
angular.module('binPngEditorApp.controllers', [])
        .controller('BinPngEditorCtrl', [
    '$scope', '$log', '$http',
    function($scope, $log, $http) {
        $scope.WIDTH_32BIT_BASE10 = Math.ceil(Math.log(Math.pow(2, 32) - 1) / Math.log(10)); // Number of digits required to code 2^32 in base10

        $scope.pngFile = {
            name: '--',
            type: '--',
            size: '--',
            lastModifiedDate: '--'
        };
        $scope.pngSourceImage = {};
        $scope.pngEditedImage = {};

        // See http://stackoverflow.com/questions/16791295/how-to-read-binary-data-in-angularjs-in-an-arraybuffer
        $scope.loadLenna = function() {
            var LENNA_PATH = "img/Lenna_64.png";
            // LENNA_PATH = "http://upload.wikimedia.org/wikipedia/en/2/24/Lenna.png";
            var config = {
                responseType: "arraybuffer",
            };
            $log.log('Loading Lenna...');
            $http.get(LENNA_PATH, config).success(function(data) {
                $log.log("Read '" + LENNA_PATH + "': " + data.byteLength + " bytes.");
                var pngImage = PngImage(data);

                $scope.pngSourceImage = pngImage;
                $scope.pngEditedImage = pngImage; // TODO: This should be a copy
                $scope.pngFile = {
                    name: "Lenna_64.png",
                    type: "image/png",
                    size: data.byteLength,
                    lastModifiedDate: new Date(),
                    status: "Download successful",
                    statusClass: "text-success"
                };
                $scope.pngFile.loaded = true;
            }).error(function() {
                $log.error('Could not get ' + LENNA_PATH);
            });
        };

        $scope.setFile = function(file) {
            $scope.$apply(function() {
                $scope.pngFile = file;
            });
            if (file.type === "image/png") {
                readImage(file, function(pngImage) {
                    $scope.$apply(function() {
                        $scope.pngSourceImage = pngImage;
                        $scope.pngEditedImage = pngImage; // TODO: This should be a copy
                        $scope.pngFile.loaded = true;
                        $scope.pngFile.status = "Upload successful";
                        $scope.pngFile.statusClass = "text-success";
                    });
                });
            } else {
                $scope.$apply(function() {
                    $scope.pngFile.status = "File not supported";
                    $scope.pngFile.statusClass = "text-error";
                });
            }
        };

        $scope.$watch('pngEditedImage.signatureHex', function(newVal, oldVal) {
            // XXX: for debugging
            $log.log('pngEditedImage.signatureHex modified from ' + oldVal + ' to ' + newVal);
        });
    }]);