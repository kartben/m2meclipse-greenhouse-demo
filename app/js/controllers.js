'use strict';

// Notification system configuration
var toastrConf = {
  positionClass: 'toast-bottom-full-width'
};

// utility functions
function formatDate(date) {

  function makeDateValidString(number) {
    if (number >= 10) return number.toString();
    return '0' + number.toString();
  }

  var formattedDate = date.getFullYear() + '-';
  formattedDate += makeDateValidString(date.getMonth() + 1) + '-';
  formattedDate += makeDateValidString(date.getDate()) + ' ';
  formattedDate += makeDateValidString(date.getHours()) + ':';
  formattedDate += makeDateValidString(date.getMinutes()) + ':';
  formattedDate += makeDateValidString(date.getSeconds());
  return formattedDate;
}

/* Controllers */
function GreenHouseCtrl($scope, $restservice, $timeout) {

  var assetName = "greenhouse";
  var lastacknowledge = 0;

  // init svg scope
  $scope.dataset = [];

  // init alert container
  $scope.alerts = [];

  $scope.acknowledgeAlert = function(index) {
    $scope.alerts.splice(index, 1);
    lastacknowledge = new Date().getTime();
  };

  function formatNumber(value) {
    return parseFloat(value).toFixed(2);
  }

  function tick() {
    $restservice.getGreenData(function(data) {

      $timeout(tick, 10000);

      // Detemine button style from fresh values
      $scope.light = data.light;
      $scope.shield = data.shield;

      // Round given values
      $scope.luminosity = formatNumber(data.luminosity);
      $scope.temperature = formatNumber(data.temperature);
      $scope.humidity = formatNumber(data.humidity);

      // manage alarm if it is triggered
      var tempAlarmValue = data.temperatureAlarm;
      var tempAlarmTimestamp = data.temperatureTimestamp;

      if (tempAlarmValue && tempAlarmTimestamp > lastacknowledge) {
        if ($scope.alerts.length > 0) {
          $scope.alerts[0].msg = "Temperature exceeds 40 °C since " + formatDate(new Date(tempAlarmTimestamp));
        } else {
          $scope.alerts[0] = {
            type: "error",
            msg: "Temperature exceeds 40 °C since " + formatDate(new Date(tempAlarmTimestamp))
          };
        }
      } else {
        $scope.alerts.splice(0, 1);
      }

      // for svg
      $scope.dataset.push({
        timestamp: new Date().getTime(),
        humidity: parseFloat(data.humidity),
        temperature: parseFloat(data.temperature),
        luminosity: parseFloat(data.humidity)
      });

    }, function(data, status) {
      // errorHandler
    });
  }
  ;

  function clock() {
    $scope.currentTime = new Date().getTime();
    $timeout(clock, 1000);
  }

  var toggleCommand = function(commandId, newStatus, label) {

    if (!label) label = commandId;

    $restservice.toggleCommand(commandId, newStatus,
    // handle success
    function(data, status) {
      var msg = label + ': ' + (newStatus ? 'on' : 'off') + '.';
      toastr.success(msg, null, toastrConf);
    },
    // handle no app
    function(data, status) {
      var msg = 'Unable to send: ' + label + '.';
      toastr.error(msg, null, toastrConf);
      console.log('Unable to fetch application UID.');
      console.log('Error ' + status + ', ' + data.error + '.');
    },
    // handle command error
    function(data, status) {
      var msg = label + ':' + (newStatus ? 'on' : 'off') + '. Unable to send command.';
      toastr.error(msg, null, toastrConf);
      console.log('Unable to change light status.');
      console.log('Error ' + status + ', ' + data.error + '.');
    });
  };

  tick();

  clock();

  $scope.toggleLight = function(value) {
    return toggleCommand(assetName + ".commands.switchLight", value, 'Light command');
  };
  $scope.toggleShield = function(value) {
    return toggleCommand(assetName + ".commands.switchShield", value, 'Shield command');
  };
}

function DeviceStatusCtrl($scope, $restservice, $timeout) {

  var communicationClasses = {};
  communicationClasses['Error'] = 'label label-important';
  communicationClasses['Ok'] = 'label';
  communicationClasses['Undefined'] = 'label label-inverse';
  communicationClasses['Warning'] = 'label label-warning';

  function tick() {

    $restservice.getCommStatus(function(data) {
      $timeout(tick, 10000);

      var date = new Date(data.lastCommDate);
      $scope.lastcommdate = formatDate(date);

    }, function(data, status) {
      // error handler
    });
  }
  ;
  tick();
}
