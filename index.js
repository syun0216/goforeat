/**
 * @format
 */

import { AppRegistry,AppState,Alert } from 'react-native';
import App from './App';
global.PaymentRequest = require('react-native-payments').PaymentRequest;

import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
