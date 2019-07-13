import React, { Component } from "react";
import { Platform, AppState, Alert, Linking } from "react-native";
import { Container } from "native-base";
import { connect } from "react-redux";
import {isNil} from "lodash";
//api
import {getVersionFromServer, versionCode} from "../api/request";;
//codepush
import CodePush from "react-native-code-push";
import CodePushUtils from "../utils/CodePushUtils";
//jpush
import JPushModule from "jpush-react-native";
//utils
import { _winWidth, _winHeight, em } from "../utils/global_params";
import ToastUtils from "../utils/ToastUtil";
import {getVersion} from "../utils/DeviceInfo";
//components
import CommonComment from "../components/CommonComment";
import LoadingModal from "../components/LoadingModal";
import Loading from "../components/Loading";
import CommonModal from "../components/CommonModal";
import LoginView from "../CustomLoginView";
//language
import I18n from "../language/i18n";
//actions
import { SAVE_CACHE, RESET_CACHE, SHOW_LOADING, SHOW_LOADING_MODAL, HIDE_LOADING, HIDE_LOADING_MODAL } from "../actions";

const lastBackPressed = Date.now();

const jpushCommonUrlDefined = {
  url: "1", // web页面
  schema: "2" //普通的app页面
};

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

const CommonHOC = WarppedComponent => {
  class Basic extends Component {
    static navigationOptions = WarppedComponent.navigationOptions;
    constructor(props) {
      super(props);
      this.showUpdateAlert = false;
      this.showCodePushAlert = false;
      this.nextState = null;
      this.state = {
        i18n: I18n[props.language],
      };
    }

    componentDidMount() {
      this._jpushDidMount();
      this.props.isLoading && this.props.hideLoading();
      let _appStateTimer = null
      AppState.addEventListener("change", nextState => {
        console.log(nextState);
        if(this.nextState == nextState) return;
        if (nextState == "active") {
          // this._commentPopup();
          if(_appStateTimer) clearTimeout(_appStateTimer);
          _appStateTimer = setTimeout(() => {
            this._checkVersion();
            CodePush.getUpdateMetadata().then(localPackage => {
              if (localPackage == null) {
                this._checkForUpdate();
              } else {
                if (localPackage.isPending) {
                  localPackage.install(CodePush.InstallMode.ON_NEXT_RESUME);
                } else {
                  this._checkForUpdate();
                }
              }
            });
            clearTimeout(_appStateTimer);
          }, 1000);
        } else if (nextState == "background") {
          // 清除缓存
          this.props.resetPageCache();
        }
      });
    }

    componentWillUnmount() {
      // AppState.removeEventListener('change');
      JPushModule.removeReceiveNotificationListener("receiveNotification");
      // this._removeBackAndroidHandler();
    }

    //versionControll
    _checkVersion() {
      const _formatVersionIntoNumber = version => parseInt(version.split('.').join(""));
      let _curVersion = _formatVersionIntoNumber(getVersion());// 当前的版本号
      
      if(_curVersion < 100) { //证明是debug版本
        return;
      } else {
        getVersionFromServer().then(data => {
            // console.log('data', data)
            let _serverVersion = _formatVersionIntoNumber(data.latestVersion);
            let _updateStatus = data.status;
            // console.log('data1234', _updateStatus, versionCode.mustUpdate, isNil(_updateStatus));
            if(isNil(_updateStatus)) {
              return;
            }
            if(_serverVersion > _curVersion) { //本地版本落后于服务器最新版本
              let _btnArr = [
                {
                  text: '去更新',
                  onPress: () => {
                    this.showUpdateAlert = false;
                    Linking.openURL(data.url).catch(
                      err => alert(err)
                    )
                  }
                }
              ];
              if(_updateStatus == versionCode.alertToUpdate) {
                if(this.showUpdateAlert) return;
                this.showUpdateAlert = true;
                Alert.alert(
                  "有得食誠邀你體驗最新版本哦",
                  "更新到最新版可獲取更多服務~",
                  [{
                    text: "暂不更新",
                    onPress: () => {
                      this.showUpdateAlert = false;
                      return false;
                    }
                  },..._btnArr]
                );
                
              }else if(_updateStatus == versionCode.mustUpdate) {
                Alert.alert(
                  "有得食誠邀你體驗最新版本哦",
                  "更新到最新版可獲取更多服務~",
                  _btnArr
                );
                
              }
            }else {
              return;
            }
        }).catch(err => {
          console.log("err", err);
        })
      }
    }

    //cache
    _saveCache(key, value) {
      this.props.savePageCache({[key]: JSON.stringify(value)});
    }

    _getCache(key) {
      return this.props.pageCache[key] && JSON.parse(this.props.pageCache[key]) || null;
    }

    //api

    // ---------------------jpush&codepush&backAndroidHandler

    // jpush did mounted
    _jpushDidMount() {
      if (Platform.OS == "android") {
        this._jpush_android_setup();
      } else {
        JPushModule.setupPush();
      }
      this._jpushCommonEvent();
    }

    _jpush_android_setup() {
      JPushModule.initPush();
      JPushModule.notifyJSDidLoad(resultCode => {
        if (resultCode === 0) {
        }
      });
    }

    _jpushCommonEvent() {
      if (Platform.OS == "ios") {
        JPushModule.setBadge(0, success => {});
      }
      JPushModule.addReceiveOpenNotificationListener(map => {
        // console.log("map-------------jpush", map);
        if (typeof map.extras["type"] != "undefined") {
          switch (map.extras.type) {
            case jpushCommonUrlDefined.url:
              {
                this.props.navigation.navigate("Content", {
                  data: map.extras,
                  kind: "jpush"
                });
              }
              break;
            case jpushCommonUrlDefined.schema:
              {
                const {schema, type, ...rest} = map.extras;
                this.props.navigation.navigate(!!map.extras.schema ? map.extras.schema : "Food", rest);
              }
              break;
          }
        }
      });
    }

    // logic - update

    _checkForUpdate() {
      CodePush.checkForUpdate(CodePushUtils.getDeploymentKey()).then(
        remotePackage => {
          if (remotePackage == null) {
            return;
          }
          this._syncInNonSilent(remotePackage);
        }
      );
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
      let { i18n } = this.state;
      if (remotePackage.isMandatory) {
        if(this.showCodePushAlert) return;
        this.showCodePushAlert = true;
        Alert.alert(
          null,
          `${i18n.hot_reload_tips.update_details}\n ${
            remotePackage.description
          }`,
          [
            {
              text: i18n.hot_reload_tips.understand,
              onPress: () => {
                this.showCodePushAlert = false;
                this._downloadMandatoryNewVersionWithRemotePackage(
                  remotePackage
                );
              }
            }
          ]
        );
        return;
      } else {
        Alert.alert(null, i18n.hot_reload_tips.has_new_function, [
          { text: i18n.hot_reload_tips.not_now, onPress: () => {
            this.showCodePushAlert = false;
            return false;
          }},
          {
            text: i18n.hot_reload_tips.update_now,
            onPress: () => {
              this.showCodePushAlert = false;
              this._downloadNewVersionWithRemotePackage(remotePackage);
            }
          }
        ]);
      }
    };

    _downloadNewVersionWithRemotePackage = remotePackage => {
      let { i18n } = this.state;
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
      this.props.navigation.navigate("Mandatory", {
        remotePackage: remotePackage
      });
    };
    // ---------------------------end

    _renderLoginModal() {
      const { i18n } = this.state;
      return (
        <CommonModal
          isHeaderShow={false}
          type="login"
          modalVisible={this.props.showLogin}
          closeFunc={() => this.props.toggleLogin(false)}
        >
          <LoginView
            {...this.props}
            i18n={i18n}
          />
        </CommonModal>
      );
    }

    render() {
      const { i18n } = this.state;
      const { isLoading, isLoadingModal } = this.props;
      return (
        <Container>
          {isLoadingModal && <LoadingModal />}
          {isLoading && <Loading />}
          {this._renderLoginModal()}
          <CommonComment />
          <WarppedComponent
            ref={w => (this.WarppedComponent = w)}
            saveCache={this._saveCache.bind(this)}
            getCache={this._getCache.bind(this)}
            i18n={i18n}
            toast={msg => ToastUtils.showWithMessage(msg)}
            {...this.props}
          />
        </Container>
      );
    }
  }

  const stateToBasic = state => ({
    pageCache: state.pageCache,
    isLoading: state.loading.showLoading,
    isLoadingModal: state.loading.showLoadingModal,
    currentPlace: state.placeSetting.place,
    language: state.language.language,
    showLogin: state.login.showLogin,
  });

  const dispatchToBasic = dispatch => ({
    toggleLogin:status => dispatch({ type: "CHANGE_LOGIN_STATUS", showLogin: status }),
    savePageCache: pageCache => dispatch({ type: SAVE_CACHE, pageCache }),
    resetPageCache: () => dispatch({ type: RESET_CACHE }),
    showLoading: () => dispatch({type: SHOW_LOADING}),
    showLoadingModal: () => dispatch({type: SHOW_LOADING_MODAL}),
    hideLoading: () => dispatch({type: HIDE_LOADING}),
    hideLoadingModal: () => dispatch({type: HIDE_LOADING_MODAL}),
    dispatch
  });

  return connect(
    stateToBasic,
    dispatchToBasic
  )(Basic);
};

export default CommonHOC;
