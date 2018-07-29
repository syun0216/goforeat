import React, { Component } from 'react';
import {AppState,Alert} from 'react-native';
//codepush
import CodePush from 'react-native-code-push';
import CodePushUtils from '../utils/CodePushUtils';
import * as TextUtils from "../utils/TextUtils";
import * as JSONUtils from "../utils/JSONUtils";
//language
import I18n from '../language/i18n';

const HotReloadHOC = WarppedComponent => class extends Component {

  static navigationOptions = WarppedComponent.navigationOptions;
  constructor(props) {
    super(props);
    this.state = {
      i18n: I18n[props.screenProps.language]
    }
  }


  componentDidMount() {
    AppState.addEventListener('change',(nextState) => {
      if(nextState == 'active') {
        CodePush.getUpdateMetadata().then(localPackage => {
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
    let {i18n} = this.state;
    if (remotePackage.isMandatory) {
      Alert.alert(null, `${i18n.hot_reload_tips.update_details}\n ${remotePackage.description}`, [
        {
          text: i18n.hot_reload_tips.understand,
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
      Alert.alert(null, i18n.hot_reload_tips.has_new_function, [
        { text: i18n.hot_reload_tips.not_now },
        {
          text: i18n.hot_reload_tips.update_now,
          onPress: () => {
            this._downloadNewVersionWithRemotePackage(remotePackage);
          }
        }
      ]);
    }
  };

  _downloadNewVersionWithRemotePackage = remotePackage => {
    let {i18n} = this.state;
    ToastUtils.showWithMessage(i18n.hot_reload_tips.newversion_downloading);
    remotePackage.download().then(localPackage => {
      if (localPackage != null) {
        Alert.alert(null, i18n.hot_reload_tips.download_now, [
          {
            text: i18n.hot_reload_tips.install_nexttime,
            onPress: () => {
              localPackage.install(CodePush.InstallMode.ON_NEXT_RESUME);
            }
          },
          {
            text: i18n.hot_reload_tips.install_now,
            onPress: () => {
              localPackage.install(CodePush.InstallMode.IMMEDIATE);
            }
          }
        ]);
      } else {
        // if (DebugStatus.isDebug()) {
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