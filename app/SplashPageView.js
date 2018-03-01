import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AppState,
  Alert
} from 'react-native';
import {NavigationActions} from 'react-navigation'
import Swiper from 'react-native-swiper';
//hot reload
import codePush from 'react-native-code-push'
import Push from 'appcenter-push'

const styles = StyleSheet.create({
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
})

const SplashPageView = (props) => {
  codePush.getUpdateMetadata().then(localPackage => {
            if (localPackage == null) {
                console.log('codepush find no localPackage')
            } else {
                console.log('has localPackage')
            }
        })
    return (
      <Swiper style={styles.wrapper} loop={false}>
        <View style={styles.slide1}>
          <Text style={styles.text}>Goforeat</Text>
        </View>
        <View style={styles.slide2}>
          <Text style={styles.text}>HK</Text>
        </View>
        <View style={styles.slide3} >
          <TouchableOpacity onPress={() => {
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate( { routeName: 'Home',params:{refresh:true}} )
                ],
            });
            props.navigation.dispatch(resetAction);
          }}>
            <Text style={styles.text}>進入主頁</Text>
          </TouchableOpacity>
        </View>
      </Swiper>
    )
}

Push.setListener({
  onPushNotificationReceived: function (pushNotification) {
    let message = pushNotification.message;
    let title = pushNotification.title;

    if (message === null || message === undefined) {
      // Android messages received in the background don't include a message. On Android, that fact can be used to
      // check if the message was received in the background or foreground. For iOS the message is always present.
      title = 'Android background';
      message = '<empty>';
    }

    // Custom name/value pairs set in the App Center web portal are in customProperties
    if (pushNotification.customProperties && Object.keys(pushNotification.customProperties).length > 0) {
      message += '\nCustom properties:\n' + JSON.stringify(pushNotification.customProperties);
    }

    if (AppState.currentState === 'active') {
      Alert.alert(title, message);
    }
    else {
      // Sometimes the push callback is received shortly before the app is fully active in the foreground.
      // In this case you'll want to save off the notification info and wait until the app is fully shown
      // in the foreground before displaying any UI. You could use AppState.addEventListener to be notified
      // when the app is fully in the foreground.
    }
  }
});

export default SplashPageView
