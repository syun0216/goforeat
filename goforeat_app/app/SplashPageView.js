import React,{Component} from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AppState,
  Alert
} from "react-native";
import { NavigationActions } from "react-navigation";
import Swiper from "react-native-swiper";
//hot reload
import CodePush from "react-native-code-push";
import CodePushUtils from "./utils/CodePushUtils";
import Push from "appcenter-push";
import * as TextUtils from "./utils/TextUtils";
import * as JSONUtils from "./utils/JSONUtils";

const styles = StyleSheet.create({
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB"
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97CAE5"
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#92BBD9"
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold"
  }
});

export default class SplashPageView extends Component {

  componentDidMount = () => {
    CodePush.getUpdateMetadata().then(localPackage => {
      // console.log(localPackage);
      if (localPackage == null) {
          this._checkForUpdate();
          
      } else {
          if (localPackage.isPending) {
              localPackage.install(CodePush.InstallMode.ON_NEXT_RESUME)
          } else {
              this._checkForUpdate();
          }
      }
    })
  }

  // logic - update

  _checkForUpdate = () => {
    CodePush.checkForUpdate(CodePushUtils.getDeploymentKey('staging')).then(remotePackage => {
      // console.log(remotePackage);
        if (remotePackage == null) {
            return;
        }
        this._syncInNonSilent(remotePackage);
        // if (TextUtils.isEmpty(remotePackage.description)) {
        //     this._syncInSilent(remotePackage);
        // } else {
        //     JSONUtils.parseJSONFromString(remotePackage.description, (resultJSON) => {
        //         if (resultJSON.isSilentSync != null && !resultJSON.isSilentSync) {
        //             this._syncInNonSilent(remotePackage);
        //         } else {
        //             this._syncInSilent(remotePackage);
        //         }
        //     }, (error) => {
        //         this._syncInSilent(remotePackage);
        //     });
        // }
    })
}
  // logic - update - silent

  _syncInSilent = remotePackage => {
    remotePackage.download().then(localPackage => {
      if (localPackage != null) {
        localPackage.install(CodePush.InstallMode.ON_NEXT_RESUME);
      } else {
      }
    });
  };
  // logic - update - no silent

  _syncInNonSilent = remotePackage => {
    if (remotePackage.isMandatory) {
      Alert.alert(null, "更新到最新版本", [
        {
          text: "明白"
        }
      ]);

      setTimeout(
        () => this._downloadMandatoryNewVersionWithRemotePackage(remotePackage),
        1000
      );
      return;
    } else {
      Alert.alert(null, "有新功能,是否现在更新？", [
        { text: "以后再说" },
        {
          text: "现在更新",
          onPress: () => {
            this._downloadNewVersionWithRemotePackage(remotePackage);
          }
        }
      ]);
    }
  };

  _downloadNewVersionWithRemotePackage = remotePackage => {
    ToastUtils.showWithMessage("新版本正在下载,请稍等...");
    remotePackage.download().then(localPackage => {
      if (localPackage != null) {
        Alert.alert(null, "下载完成,是否安装?", [
          {
            text: "下次安装",
            onPress: () => {
              localPackage.install(CodePush.InstallMode.ON_NEXT_RESUME);
            }
          },
          {
            text: "现在安装",
            onPress: () => {
              localPackage.install(CodePush.InstallMode.IMMEDIATE);
            }
          }
        ]);
      } else {
        // if (DebugStatus.isDebug()) {
        //     console.log("新版本下载失败");
        // }
      }
    });
  };

  _downloadMandatoryNewVersionWithRemotePackage = remotePackage => {
    props.navigation.navigate('Mandatory',{
      remotePackage: remotePackage
    })
  }

  render() {
    return (
      <Swiper style={styles.wrapper} loop={false}>
        {/*<View style={styles.slide1}>
          <Text style={styles.text}>Goforeat</Text>
        </View>
        <View style={styles.slide2}>
          <Text style={styles.text}>HK</Text>
    </View> */}
        <View style={styles.slide3}>
          <TouchableOpacity
            onPress={() => {
              const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: "Home",
                    // params: { refresh: true }
                  })
                ]
              });
              this.props.navigation.dispatch(resetAction);
            }}
          >
            <Text style={styles.text}>進入主頁</Text>
          </TouchableOpacity>
        </View>
      </Swiper>
    )
  }
};

// import React from 'react';
// import {
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet
// } from 'react-native';

// import Push from 'appcenter-push';

// export default class SplashPageView extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       pushEnabled: false
//     };
//     this.toggleEnabled = this.toggleEnabled.bind(this);
//   }

//   async componentDidMount() {
//     const component = this;

//     const pushEnabled = await Push.isEnabled();
//     component.setState({ pushEnabled });
//   }

//   async toggleEnabled() {
//     await Push.setEnabled(!this.state.pushEnabled);

//     const pushEnabled = await Push.isEnabled();
//     this.setState({ pushEnabled });
//   }

//   render() {
//     return (
//       <View style={SharedStyles.container}>
//         <ScrollView >
//           <Text style={SharedStyles.heading}>
//             Test Push
//           </Text>

//           <Text style={SharedStyles.enabledText}>
//             Push enabled: {this.state.pushEnabled ? 'yes' : 'no'}
//           </Text>
//           <TouchableOpacity onPress={this.toggleEnabled}>
//             <Text style={SharedStyles.toggleEnabled}>
//               toggle
//             </Text>
//           </TouchableOpacity>

//         </ScrollView>
//       </View>
//     );
//   }
// }

// const SharedStyles = StyleSheet.create({
//   heading: {
//     fontSize: 24,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   button: {
//     color: '#4444FF',
//     fontSize: 18,
//     textAlign: 'center',
//     margin: 10,
//   },
//   enabledText: {
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   toggleEnabled: {
//     color: '#4444FF',
//     fontSize: 14,
//     textAlign: 'center',
//     marginBottom: 10,
//   },
// });
