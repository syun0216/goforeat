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
