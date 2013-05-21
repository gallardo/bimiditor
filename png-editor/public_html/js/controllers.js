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
            });
        };
    }]);
