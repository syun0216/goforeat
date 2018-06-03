import React, { Component } from 'react';
import {AppState,Alert} from 'react-native';
//codepush
import CodePush from 'react-native-code-push';
import CodePushUtils from '../utils/CodePushUtils';
import * as TextUtils from "../utils/TextUtils";
import * as JSONUtils from "../utils/JSONUtils";

const HotReloadHOC = WarppedComponent => class extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    AppState.addEventListener('change',(nextState) => {
      if(nextState == 'active') {
        CodePush.getUpdateMetadata().then(localPackage => {
          console.log(123,localPackage);
          if (localPackage == null) {
              this._checkForUpdate();
              
          } else {
              if (localPackage.isPending) {
                  localPackage.install(CodePush.InstallMode.ON_NEXT_RESUME)
              } else {
                  this._checkForUpdate();
              }
          }
      });
      }
    })
  }

  componentWillUnmount() {
    AppState.removeEventListener('change');
  }

  // logic - update

  _checkForUpdate() {
    CodePush.checkForUpdate(CodePushUtils.getDeploymentKey()).then(remotePackage => {
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
      Alert.alert(null, `更新到最新版本,更新內容為：\n ${remotePackage.description}`, [
        {
          text: "明白",
          onPress: () => {
            this._downloadMandatoryNewVersionWithRemotePackage(remotePackage)
          }
        }
      ]);

      // setTimeout(
      //   () => this._downloadMandatoryNewVersionWithRemotePackage(remotePackage),
      //   1000
      // );
      return;
    } else {
      Alert.alert(null, "有新功能,是否現在立即更新？", [
        { text: "以後再說" },
        {
          text: "立即更新",
          onPress: () => {
            this._downloadNewVersionWithRemotePackage(remotePackage);
          }
        }
      ]);
    }
  };

  _downloadNewVersionWithRemotePackage = remotePackage => {
    ToastUtils.showWithMessage("新版本正在下載,請稍候...");
    remotePackage.download().then(localPackage => {
      if (localPackage != null) {
        Alert.alert(null, "下載完成,是否立即安裝?", [
          {
            text: "下次安裝",
            onPress: () => {
              localPackage.install(CodePush.InstallMode.ON_NEXT_RESUME);
            }
          },
          {
            text: "現在安裝",
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
    this.props.navigation.navigate('Mandatory',{
      remotePackage: remotePackage
    })
  }

  render() {
    return (
      <WarppedComponent {...this.props}/>
    )
  }
}

export default HotReloadHOC;