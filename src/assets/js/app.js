var express = require('express');
var fs = require('fs');
var multer = require('multer');

var app = express();

angular.module('myApp',["ng.deviceDetector"])
.controller('myCtrl',['deviceDetector',function(deviceDetector){
    var vm = this;
    vm.data = deviceDetector;
    vm.allData = JSON.stringify(vm.data, null, 2);
}])