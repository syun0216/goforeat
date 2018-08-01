import React, { Component } from "react";
import {
  View,
  WebView,
  AlertIOS,
  ToastAndroid,
  Clipboard,
  Platform,
  ActivityIndicator
} from "react-native";
import {
  Container,
  Text,
} from "native-base";
import Share, {ShareSheet, Button as SButton} from 'react-native-share';
//utils
import ToastUtil from "../utils/ToastUtil";
import GLOBAL_PARAMS from "../utils/global_params";
//api
import api from "../api";
import source from '../api/CancelToken';
//components
import Loading from "../components/Loading";
import CommonHeader from "../components/CommonHeader";
//language
import I18n from '../language/i18n'

export default class ContentView extends Component {
  state = {
    shareboxVisible: false,
    modalVisible: false,
    loading: false,
    isError: false,
    i18n: I18n[this.props.screenProps.language]
  }

  componentWillUnmount() {
    source.cancel()
  }

  //api

  openShare = () => {
    if (this.props.navigation.state.params.kind === "canteen") {
      ToastUtil.showWithMessage("暫未開放分享店鋪");
      return;
    }
    this.setState({shareboxVisible: true})
  }

  cancelShare = () => this.setState({shareboxVisible: false})

  _shareLink = (type) => {
    let {data,kind} = this.props.navigation.state.params;
    const shareOptions = {
      url: kind === 'canteen' ? 'http://goforeat.hk' : data.url,
      message: 'goforeat',
      title: data.title
    };
    this.cancelShare();
    if(type === 'url') {
      setTimeout(() => {
        if(typeof shareOptions["url"] !== undefined) {
          Clipboard.setString(shareOptions["url"]);
          if (Platform.OS === "android") {
            ToastAndroid.show('找不到該鏈接', ToastAndroid.SHORT);
          } else if (Platform.OS === "ios") {
            AlertIOS.alert('找不到該鏈接');
          }
        }
      },300);
    }else if(type === 'more') {
      setTimeout(() => {
        Share.open(shareOptions)
      },300);
    }
    else {
      setTimeout(() => {
        Share.shareSingle(Object.assign(shareOptions, {
          "social": type
        })).catch((err) => { 
          return;
        });
      },300);
    }
  }

  _renderShareSheet = () => {
    return (<ShareSheet visible={this.state.shareboxVisible} onCancel={this.cancelShare.bind(this)} style={{zIndex:999}}>
          <SButton iconSrc={require('../asset/Twitter.png')}
                  onPress={()=>this._shareLink('twitter')}><Text style={{marginTop:3}}>Twitter</Text></SButton>
          <SButton iconSrc={require('../asset/facebook.png')}
                  onPress={()=>this._shareLink('facebook')}><Text style={{marginTop:3}}>Facebook</Text></SButton>
          <SButton iconSrc={require('../asset/whatsapp.png')}
                  onPress={()=>this._shareLink('whatsapp')}><Text style={{marginTop:3}}>Whatsapp</Text></SButton>
          <SButton iconSrc={require('../asset/googleplus.png')}
                  onPress={()=>this._shareLink('googleplus')}><Text style={{marginTop:3}}>Google</Text> +</SButton>
          <SButton iconSrc={require('../asset/email.png')}
                  onPress={()=>this._shareLink('email')}><Text style={{marginTop:3}}>Email</Text></SButton>
          <SButton iconSrc={require('../asset/link.png')}
            onPress={()=>this._shareLink('url')}><Text style={{marginTop:3}}>Copy Link</Text></SButton>
          <SButton iconSrc={require('../asset/more.png')}
          onPress={()=>{
            this._shareLink('more')
          }}><Text style={{marginTop:3}}>More</Text></SButton>
        </ShareSheet>
  )}

  _activityIndicatorLoadingView() {
    return (
      <View style={{flex: 1,justifyContent: 'center',alignItems:'center'}}>
        <ActivityIndicator
          size='small'
          color={this.props.screenProps.theme}
        />
        <Text></Text>
      </View>
    );
  }

  _renderArticleContentView = () => (
    <WebView
      bounces={true}
      scalesPageToFit={true}
      source={{ uri: this.props.navigation.state.params.data.url }}
      onError={() => this.setState({isError: true})}
      renderLoading={() => <Loading />}
      startInLoadingState={true}
      style={{
        width: GLOBAL_PARAMS._winWidth,
        height: GLOBAL_PARAMS._winHeight
      }}
    />
  );

  render() {
    let {kind} = this.props.navigation.state.params;
    let {i18n} = this.state;
    return (
      <Container>
        <CommonHeader title={i18n.canteenDetail} canBack hasRight rightIcon="md-share-alt" rightClick={() => this.setState({shareboxVisible: true})} {...this.props}/>
        {this.state.loading ? <Loading /> : null}
        <View style={{flex:1}}>
            {this._renderArticleContentView()}
          {this._renderShareSheet()}
        </View>
    </Container>
    );
  }
}