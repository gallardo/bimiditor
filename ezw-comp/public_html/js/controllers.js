'use strict';

/* Controllers */
angular.module('EZWApp.controllers', [])
        .controller('EZWCtrl', [
    '$scope', '$log', '$http',
    function($scope, $log, $http) {
        var _srcCanvas = document.getElementById('src-image-canvas');

        $scope.WIDTH_32BIT_BASE10 = Math.ceil(Math.log(Math.pow(2, 32) - 1) / Math.log(10)); // Number of digits required to code 2^32 in base10

        $scope.srcFile = {
            name: '--',
            type: '--',
            size: '--',
            lastModifiedDate: '--'
        };
        $scope.srcImage = new Image();

        /** ImageData */
        $scope.srcData;

        /** Transformed image */
        $scope.tImage = {};

        $scope.status = {};

        /**
         * 
         * @param {Image} image
         * @param {Element} canvas
         */
        function renderImageInSrcImageCanvas(image, canvas) {
            if (0 === image.width + image.height) {
                $log.log('Rendered empty image');
                return;
            }
            var context = canvas.getContext('2d');
            canvas.setAttribute('width', image.width);
            canvas.setAttribute('height', image.height);
            context.drawImage(image, 0, 0);
            $log.log('Rendered a ' + image.width + 'x' + image.height + ' image');
        }

        /**
         * @param {Element} canvas
         */
        function updateSrcImageInfoFromCanvas(canvas) {
            var imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
            var slice = new Uint8ClampedArray(imageData.data.buffer.slice(0, 8));
            var buf = '';
            for (var i = 0; i < slice.byteLength; i++) {
                buf += slice[i] + ',';
            }
            $log.log('data: ' + buf);
            
            // Components matrices. C[row][column] = C[y][x]
            var R = [], G = [], B = [];
            for (var y = 0; y < imageData.height; y++) {
                R[y] = []; G[y] = []; B[y] = [];
            }
            for (var y = 0; y < imageData.height; y++) {
                for (var x = 0; x < imageData.width; x++) {
                    var pixIndex = (x + imageData.width * y) * 4;
                    R[y][x] = imageData.data[pixIndex];
                    G[y][x] = imageData.data[pixIndex+1];
                    B[y][x] = imageData.data[pixIndex+2];
                }
            }
            $scope.$apply(function() {
                $scope.srcData = imageData;
                $scope.srcData.R = R;
                $scope.srcData.G = G;
                $scope.srcData.B = B;
            });
        }

        function updateSrcImage() {
            renderImageInSrcImageCanvas($scope.srcImage, _srcCanvas);
            updateSrcImageInfoFromCanvas(_srcCanvas);
        }

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
                $scope.srcImage.src = abtodataURL(data, 'image/png');
                $scope.srcImage.onload = updateSrcImage;


                $scope.srcFile = {
                    name: "Lenna_64.png",
                    type: "image/png",
                    size: data.byteLength,
                    lastModifiedDate: new Date(),
                    status: "Download successful",
                    statusClass: "text-success",
                    loaded: true
                };
            }).error(function() {
                $log.error('Could not get ' + LENNA_PATH);
            });
        };

        $scope.setFile = function(file) {
            var SUPPORTED_TYPES = ["image/gif", "image/jpeg", "image/gif"];
            if (0 <= SUPPORTED_TYPES.indexOf(file.type)) {
                readDataURL(file, file.type, function(dataURL) {
                    $scope.srcFile.loaded = true;
                    $scope.status.message = 'File "' + file.name + '" with mime type "' + file.type + '" successfully uploaded';
                    $scope.status.class = "text-success";
                    $scope.srcImage.src = dataURL;
                    $scope.srcImage.onload = updateSrcImage;
                    $scope.srcFile = file;
                });
            } else {
                $scope.$apply(function() {
                    $scope.status.message = 'File type "' + file.type + '" of file "' + file.name + '" not supported';
                    $scope.status.class = "text-error";
                });
            }
        };
        
        $scope.$watch('pngEditedImage.signatureHex', function(newVal, oldVal) {
            // XXX: for debugging
            $log.log('pngEditedImage.signatureHex modified from ' + oldVal + ' to ' + newVal);
        });
    }]);