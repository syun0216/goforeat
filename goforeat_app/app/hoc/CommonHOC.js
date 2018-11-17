import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableWithoutFeedback, Platform, TextInput, AppState, Alert, ToastAndroid, BackHandler, } from 'react-native';
import {Container, Input} from 'native-base';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import Share from 'react-native-share';
//codepush
import CodePush from 'react-native-code-push';
import CodePushUtils from '../utils/CodePushUtils';
//jpush
import JPushModule from 'jpush-react-native';
//utils
import {em, _winWidth, _winHeight} from '../utils/global_params';
import ToastUtils from '../utils/ToastUtil';
//components
import CommonBottomBtn from '../components/CommonBottomBtn';
import LoadingModal from '../components/LoadingModal';
//language
import I18n from '../language/i18n';
//api
import { popupComment, addComment } from '../api/request';
 
const slideAnimation = new SlideAnimation({
  slideFrom: 'bottom',
});

const lastBackPressed = Date.now();

const shareOptions = { //分享優惠券信息
  url: 'http://api.goforeat.hk/guide/download',
  message: '日日有得食',
  title: '分享有得食搶優惠券'
};

const commentKeyWord = {
  0: '暫不評論',
  1: '非常差',
  2: '差',
  3: '一般',
  4: '好',
  5: '非常好'
};

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

  constructor(props) {
    super(props);
    this.commentText = '';
    this.isCommentSubmit = false;
    this.state = {
      currentComment:null,
      currentStar: 5,
      btnContent: '推薦好友領優惠券',
      i18n: I18n[props.screenProps.language],
      LoadingModal: false
    };  
  }

  componentDidMount() {
    this._jpushDidMount();
    this._commentPopup();
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
  _commentPopup() {
    popupComment().then(data => {
      if(data.ro.respCode == '0000') {
        this.setState({
          currentComment: data.data
        },() => {
          this.popupDialog.show();
        })
      }
    });
  }

  _addCommentApi() {
    if(this.state.currentComment == null) {
      this.popupDialog.dismiss();
      return;
    };
    let {currentComment: {orderId}, currentStar} = this.state;
    addComment(orderId, currentStar, this.commentText).then(data => {
      if(data.ro.ok) {
        this.isCommentSubmit = true;
        this.popupDialog.dismiss();
      } else {
        ToastUtils.showWithMessage(data.ro.respMsg);
      }
    });
  }

  _addComment() {
    this._addCommentApi();
    if(this.state.currentStar == 5) {
      Share.open(shareOptions).catch((err) => { 
        console.log({err});
      });
    }
  }
  
  _getComment(val) {
    this.commentText = val;
  }

  _handleDialogDismiss() {
    this.setState({
      currentStar: 0
    }, () => {
      this._addCommentApi();
    });
  }

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

  _renderEmojiBtn({defaultImage, activeImage, name, val}) {
    return (
      <TouchableWithoutFeedback key={name} onPress={() => {
        this.setState({
          currentStar: val
        },() => {
          if(this.state.currentStar == 5) {
            this.setState({
              btnContent: '推薦好友領優惠券'
            })
          } else {
            this.setState({
              btnContent: '確認提交'
            })
          }
        })
      }} style={styles.emoji}>
        <Image source={this.state.currentStar == val ? activeImage : defaultImage} style={styles.emoji}/>
      </TouchableWithoutFeedback>
    )
  }

  _renderPopupDialogView() {
    const emoji_arr = [
      {defaultImage: require('../asset/crazy-normal.png'), activeImage: require('../asset/crazy-press.png'), name: 'crazy', val: 1},
      {defaultImage: require('../asset/hard-normal.png'), activeImage: require('../asset/hard-press.png'), name: 'hard', val: 2},
      {defaultImage: require('../asset/allright-normal.png'), activeImage: require('../asset/allright-press.png'), name: 'allright', val: 3},
      {defaultImage: require('../asset/well-normal.png'), activeImage: require('../asset/well-press.png'), name: 'well', val: 4},
      {defaultImage: require('../asset/delicious-normal.png'), activeImage: require('../asset/delicious-press.png'), name: 'delicious', val: 5},
    ];
    const {currentStar,currentComment: {orderName, picture}} = this.state;
    const defaultImg = "https://img.xiumi.us/xmi/ua/18Wf8/i/98c314a76260a9634beecfd27c28770d-sz_80962.jpg?x-oss-process=style/xmr";

    return (
      <PopupDialog
        ref={(popupDialog) => { this.popupDialog = popupDialog; }}
        width={em(295)}
        height={em(435)}
        onDismissed={() => this._handleDialogDismiss()}
        dialogStyle={styles.popupDialogContainer}
        dialogAnimation={slideAnimation}
      >
        <Image style={styles.topImg} reasizeMode="contain" source={require('../asset/commentTop.png')}/>
        <View style={styles.topTitle}>
          <Text style={styles.topTitleText}>给</Text>
          <Text style={[styles.topTitleText, styles.foodNameText]} numberOfLines={1}>{orderName || '有得食'}</Text>
          <Text style={styles.topTitleText}>打分</Text>
        </View>
        <View style={styles.content}>
          <Image style={styles.contentImg} source={{uri: picture || defaultImg}}/>
          <View style={styles.emojiContainer}>
            {
              emoji_arr.map(v => this._renderEmojiBtn(v))
            }
            </View>
          {/*<Text style={[styles.commentText,{color: currentStar < 3 ? '#ccc' : currentStar<= 4 ? '#f7ba2a' : '#ff630f'}]}>{commentKeyWord[currentStar]}</Text>*/}
          <TextInput allowFontScaling={false} style={styles.Input} underlineColorAndroid="transparent" placeholderTextColor="#9d9d9d" 
          placeholder={`例如:${commentKeyWord[currentStar]}`} clearButtonMode="while-editing" onChangeText={(val) => this._getComment(val)}/>
          <CommonBottomBtn clickFunc={() => this._addComment()} style={{width: em(263)}}>{this.state.btnContent}</CommonBottomBtn>
        </View>
      </PopupDialog>
    )
  }

  render() {
    let {i18n} = this.state;
    
    return (
      <Container>
        {this.state.currentComment != null ? this._renderPopupDialogView() : null}
        {this.state.LoadingModal ? <LoadingModal /> : null}
        <WarppedComponent ref={w => this.WarppedComponent = w} {...this.props} showLoading={this._showLoadingModal.bind(this)} hideLoading={this._hideLoadingModal.bind(this)} i18n={i18n}/>
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
    padding: em(16)
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
    justifyContent: 'space-between'
  },
  emoji: {
    width: em(35),
    height: em(35)
  },
  commentText: {
    textAlign: 'center',
    marginBottom: em(10),
  },
  Input: {
    color: '#9d9d9d',
    fontSize: em(13),
    height: Platform.OS == 'ios' ? em(30) : 40 * (_winHeight / 592),
    width: _winWidth * 0.85,
    borderBottomWidth: 1,
    borderBottomColor: '#9d9d9d',
    marginBottom: Platform.OS == "android"?0:em(10),
  }
})

export default CommonHOC;