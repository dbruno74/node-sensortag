// for documentation, download TI SIMPLELINK SDK 
// https://www.ti.com/tool/download/SIMPLELINK-CC13X2-26X2-SDK?keyMatch=SIMPLELINK%20CC13X2%2026X2%20SDK%204%2020%2000%2035&amp;tisearch=Search-EN-everything
// Documentation can be found here: simplelink_cc13x2_26x2_sdk_4_20_00_35/examples/rtos/CC1352R1_LAUNCHXL/ble5stack/multi_sensor/README.md

var NobleDevice = require('@ppatierno/noble-device');

var Common = require('./common');

var LUXOMETER_UUID                          = 'f000aa7004514000b000000000000000';

var LUXOMETER_CONFIG_UUID                   = 'f000aa7204514000b000000000000000';
var LUXOMETER_DATA_UUID                     = 'f000aa7104514000b000000000000000';
var LUXOMETER_PERIOD_UUID                   = 'f000aa7304514000b000000000000000';

var ACCELEROMETER_UUID			    = 'f000ffa004514000b000000000000000';
var ACCELEROMETER_DATA_X_UUID               = 'f000ffa304514000b000000000000000';
var ACCELEROMETER_DATA_Y_UUID               = 'f000ffa404514000b000000000000000';
var ACCELEROMETER_DATA_Z_UUID               = 'f000ffa504514000b000000000000000';
var ACCELEROMETER_CONFIG_UUID		    = 'f000ffa104514000b000000000000000';

var BUTTON_UUID                             = 'f000112004514000b000000000000000';
var BUTTON_DATA_0_UUID                      = 'f000112104514000b000000000000000';
var BUTTON_DATA_1_UUID                      = 'f000112204514000b000000000000000';

var BATTERY_UUID                            = 'f000180f04514000b000000000000000';
var BATTERY_LEVEL_UUID                      = 'f0002a1904514000b000000000000000';

var LED_UUID				    = 'f000111004514000b000000000000000';
var LED0_STATE				    = 'f000111104514000b000000000000000';
var LED1_STATE				    = 'f000111204514000b000000000000000';
var LED2_STATE				    = 'f000111304514000b000000000000000';


var CC1352SensorTag = function(peripheral) {
  NobleDevice.call(this, peripheral);
  Common.call(this);

  this.type = 'cc1352';

  this.onLuxometerChangeBinded       = this.onLuxometerChange.bind(this);
  this.onAccelerometer_xChangeBinded   = this.onAccelerometer_xChange.bind(this);
  this.onAccelerometer_yChangeBinded   = this.onAccelerometer_yChange.bind(this);
  this.onAccelerometer_zChangeBinded   = this.onAccelerometer_zChange.bind(this);
  this.onButton_0ChangeBinded = this.onButton_0Change.bind(this);
  this.onButton_1ChangeBinded = this.onButton_1Change.bind(this);
  this.onBatteryLevelChangeBinded = this.onBatteryLevelChange.bind(this);
};

CC1352SensorTag.is = function(peripheral) {
  var localName = peripheral.advertisement.localName;

  return (localName === 'Multi-Sensor');
};

NobleDevice.Util.inherits(CC1352SensorTag, NobleDevice);
NobleDevice.Util.mixin(CC1352SensorTag, NobleDevice.DeviceInformationService);
NobleDevice.Util.mixin(CC1352SensorTag, Common);


CC1352SensorTag.prototype.convertIrTemperatureData = function(data, callback) {
  var ambientTemperature = data.readFloatLE(0);
  var objectTemperature = NaN;                             // object temperature not available
  
  callback(objectTemperature, ambientTemperature);
}

CC1352SensorTag.prototype.convertHumidityData = function(data, callback) {
  var temperature = NaN;                                  // temperature not available
  var humidity = data.readFloatLE(0);

  callback(temperature, humidity);
};

CC1352SensorTag.prototype.enableAccelerometer = function(callback) {
  this.enableConfigCharacteristic(ACCELEROMETER_UUID, ACCELEROMETER_CONFIG_UUID, callback);
};

CC1352SensorTag.prototype.disableAccelerometer = function(callback) {
  this.disableConfigCharacteristic(ACCELEROMETER_UUID, ACCELEROMETER_CONFIG_UUID, callback);
};

CC1352SensorTag.prototype.notifyAccelerometer = function(callback) {
  this.notifyCharacteristic(ACCELEROMETER_UUID, ACCELEROMETER_DATA_X_UUID, true, this.onAccelerometer_xChangeBinded, callback);
  this.notifyCharacteristic(ACCELEROMETER_UUID, ACCELEROMETER_DATA_Y_UUID, true, this.onAccelerometer_yChangeBinded, callback);
  this.notifyCharacteristic(ACCELEROMETER_UUID, ACCELEROMETER_DATA_Z_UUID, true, this.onAccelerometer_zChangeBinded, callback);
};

CC1352SensorTag.prototype.unnotifyAccelerometer = function(callback) {
  this.notifyCharacteristic(ACCELEROMETER_UUID, ACCELEROMETER_DATA_X_UUID, false, this.onAccelerometer_xChangeBinded, callback);
  this.notifyCharacteristic(ACCELEROMETER_UUID, ACCELEROMETER_DATA_Y_UUID, false, this.onAccelerometer_yChangeBinded, callback);
  this.notifyCharacteristic(ACCELEROMETER_UUID, ACCELEROMETER_DATA_Z_UUID, false, this.onAccelerometer_zChangeBinded, callback);
};

