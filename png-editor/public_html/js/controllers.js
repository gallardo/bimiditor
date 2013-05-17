'use strict';

/* Controllers */
angular.module('binPngEditorApp.controllers', [])
        .controller('BinPngEditorCtrl', ['$scope', function($scope) {
        this.scope = $scope;
        this.setFile = function(element) {
            scope.pngFile = element.files[0];
        };
    }]);
