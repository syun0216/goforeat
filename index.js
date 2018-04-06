import { AppRegistry,AppState,Alert } from 'react-native';
import App from './App';
import Push from 'appcenter-push';


AppRegistry.registerComponent('goforeat_app', () => App);

Push.setListener({
	onPushNotificationReceived: pushNotification => {
    console.log(112312321321312321);
		let message = pushNotification.message;
		let title = pushNotification.title;
		let customProperties = [];
		let timestamp = Date.now();

		// Custom name/value pairs set in the App Center web portal are in customProperties
		if (
			pushNotification.customProperties &&
			Object.keys(pushNotification.customProperties).length > 0
		) {
			customProperties = pushNotification.customProperties;
		}

		Alert.alert(title, message);
	},
});