CC1352SensorTag.prototype.notifyButton = function(callback) {
  this.notifyCharacteristic(BUTTON_UUID, BUTTON_DATA_0_UUID, true, this.onButton_0ChangeBinded, callback);
  this.notifyCharacteristic(BUTTON_UUID, BUTTON_DATA_1_UUID, true, this.onButton_1ChangeBinded, callback);
};

CC1352SensorTag.prototype.unnotifyButton = function(callback) {
  this.notifyCharacteristic(BUTTON_UUID, BUTTON_DATA_0_UUID, false, this.onButton_0ChangeBinded, callback);
  this.notifyCharacteristic(BUTTON_UUID, BUTTON_DATA_1_UUID, false, this.onButton_1ChangeBinded, callback);
};

CC1352SensorTag.prototype.enableLuxometer = function(callback) {
  this.enableConfigCharacteristic(LUXOMETER_UUID, LUXOMETER_CONFIG_UUID, callback);
};

CC1352SensorTag.prototype.disableLuxometer = function(callback) {
  this.disableConfigCharacteristic(LUXOMETER_UUID, LUXOMETER_CONFIG_UUID, callback);
};

CC1352SensorTag.prototype.readLuxometer = function(callback) {
  this.readDataCharacteristic(LUXOMETER_UUID, LUXOMETER_DATA_UUID, function(error, data) {
    if (error) {
      return callback(error);
    }

    this.convertLuxometerData(data, function(lux) {
      callback(null, lux);
    }.bind(this));
  }.bind(this));
 };

CC1352SensorTag.prototype.onLuxometerChange = function(data) {
  this.convertLuxometerData(data, function(lux) {
    this.emit('luxometerChange', lux);
  }.bind(this));
};

CC1352SensorTag.prototype.onAccelerometer_xChange = function(data) {
  this.convertAccelerometerData(data, function(coord) {
    this.emit('accelerometer_xChange', coord.readInt16LE(0));
  }.bind(this));
};

CC1352SensorTag.prototype.onAccelerometer_yChange = function(data) {
  this.convertAccelerometerData(data, function(coord) {
    this.emit('accelerometer_yChange', coord.readInt16LE(0));
  }.bind(this));
};

CC1352SensorTag.prototype.onAccelerometer_zChange = function(data) {
  this.convertAccelerometerData(data, function(coord) {
    this.emit('accelerometer_zChange', coord.readInt16LE(0));
  }.bind(this));
};

CC1352SensorTag.prototype.onButton_0Change = function(data) {
  this.convertButtonData(data, function(event) {
    this.emit('button_0Change', 0, event);
  }.bind(this));
};

CC1352SensorTag.prototype.onButton_1Change = function(data) {
  this.convertButtonData(data, function(event) {
    this.emit('button_1Change', 1, event);
  }.bind(this));
};


CC1352SensorTag.prototype.convertAccelerometerData = function (data, callback) {

  var coord = data;
  
  callback(coord);
}; 

CC1352SensorTag.prototype.convertButtonData = function (data, callback) {

  var event=data.readUInt8(0);
  
  callback(event);
}; 

CC1352SensorTag.prototype.convertLuxometerData = function(data, callback) {

  var flLux = data.readFloatLE(0);

  callback(flLux);
};

CC1352SensorTag.prototype.notifyLuxometer = function(callback) {
  this.notifyCharacteristic(LUXOMETER_UUID, LUXOMETER_DATA_UUID, true, this.onLuxometerChangeBinded, callback);
};

CC1352SensorTag.prototype.unnotifyLuxometer = function(callback) {
  this.notifyCharacteristic(LUXOMETER_UUID, LUXOMETER_DATA_UUID, false, this.onLuxometerChangeBinded, callback);
};

CC1352SensorTag.prototype.setLuxometerPeriod = function(period, callback) {
  this.writePeriodCharacteristic(LUXOMETER_UUID, LUXOMETER_PERIOD_UUID, period, callback);
};

CC1352SensorTag.prototype.readBatteryLevel = function(callback) {
  this.readUInt8Characteristic(BATTERY_UUID, BATTERY_LEVEL_UUID, callback);
};

CC1352SensorTag.prototype.onBatteryLevelChange = function (data) {
  this.emit('batteryLevelChange', data.readUInt8(0));
};
  
CC1352SensorTag.prototype.notifyBatteryLevel = function (callback) {
  this.onBatteryLevelChangeBinded       = this.onBatteryLevelChange.bind(this);
  this.notifyCharacteristic(BATTERY_UUID, BATTERY_LEVEL_UUID, true, this.onBatteryLevelChangeBinded, callback);
};

CC1352SensorTag.prototype.unnotifyBatteryLevel = function (callback) {
  this.notifyCharacteristic(BATTERY_UUID, BATTERY_LEVEL_UUID, false, this.onBatteryLevelChangeBinded, callback);
};

CC1352SensorTag.prototype.writeLed = function(ledNum, value, callback) {
  if (ledNum === 0) {
     this.writeUInt8Characteristic(LED_UUID, LED0_STATE, value, callback);
  }
  if (ledNum === 1) {
     this.writeUInt8Characteristic(LED_UUID, LED1_STATE, value, callback);
  }
  if (ledNum === 2) {
     this.writeUInt8Characteristic(LED_UUID, LED2_STATE, value, callback);
  }
};


module.exports = CC1352SensorTag;
