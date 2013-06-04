'use strict';

/* Controllers */
angular.module('binPngEditorApp.controllers', [])
        .controller('BinPngEditorCtrl', [
        	'$scope', '$log', '$http',
         	function($scope, $log, $http) {

        $scope.pngFile = {
            name: '--',
            type: '--',
            size: '--',
            lastModifiedDate: '--'
        };
        $scope.pngOriginalImage = {};
        $scope.pngEditedImage = {};

        // See http://stackoverflow.com/questions/16791295/how-to-read-binary-data-in-angularjs-in-an-arraybuffer
        $scope.loadLenna = function() {
        	var LENNA_PATH = "img/Lenna_64.png";
        	// LENNA_PATH = "http://upload.wikimedia.org/wikipedia/en/2/24/Lenna.png";
        	var config = {
        		responseType: "arraybuffer",
    		};
        	$log.log('Loading Lenna...');
        	$http.get(LENNA_PATH,config).success(function(data) {
        		$log.log("Read '" + LENNA_PATH + "': " + data.byteLength + " bytes.");
        		var pngImage = PngImage(data);
                    $scope.pngOriginalImage = pngImage;
                    $scope.pngEditedImage = pngImage;
                    $scope.pngFile = {
                    	name: "Lenna_64.png",
                    	type: "image/png",
                    	size: data.byteLength,
                    	lastModifiedDate: new Date()
                    };
                    $scope.pngFile.loaded = true;

                // TODO: Angularize
                //PngGUI($('#PNGEditorDiv')[0], pngImage)
	              //  .setImageViewport($('#edited-image-img')[0])
    	            //.refresh();

            }).error(function() {
        		$log.error('Could not get ' + LENNA_PATH);
        	});
        };

        $scope.setFile = function(file) {
            if (file.type === "image/png") {
                readImage(file, function(pngImage) {
                    $scope.$apply(function() {
                        $scope.pngOriginalImage = pngImage;
                        $scope.pngEditedImage = pngImage;
                    });
                });
                $scope.$apply(function() {
                    $scope.pngFile = file;
                    $scope.pngFile.loaded = true;
                });
            } else {
                $("#FileInfoDiv").append($(
                        "<p>File format <strong>" + file.type +
                        "</strong> not supported.</p>"
                        ));
            }
        };

        $scope.$watch('pngOriginalImage', function() {
            if ($scope.pngOriginalImage.renderInImg) {
                $scope.pngOriginalImage.renderInImg($('#original-image-img')[0]);
            }
        });
        $scope.$watch('pngEditedImage', function() {
            if ($scope.pngEditedImage.renderInImg) {
                $scope.pngEditedImage.renderInImg($('#edited-image-img')[0]);
            }
        });
    }]);