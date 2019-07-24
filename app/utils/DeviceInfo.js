import DeviceInfo from 'react-native-device-info';

export function getVersion() {
  return DeviceInfo.getVersion();
}

export function getLanguage() {
  return DeviceInfo.getDeviceLocale();
}

export function getDeviceId() {
  return DeviceInfo.getDeviceId();
}

export function isDebugVersion() {
  let _version = DeviceInfo.getVersion();
  return _version.split('.')[0] == 0; //以0开头的则为debug版本 其他为正式版
}

export function isIphoneXr() {
  return getDeviceId() == 'iPhone11,8';
}