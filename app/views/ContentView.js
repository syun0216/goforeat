import React, { Component } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Clipboard,
  Platform
} from "react-native";
import { WebView } from 'react-native-webview';
import { Text } from "native-base";
import { connect } from "react-redux";
import Share, { ShareSheet, Button as SButton } from "react-native-share";
//utils
import ToastUtil from "../utils/ToastUtil";
import GLOBAL_PARAMS from "../utils/global_params";
//api
import {abortRequestInPatchWhenRouteChange} from "../api/CancelToken";
//components
import Loading from "../components/Loading";
import CommonHeader from "../components/CommonHeader";
import CustomizeContainer from "../components/CustomizeContainer";
import ShareComponent from "../components/ShareComponent";
import ErrorPage from "../components/ErrorPage";
//language
import I18n from "../language/i18n";
//api
import {myInvites} from "../api/request";

const WeChat = require("react-native-wechat");

class ContentView extends Component {
  _webView = null;
  _shareList = null;
  _inviteUrl = null;
  state = {
    shareboxVisible: false,
    modalVisible: false,
    loading: false,
    isError: false,
    i18n: I18n[this.props.language],
    isShareListShow: false
  };

  constructor(props) {
    super(props);
    WeChat.registerApp("wx5b3f09ef08ffa7a7"); 
  }

  componentDidMount() {
    if(this.props.navigation.state.params.kind === "activity") {
      this._myInvites();
    }
  }

  componentWillUnmount() {
    abortRequestInPatchWhenRouteChange();
  }

  //api

  _myInvites() {
    myInvites().then(data => {
      this._inviteUrl = data.inviteUrl;
    })
  }

  openShare = () => {
    if (this.props.navigation.state.params.kind === "canteen") {
      ToastUtil.showWithMessage("暫未開放分享店鋪");
      return;
    }else if(this.props.navigation.state.params.kind == "activity") {
      this.setState({
        isShareListShow: true
      });
      this._shareList && this._shareList._toShowShareListView();
      return;
    }else {
      this.setState({ shareboxVisible: true });
    }
  };

  cancelShare = () => this.setState({ shareboxVisible: false });

  handleMessage(event) {
    console.log('event', event);
    this.openShare();
  }

  _shareLink = type => {
    let { data } = this.props.navigation.state.params;
    const shareOptions = {
      url: data.url,
      message: "goforeat",
      title: data.title
    };
    this.cancelShare();
    if (type === "url") {
      setTimeout(() => {
        if (typeof shareOptions["url"] !== undefined) {
          Clipboard.setString(shareOptions["url"]);
        }
      }, 300);
    } else if (type === "more") {
      setTimeout(() => {
        Share.open(shareOptions);
      }, 300);
    } else {
      setTimeout(() => {
        Share.shareSingle(
          Object.assign(shareOptions, {
            social: type
          })
        ).catch(err => {
          return;
        });
      }, 300);
    }
  };

  _pressToShare = type => {
    if(this._inviteUrl) {
      switch(type) {
        case 'whatsapp': {
          const shareOptions = {
            //分享優惠券信息
            url: this._inviteUrl,
            message: "點擊下面的連接，即可註冊探索更多美味：附上連接",
            title: "Hi! 發現係有得食APP上註冊可以活動HKD35優惠券組合，訂購午餐時可以抵扣相應優惠券",
            social: "whatsapp"
          };
          this.timer = setTimeout(() => {
            Share.shareSingle(
              Object.assign(shareOptions, {
                social: "whatsapp"
              })
            )
              .then(info => {
                // console.log(info);
                this.setState({
                  modalVisible: false
                });
              })
              .catch(err => {
                alert(`WhatsApp:${err && err.error && err.error.message}`);
                // console.log(err);
                return;
              });
          }, 300);
        };break;
        case 'wechat': {
          WeChat.isWXAppInstalled().then(isInstalled => {
            if (isInstalled) {
              let _obj = {
                title: "註冊即領HKD35午餐優惠券組合",
                description: '每日專注幫你好好食晏',
                thumbImage: 'http://118.25.159.37:15108/images/icon_app.png',
                type: "news",
                webpageUrl: this._inviteUrl
              };
              // Platform.OS=='ios' && (
              //   _obj['thumbImage'] = extralImage[0]
              // );
              WeChat.shareToSession(_obj).catch(error => {
                // console.log(error);
                if (error.message == -2) {
                  this.props.toast("分享失敗");
                } else {
                  this.props.toast("分享成功");
                }
              });
            } else {
              this.props.toast("WeChat is not installed");
            }
          });
        };break;
      }
    }else {
      this.props.toast('初始化失敗,請退出重試');
    }
  }

