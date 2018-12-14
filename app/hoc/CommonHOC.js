import React, {Component} from 'react';
import { Platform,  AppState, Alert, Image } from 'react-native';
import {Container, Input} from 'native-base';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import Share from 'react-native-share';
//codepush
import CodePush from 'react-native-code-push';
import CodePushUtils from '../utils/CodePushUtils';
//jpush
import JPushModule from 'jpush-react-native';
//utils
import { _winWidth, _winHeight, em} from '../utils/global_params';
import ToastUtils from '../utils/ToastUtil';
//components
import CommonComment from '../components/CommonComment';
import LoadingModal from '../components/LoadingModal';
import CommonModal from '../components/CommonModal';
import LoginView from '../CustomLoginView';
//language
import I18n from '../language/i18n';

const lastBackPressed = Date.now();


const jpushCommonUrlDefined = {
  url: 1, // web页面
  schema: 2 //普通的app页面
}

// jpush 跳转页面example
/*
  url = {
    title: '一日一味餸,日日有得食',
    url: 'https://v.xiumi.us/board/v5/3Clvd/102129725',
    type: 1
  }

  schema = {
    extraParams: {
      ...
    },
    schema: 'Food',
    type: 2
  }
*/ 

const CommonHOC = WarppedComponent => class extends Component {

  static navigationOptions = WarppedComponent.navigationOptions;

  constructor(props) {
    super(props);
 
    this.state = {
      i18n: I18n[props.screenProps.language],
      LoadingModal: false
    };  
  }

  componentDidMount() {
    console.log(1111,this.props);
    this._jpushDidMount();
    AppState.addEventListener('change',(nextState) => {
      if(nextState == 'active') {
        // this._commentPopup();
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
    });
  }

  componentWillUnmount() {
    // AppState.removeEventListener('change');
    JPushModule.removeReceiveNotificationListener('receiveNotification');
    // this._removeBackAndroidHandler();
  }

  //api

  _showLoadingModal() {
    this.setState({
      LoadingModal: true
    })
  }

  _hideLoadingModal() {
    this.setState({
      LoadingModal: false
    })
  }

  // ---------------------jpush&codepush&backAndroidHandler

  // jpush did mounted
  _jpushDidMount() {
    if(Platform.OS == 'android') {
      this._jpush_android_setup()
    }else {
      JPushModule.setupPush()
    }    
    this._jpushCommonEvent();
  }

  _jpush_android_setup() {
    JPushModule.initPush();
    JPushModule.notifyJSDidLoad(resultCode => {
      if (resultCode === 0) {
      }
    })
  }

  _jpushCommonEvent() {
    if(Platform.OS == 'ios') {
      JPushModule.setBadge(0, success => {})
    }
    JPushModule.addReceiveOpenNotificationListener(map => {
      if(typeof map.extras['type'] != "undefined") {
        switch(map.extras.type) {
          case jpushCommonUrlDefined.url: {
            this.props.navigation.navigate("Content", {data: map.extras,kind: 'jpush'});
          };break;
          case jpushCommonUrlDefined.schema: {
            this.props.navigation.navigate(map.extras.schema, {...map.extras.extraParams})
          };break;
        }
      } 
    })
  }

  // logic - update

  _checkForUpdate() {
    CodePush.checkForUpdate(CodePushUtils.getDeploymentKey()).then(remotePackage => {
        if (remotePackage == null) {
            return;
        }
        this._syncInNonSilent(remotePackage);
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
  // ---------------------------end

  _renderLoginModal() {
    return (
      <CommonModal isHeaderShow={false} modalVisible={this.props.screenProps.showLogin}>
        <LoginView {...this.props}/>
      </CommonModal>
    )
  }

  render() {
    let {i18n} = this.state;
    return (
      <Container>
        {this.state.LoadingModal ? <LoadingModal /> : null}
        {this._renderLoginModal()}
        <CommonComment />
        <WarppedComponent ref={w => this.WarppedComponent = w} {...this.props} showLoading={this._showLoadingModal.bind(this)} hideLoading={this._hideLoadingModal.bind(this)} i18n={i18n}/>
      </Container>
    )
  }
}



export default CommonHOC;