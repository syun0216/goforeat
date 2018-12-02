import React,{Component} from 'react';
import { View, Animated,StyleSheet,TouchableWithoutFeedback,Text,TouchableOpacity,Image,Easing } from 'react-native';
import {Container} from 'native-base';
//utils
import GLOBAL_PARAMS from '../utils/global_params';
import Colors from '../utils/Colors';
 
const { _winHeight, _winWidth } = GLOBAL_PARAMS;

const WeChat = require('react-native-wechat');

const styles = StyleSheet.create({
  shareContainer:{
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 1000,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    width: _winWidth,
    height: 150
  },
  shareTop: {
    width: _winWidth, height: 40, borderBottomWidth: 1, borderColor: "#ccc"
  },
  shareTitle: {flex: 1, textAlign: 'center', marginTop: 13, color: Colors.fontBlack},

});

export default class ShareComponent extends Component {

  constructor(props) {
    super(props);
    // WeChat.registerApp('wx5b3f09ef08ffa7a7');
    this.state = {
      positionTop: new Animated.Value(0),
      fadeInOpacity: new Animated.Value(0),
      showShareList: false
    }
  }

  _toShowShareListView() {
    this.setState({
        showShareList: true
    });
    Animated.parallel(['fadeInOpacity', 'positionTop'].map(property => {
        return Animated.spring(this.state[property], {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear
        })
    })).start();
}

_toHideShareListView() {
    this.setState({
        showShareList: false
    });
    Animated.sequence(['positionTop'].map(property => {
        return Animated.timing(this.state[property], {
            toValue: 0,
            duration: 200,
            easing: Easing.linear
        })
    })).start();
}

  _shareMonents(type) {
    this.props.getShareType && this.props.getShareType(type);
  }

  _renderPreventClickView() {
    return this.state.showShareList ? (<TouchableWithoutFeedback onPress={() => this._toHideShareListView()}>
        <View style={{
            width: _winWidth,
            height: _winHeight,
            position: 'absolute',
            zIndex: 99,
            top: 0,
            left: 0,
            backgroundColor: '#5b7492',
            opacity: 0.3
        }}/>
    </TouchableWithoutFeedback>) : null;
}

  render() {
    return (
      <Animated.View style={[styles.shareContainer,{
        bottom: this.state.positionTop.interpolate({
          inputRange: [0, 1],
          outputRange: [-150, 0]
      }),
      opacity: this.state.fadeInOpacity
      }]}>
        <View style={styles.shareTop}>
            <Text style={styles.shareTitle}>與好友分享菜品</Text>
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
            <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress={() => this._shareMonents('whatsapp')}>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Image style={{width: 30, height: 30}} source={require('../asset/whatsapp2.png')}/>
                    <Text style={{fontSize: 12, color: Colors.fontBlack, marginTop: 10}}>WhatsApp</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress={() => this._shareMonents('wechat')}>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Image style={{width: 36, height: 36}} source={require('../asset/wechat2.png')}/>
                    <Text style={{fontSize: 12, color: Colors.fontBlack, marginTop: 6}}>WeChat</Text>
                </View>
            </TouchableOpacity>
        </View>
      </Animated.View>
    )
  }
}