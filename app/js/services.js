'use strict';

/* Services */

angular.module('greenhouseServices', []).
factory('restService', function($http){
	var services = {}

	services.getDeviceData = function(deviceId, successHandler, errorHandler){
		$http.get(server_url+"/"+deviceId+"/data")
		.success(function (data){
			
			var response = {
				temperature: {},
				luminosity: {},
				humidity: {},
				light: {}
			};

			response.temperature.value = data["greenhouse.data.temperature"][0].value[data["greenhouse.data.temperature"][0].value.length-1];
			response.temperature.timestamp = data["greenhouse.data.temperature"][0].timestamp;

			response.luminosity.value = parseFloat(data["greenhouse.data.luminosity"][0].value[data["greenhouse.data.luminosity"][0].value.length-1]).toFixed(1);
			response.luminosity.timestamp = data["greenhouse.data.luminosity"][0].timestamp;

			response.humidity.value = parseFloat(data["greenhouse.data.humidity"][0].value[data["greenhouse.data.humidity"][0].value.length-1]).toFixed(1);
			response.humidity.timestamp = data["greenhouse.data.humidity"][0].timestamp;

			response.light.value = data["greenhouse.data.light"][0].value[data["greenhouse.data.light"][0].value.length-1]
			response.light.timestamp = data["greenhouse.data.light"][0].timestamp;

			successHandler(response);
		})
		.error(errorHandler);
	};

	services.sendData = function(deviceId, command, successHandler, errorHandler){
		$http.post(server_url+"/"+deviceId+"/data", command)
		.success(successHandler)
		.error(errorHandler);
	};

	return services
});