  _renderShareSheet = () => {
    return (
      <ShareSheet
        visible={this.state.shareboxVisible}
        onCancel={this.cancelShare.bind(this)}
        style={{ zIndex: 999 }}
      >
        <SButton
          iconSrc={require("../asset/Twitter.png")}
          onPress={() => this._shareLink("twitter")}
        >
          <Text style={{ marginTop: 3 }}>Twitter</Text>
        </SButton>
        <SButton
          iconSrc={require("../asset/facebook.png")}
          onPress={() => this._shareLink("facebook")}
        >
          <Text style={{ marginTop: 3 }}>Facebook</Text>
        </SButton>
        <SButton
          iconSrc={require("../asset/whatsapp.png")}
          onPress={() => this._shareLink("whatsapp")}
        >
          <Text style={{ marginTop: 3 }}>Whatsapp</Text>
        </SButton>
        <SButton
          iconSrc={require("../asset/googleplus.png")}
          onPress={() => this._shareLink("googleplus")}
        >
          <Text style={{ marginTop: 3 }}>Google</Text> +
        </SButton>
        <SButton
          iconSrc={require("../asset/email.png")}
          onPress={() => this._shareLink("email")}
        >
          <Text style={{ marginTop: 3 }}>Email</Text>
        </SButton>
        <SButton
          iconSrc={require("../asset/link.png")}
          onPress={() => this._shareLink("url")}
        >
          <Text style={{ marginTop: 3 }}>Copy Link</Text>
        </SButton>
        <SButton
          iconSrc={require("../asset/more.png")}
          onPress={() => {
            this._shareLink("more");
          }}
        >
          <Text style={{ marginTop: 3 }}>More</Text>
        </SButton>
      </ShareSheet>
    );
  };

  _renderPreventClickView() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.setState(
            {
              isShareListShow: false
            },
            () => {
              this._shareList && this._shareList._toHideShareListView();
            }
          );
        }}
      >
        <View
          style={{
            width: GLOBAL_PARAMS._winWidth,
            height: GLOBAL_PARAMS._winHeight,
            position: "absolute",
            zIndex: 99,
            top: 0,
            left: 0,
            backgroundColor: "#000",
            opacity: 0.3
          }}
        />
      </TouchableWithoutFeedback>
    );
  }

  _renderArticleContentView = () => (
    <WebView
      ref={w => this._webView = w}
      bounces={true}
      scalesPageToFit={true}
      source={{ uri: this.props.navigation.state.params.data.url }}
      onError={() => this.setState({ isError: true })}
      onMessage={(event) => this.handleMessage(event)}
      renderLoading={() => <Loading />}
      startInLoadingState={Platform.OS == 'ios'}
      style={{
        width: GLOBAL_PARAMS._winWidth,
        height: GLOBAL_PARAMS._winHeight
      }}
    />
  );

  render() {
    let {
      data: { title, food_title },
      kind
    } = this.props.navigation.state.params;
    title = typeof title == "undefined" ? "有得食" : title;
    console.log(this.props.navigation.state.params);
    return (
      <CustomizeContainer.SafeView mode="linear">
        <CommonHeader
          title={kind == "article" ? food_title : title}
          canBack
          hasRight
          rightIcon="sharealt"
          rightClick={() => {
            this.openShare()
          }}
        />
        <View style={{ flex: 1 }}>
          {/* {this.state.loading ? <Loading /> : null} */}
          {this.state.isShareListShow && this._renderPreventClickView()}
          {this._renderArticleContentView()}
          {this._renderShareSheet()}
          <ShareComponent 
            ref={sl => this._shareList = sl}
            title="與好友分享優惠券"
            getShareType={type => this._pressToShare(type)}
          />
        </View>
        {
          this.state.isError && (<ErrorPage errorTips="加載失敗,請點擊重試..." errorToDo={() => {
            this._webView && this._webView.reload();
            this.setState({
              isError: false
            });
          }}/>)
        }
      </CustomizeContainer.SafeView>
    );
  }
}

const stateToContent = state => ({
  langauge: state.language.language
});

export default connect(stateToContent, {})(ContentView);
