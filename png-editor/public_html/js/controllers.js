'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', [function() {

  }]);

// angular.module('binPngEditorApp.controllers', []);

function BinPngEditorCtrl($scope, $window) {
    BinPngEditorCtrl.prototype.$scope = $scope;
}

BinPngEditorCtrl.prototype.setFile = function(element) {
    var $scope = this.$scope;
    $scope.$apply(function() {
        $scope.pngFile = element.files[0];
    });
};
