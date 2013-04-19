'use strict';

/* Controllers */

function DeviceDetailCtrl($scope, $routeParams, $timeout, restService) {

	var dateFormat = d3.time.format("%c")

	$scope.deviceId = $routeParams.deviceId
	$scope.temperature = {value: 0.0, timestamp: dateFormat(new Date())}
	$scope.luminosity = {value: 0.0, timestamp: dateFormat(new Date())}
	$scope.humidity = {value: 0.0, timestamp: dateFormat(new Date())}
	$scope.light = {value: "OFF", timestamp: dateFormat(new Date())}

	function tick (){
		restService.getDeviceData($routeParams.deviceId,

			function(data){
				$scope.temperature.value = parseFloat(data.temperature.value).toFixed(1);
				$scope.temperature.timestamp = dateFormat(new Date(parseInt(data.temperature.timestamp)));

				$scope.luminosity.value = parseFloat(data.luminosity.value).toFixed(1);
				$scope.luminosity.timestamp = dateFormat(new Date(parseInt(data.luminosity.timestamp)));

				$scope.humidity.value = parseFloat(data.humidity.value).toFixed(1);
				$scope.humidity.timestamp = dateFormat(new Date(parseInt(data.humidity.timestamp)));

				$scope.light.value = data.light.value ? "ON":"OFF";
				$scope.light.timestamp = dateFormat(new Date(parseInt(data.light.timestamp)));
			}, 

			function(status){console.log(status)});

		$timeout(tick, 1000);
	}
	tick();

	$scope.toggleLight = function() {


		var postData = {
			"settings": [{
				"key": "greenhouse.commands.switchLight",
				"value": $scope.light.value === "OFF"
			}]
		};

		restService.sendData($routeParams.deviceId, postData, function(data){console.log(data)}, function(status){console.log(status)});

		console.log('toggleLight')
		console.log(postData)

	}
}