'use strict';

angular.module('restservice', []).factory('$restservice', ['$http', function($http) {
  var restservice = {};
  var assetName = "greenhouse";
  var serverurl = "/m3da/clients/";
  var deviceassetId = "m2m_greenhouse_demo";
  var requesturl = serverurl + deviceassetId + '/data';

  restservice.getGreenData = function(successHandler, errorHandler) {
    $http.get(requesturl).success(function(data) {
      var response = {};

      // Light is not sent by embedded app
      // retreiving booleans
      response.light = data[assetName + ".data.light"][0].value[0] === true ? 'on' : 'off';
      response.shield = data[assetName + ".data.open"][0].value[0] === true ? 'on' : 'off';

      // Round given values
      response.luminosity = data[assetName + ".data.luminosity"][0].value[0];
      response.temperature = data[assetName + ".data.temperature"][0].value[0];
      response.humidity = data[assetName + ".data.humidity"][0].value[0];

      if (data[assetName + ".data.temperatureAlarm"] !== undefined) {
        response.temperatureAlarm = data[assetName + ".data.temperatureAlarm"][0].value[0];
        response.temperatureTimestamp = parseInt(data[assetName + ".data.timestamp"][0].value[0]);
      }

      return successHandler(response);
    }).error(errorHandler);
  };

  restservice.toggleCommand = function(commandId, newStatus, handleSuccess, handleNoApp, handleCommandError) {

    // Send command
    var postData = {
      "settings": [{
        "key": commandId,
        "value": newStatus
      }]
    };
    $http.post(requesturl, postData).success(handleSuccess).error(handleCommandError);
  };

  restservice.getCommStatus = function(handleSuccess, handleError) {
    $http.get(requesturl).success(function(data) {

      var result = {};
      result.lastCommDate = parseInt(data[assetName + ".data.timestamp"][0].value[0]);

      handleSuccess(result);

    }).error(handleError);

  };

  return restservice;
}]);
