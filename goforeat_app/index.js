import { AppRegistry,AppState,Alert } from 'react-native';
import App from './App';
global.PaymentRequest = require('react-native-payments').PaymentRequest;

AppRegistry.registerComponent('goforeat_app', () => App);
