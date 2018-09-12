import React,{PureComponent} from 'react';
import PropTypes from 'prop-types';
import {View,Image,StyleSheet,TouchableOpacity,Easing,Animated,Platform} from 'react-native';
//utils
import GLOBAL_PAMRAS,{em} from '../utils/global_params';
//components
import Text from './UnScalingText';
//api
import {queryList} from '../api/request';

const ITEM_HEIGHT = Platform.select({
  ios: {height: em(36)},
  android: {}
});

const styles = StyleSheet.create({
  warn_container: {
    backgroundColor: '#FEFCEB',
    width: GLOBAL_PAMRAS._winWidth,
    height: em(36),
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 9,
    paddingBottom: 9,
    paddingLeft: 5,
    paddingRight: 5,
    alignItems: 'center',
    overflow: 'hidden',
  },
  warning_img: {
    width: em(16),
    height: em(16)
  },
  warning_text_container: {
    flexDirection: 'column',
    backgroundColor: '#FEFCEB',
    position: 'relative',
    width: GLOBAL_PAMRAS._winWidth*0.8,
    maxWidth: GLOBAL_PAMRAS._winWidth*0.8,
    height: em(36)
  },
  warningt_text_inner_container: {
    // flexDirection: 'column',
    width: GLOBAL_PAMRAS._winWidth*0.8,
    maxWidth: GLOBAL_PAMRAS._winWidth*0.8,
    ...ITEM_HEIGHT,
  },
  warning_text: {
    color: '#F86B25',
    fontSize: em(14),
    padding: em(9)
  },
  close_btn: {
    width: em(36),
    height: em(36),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  warning_close: {
    width: 12,
    height: 12,
  }
});

const WARNING_CONTENT = (v, i, navigation) => (
  <TouchableOpacity key={i} onPress={
    () => navigation.navigate('Content',{
      data: v,kind: 'warning'
    })
  }>
    <Text numberOfLines={1} style={styles.warning_text}>{v.title}</Text>
  </TouchableOpacity>
);

export default class WarningTips extends PureComponent {
  _interval = null;
  _container_height = Platform.OS == 'ios' ? -33.7 : -37.5;
  state = {
    translateY: new Animated.Value(0),
    warningTipsData: null,
    isWarningTipShow: false,
  };

  componentWillMount() {
    this._getWarningTips();
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  //api
  _getWarningTips() {
    queryList().then(data => {
      if(!data.hasOwnProperty('data') || data.data.length == 0) return;
      if(data.ro.ok) {
        // data.data = data.data.concat(data.data);
        // data.data = data.data.concat(data.data);
        // data.data = data.data.concat(data.data);
        // console.log(data);
        this.setState({
          warningTipsData: data.data,
          isWarningTipShow: true
        },() => {
          if(data.data.length == 1) return;
          this._loopDisplay(0 , data.data.length);
        })
      }
    })
  }

  _layout(e) {
    // console.log(e);
    // this._container_height = - e.layout.width;
  }

  _loopDisplay(index, count) {
    index ++;
    Animated.timing(this.state.translateY, {
      toValue: em(this._container_height * index),
      duration: 300,
      easing:Easing.linear,
      delay: 2500
    }).start(() => {
      if(index >= count) {
        index = 0;
        let _y = Platform.OS == 'ios' ? 0 : 0;
        this.state.translateY.setValue(_y);
      }
      this._loopDisplay(index, count);
    });
  }

  _loopDataArr(arr) {
    let _temp = arr.shift();
    arr.push(_temp);
    return arr;
  }

  render() {
    let {navigation} = this.props;
    let {warningTipsData} = this.state;
    return (
        this.state.isWarningTipShow ? <View style={styles.warn_container}> 
        <Image source={require('../asset/warning.png')} style={styles.warning_img} resizeMode="contain"/>
        <View style={styles.warning_text_container}>
          <Animated.View onLayout={({nativeEvent:e})=>this._layout(e)} style={[styles.warningt_text_inner_container,{
            transform: [{
              translateY: this.state.translateY
            }]
          }]}>
          { warningTipsData.map((v,i) => WARNING_CONTENT(v, i, navigation)) }
          </Animated.View>
        </View>  
        <TouchableOpacity style={styles.close_btn} onPress={() => this.setState({isWarningTipShow: false})}>
          <Image source={require('../asset/close_red.png')} style={styles.warning_close} resizeMode="cover"/>
        </TouchableOpacity>  
      </View> : null
    )
  }
}
