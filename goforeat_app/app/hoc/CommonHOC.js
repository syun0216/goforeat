import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableWithoutFeedback, Platform, TextInput, AppState, Alert} from 'react-native';
import {Container, Input} from 'native-base';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
//codepush
import CodePush from 'react-native-code-push';
import CodePushUtils from '../utils/CodePushUtils';
//jpush
import JPushModule from 'jpush-react-native';
//utils
import {em, _winWidth, _winHeight} from '../utils/global_params';
//components
import CommonBottomBtn from '../components/CommonBottomBtn';
import Loading from '../components/Loading';
import ErrorPage from '../components/ErrorPage';
import BlankPage from '../components/BlankPage';
//language
import I18n from '../language/i18n';

const slideAnimation = new SlideAnimation({
  slideFrom: 'bottom',
});

const CommonHOC = WarppedComponent => class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentComment:null,
      i18n: I18n[props.screenProps.language]
    }
  }

  // ---------------------jpush&codepush
  componentDidMount() {
    this._jpushDidMount();
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
    JPushModule.removeReceiveNotificationListener('receiveNotification');
  }

  // jpush did mounted
  _jpushDidMount() {
    if(Platform.OS == 'android') {
      this._jpush_android_setup()
    }else {
      JPushModule.setupPush()
    }    
    this._jpushCommonEvent();
  }

  _jpush_android_setup = () => {
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
        map.extras.type == 1 && this.props.navigation.navigate("Content", {data: map.extras,kind: 'jpush'})
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
  // ---------------------------end

  _getComment(val) {
    console.log(val)
  }

  _renderEmojiBtn({defaultImage, activeImage, name}) {
    return (
      <TouchableWithoutFeedback key={name} onPress={() => {
        this.setState({
          currentComment: name
        })
      }} style={styles.emoji}>
        <Image source={this.state.currentComment == name ? activeImage : defaultImage} style={styles.emoji}/>
      </TouchableWithoutFeedback>
    )
  }

  render() {
    const emoji_arr = [
      {defaultImage: require('../asset/crazy-normal.png'), activeImage: require('../asset/crazy-press.png'), name: 'crazy'},
      {defaultImage: require('../asset/hard-normal.png'), activeImage: require('../asset/hard-press.png'), name: 'hard'},
      {defaultImage: require('../asset/allright-normal.png'), activeImage: require('../asset/allright-press.png'), name: 'allright'},
      {defaultImage: require('../asset/well-normal.png'), activeImage: require('../asset/well-press.png'), name: 'well'},
      {defaultImage: require('../asset/delicious-normal.png'), activeImage: require('../asset/delicious-press.png'), name: 'delicious'},
    ];
    return (
      <Container>
        <PopupDialog
          ref={(popupDialog) => { this.popupDialog = popupDialog; }}
          width={em(295)}
          height={em(435)}
          dialogStyle={styles.popupDialogContainer}
          dialogAnimation={slideAnimation}
        >
          <Image style={styles.topImg} reasizeMode="contain" source={require('../asset/commentTop.png')}/>
          <View style={styles.topTitle}>
            <Text style={styles.topTitleText}>给</Text>
            <Text style={[styles.topTitleText, styles.foodNameText]} numberOfLines={1}>瑞士鸡腿+咖喱猪扒+hahahah</Text>
            <Text style={styles.topTitleText}>打分</Text>
          </View>
          <View style={styles.content}>
            <Image style={styles.contentImg} source={{uri: 'https://img.xiumi.us/xmi/ua/18Wf8/i/947a1ce40e185b4aa6e8318e496e9748-sz_61730.jpg'}}/>
            <View style={styles.emojiContainer}>
              {
                emoji_arr.map(v => this._renderEmojiBtn(v))
              }
            </View>
            <TextInput allowFontScaling={false} style={styles.Input} placeholderTextColor="#999" 
            placeholder="例如:好評" clearButtonMode="while-editing" onChangeText={(val) => this._getComment(val)}/>
            <CommonBottomBtn clickFunc={() => console.log(this.WarppedComponent.test())} style={{width: em(263)}}>推薦給好友</CommonBottomBtn>
          </View>
        </PopupDialog>
        <WarppedComponent ref={w => this.WarppedComponent = w} {...this.props} showDialog={() => this.popupDialog.show()} hideDialog={() => this.popupDialog.dismiss()}/>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  popupDialogContainer: {
    position: 'relative',
    // borderWidth: 10,
    // borderColor: 'transparent',
  },
  topImg: {
    width: '100%',
    height: em(99),
    position: 'absolute',
    top: em(-22),
    left: 0
  },
  topTitle: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: em(75),
    flexDirection: 'row'
  },
  topTitleText: {
    color: '#ef3f15',
    fontSize: em(17),
    marginBottom: em(10),
  },
  foodNameText: {
    marginRight: em(8),
    marginLeft: em(8),
    maxWidth: em(100)
  },
  content: {
    padding: em(16),
  },
  contentImg: {
    width: '100%',
    height: em(146),
    borderRadius: em(15),
  },
  emojiContainer:{
    flexDirection: 'row',
    marginTop: em(12),
    marginBottom: em(24),
    justifyContent: 'space-between',
  },
  emoji: {
    width: em(35),
    height: em(35)
  },
  Input: {
    color: '#111',
    fontSize: em(16),
    height: Platform.OS == 'ios' ? em(30) : 45 * (_winHeight / 592),
    width: _winWidth * 0.85,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
    marginBottom: em(10)
  }
})

export default CommonHOC;