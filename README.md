# node-sensortag

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/sandeepmistry/node-sensortag?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


Node.js lib for the [TI SensorTag](http://www.ti.com/tool/cc2541dk-sensor), [TI CC2650 SensorTag](http://www.ti.com/tool/cc2650stk) and [TI CC1352 SensorTag](https://www.ti.com/tool/LPSTK-CC1352R)

## Prerequisites

 * [node-gyp install guide](https://github.com/nodejs/node-gyp#installation)
 * [noble prerequisites](https://github.com/sandeepmistry/noble#prerequisites)

**NOTE**: Certain API's may not be funcational if your SensorTag is running an older firmware version. You can use TI's iOS or Android apps to update the firmare.

## Install

```sh
npm install sensortag
```

## Examples

See [test.js](test.js) or [sensorTag folder in Tom Igoe's BluetoothLE-Examples repo ](https://github.com/tigoe/BluetoothLE-Examples/tree/master/sensorTag)

## Usage

```javascript
var SensorTag = require('sensortag');
```

### Discover

#### One

```javascript
SensorTag.discover(callback(sensorTag));
```

#### All

```javascript
function onDiscover(sensorTag) {
  // ...
}

SensorTag.discoverAll(onDiscover);

SensorTag.stopDiscoverAll(onDiscover);
```

#### By id

```javascript
SensorTag.discoverById(id, callback(sensorTag));
```

#### By address

```javascript
SensorTag.discoverByAddress(address, callback(sensorTag));
```

#### Properties:

```javascript
sensorTag = {
  id: "<peripheral id>",
  type: "cc2540" | "cc2650"
}
```

### Connect and Set Up

```javascript
sensorTag.connectAndSetUp(callback(error));
```

### Disconnect

```javascript
sensorTag.disconnect(callback);
```

### Disconnect event

Add listener for when SensorTag is disconnected:

```javascript
sensorTag.once('disconnect', callback);
```

### Device Info

```javascript
sensorTag.readDeviceName(callback(error, deviceName));

sensorTag.readSystemId(callback(error, systemId));

sensorTag.readSerialNumber(callback(error, serialNumber));

sensorTag.readFirmwareRevision(callback(error, firmwareRevision));

sensorTag.readHardwareRevision(callback(error, hardwareRevision));

sensorTag.readSoftwareRevision(callback(error, softwareRevision));

sensorTag.readManufacturerName(callback(error, manufacturerName));
```

### IR Temperature Sensor

#### Enable/disable

```javascript
sensorTag.enableIrTemperature(callback(error));

sensorTag.disableIrTemperature(callback(error));

sensorTag.setIrTemperaturePeriod(period, callback(error)); // period min 300ms, default period is 1000 ms
```

#### Read

```javascript
sensorTag.readIrTemperature(callback(error, objectTemperature, ambientTemperature));
```

#### Notify/Unnotify

```javascript
sensorTag.notifyIrTemperature(callback(error));

sensorTag.unnotifyIrTemperature(callback(error));

sensorTag.on('irTemperatureChange', callback(objectTemperature, ambientTemperature));
```

### Accelerometer

#### Enable/disable/configure

```javascript
sensorTag.enableAccelerometer(callback(error));

sensorTag.disableAccelerometer(callback(error));

// CC2540: period 1 - 2550 ms, default period is 2000 ms
// CC2650 and CC1352: period 100 - 2550 ms, default period is 1000 ms
sensorTag.setAccelerometerPeriod(period, callback(error));
```

#### Read
CC2540 and CC2650:
```javascript
sensorTag.readAccelerometer(callback(error, x, y, z));
```

#### Notify/Unnotify
CC2540 and CC2650:
```javascript
sensorTag.notifyAccelerometer(callback(error));

sensorTag.unnotifyAccelerometer(callback(error));

sensorTag.on('accelerometerChange', callback(x, y, z));
```

CC1352:
```javascript
sensorTag.notifyAccelerometer(callback(error));

sensorTag.unnotifyAccelerometer(callback(error));

sensorTag.on('accelerometer_xChange', callback(x));
sensorTag.on('accelerometer_yChange', callback(x));
sensorTag.on('accelerometer_zChange', callback(x));
```

### Humidity Sensor

#### Enable/disable

```javascript
sensorTag.enableHumidity(callback(error));

sensorTag.disableHumidity(callback(error));

sensorTag.setHumidityPeriod(period, callback(error));
```

#### Read

```javascript
sensorTag.readHumidity(callback(error, temperature, humidity));
```

#### Notify/Unnotify

```javascript
sensorTag.notifyHumidity(callback(error));

sensorTag.unnotifyHumidity(callback(error));

sensorTag.on('humidityChange', callback(temperature, humidity));
```

### Magnetometer (TI SensorTag and TI CC2650 SensorTag only)

#### Enable/disable

```javascript
sensorTag.enableMagnetometer(callback(error));

sensorTag.disableMagnetometer(callback(error));

// CC2540: period 1 - 2550 ms, default period is 2000 ms
// CC2650: period 100 - 2550 ms, default period is 1000 ms
sensorTag.setMagnetometerPeriod(period, callback(error));
```

#### Read

```javascript
sensorTag.readMagnetometer(callback(error, x, y, z));
```

#### Notify/Unnotify

```javascript
sensorTag.notifyMagnetometer(callback(error));

sensorTag.unnotifyMagnetometer(callback(error));

sensorTag.on('magnetometerChange', callback(x, y, z));
```

### Barometric Pressure Sensor (TI SensorTag and TI CC2650 SensorTag only)

#### Enable/disable

```javascript
sensorTag.enableBarometricPressure(callback(error));

sensorTag.disableBarometricPressure(callback(error));

sensorTag.setBarometricPressurePeriod(period, callback(error)); // period 100 - 2550 ms
```

#### Read

```javascript
sensorTag.readBarometricPressure(callback(error, pressure));
```

#### Notify/Unnotify

```javascript
sensorTag.notifyBarometricPressure(callback(error));

sensorTag.unnotifyBarometricPressure(callback(error));

sensorTag.on('barometricPressureChange', callback(pressure));
```

### Gyroscope (TI SensorTag and TI CC2650 SensorTag only)

#### Enable/disable/configure

```javascript
sensorTag.enableGyroscope(callback(error));

sensorTag.disableGyroscope(callback(error));

// period 100 - 2550 ms, default period is 1000 ms
sensorTag.setGyroscopePeriod(period, callback(error));
```

#### Read

```javascript
sensorTag.readGyroscope(callback(error, x, y, z));
```

#### Notify/Unnotify

```javascript
sensorTag.notifyGyroscope(callback(error));

sensorTag.unnotifyGyroscope(callback(error));

sensorTag.on('gyroscopeChange', callback(x, y, z));
```

### IO (CC2650 only)

#### Data read/write

```javascript
sensorTag.readIoData(callback(error, value));
sensorTag.writeIoData(value, callback(error));
```

#### Config read/write

```javascript
sensorTag.readIoConfig(callback(error, value));
sensorTag.writeIoConfig(value, callback(error));
```

### Luxometer (CC2650 and CC1352 only)

#### Enable/disable/configure

```javascript
sensorTag.enableLuxometer(callback(error));

sensorTag.disableLuxometer(callback(error));

sensorTag.setLuxometerPeriod(period, callback(error));
```

#### Read

```javascript
sensorTag.readLuxometer(callback(error, lux));
```

#### Notify/Unnotify

```javascript
sensorTag.notifyLuxometer(callback(error));

sensorTag.unnotifyLuxometer(callback(error));

sensorTag.on('luxometerChange', callback(lux));
```

### Battery Level (CC2650 and CC1352 only)

#### Read

```javascript
sensorTag.readBatteryLevel(callback(error, batteryLevel));
```

### Simple Key

#### Notify/Unnotify

CC2540:

```javascript
sensorTag.notifySimpleKey(callback(error));

sensorTag.unnotifySimpleKey(callback(error));
```

```javascript
sensorTag.on('simpleKeyChange', callback(left, right));
```

CC2650:

```javascript
sensorTag.notifySimpleKey(callback(error));

sensorTag.unnotifySimpleKey(callback(error));
```

```javascript
sensorTag.on('simpleKeyChange', callback(left, right, reedRelay));
```

CC1352:
key:
- 0 (left button)
- 1 (right button)

event:
- 0x00 (released)
- 0x01 (pressed)
- 0xB1 (hold)

```javascript
sensorTag.notifyButton(callback(error));

sensorTag.unnotifyButton(callback(error));
```

```javascript
sensorTag.on('button_0Change', callback(key, event));
```

```javascript
sensorTag.on('button_1Change', callback(key, event));
```

```javascript
sensorTag.on('button_2Change', callback(key, event));
```


### LEDs (C1352 only)
ledNum:
- 0 (red)
- 1 (green)
- 2 (blue)

#### Switch on
```javascript
sensorTag.writeLed(ledNum, 1);
```

#### Switch off
```javascript
sensorTag.writeLed(ledNum, 0);
```
