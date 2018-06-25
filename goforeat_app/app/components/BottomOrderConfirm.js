import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {View,Animated,Easing,StyleSheet,Text,TouchableOpacity,Platform} from 'react-native';
import {Icon} from 'native-base';
//utils
import GLOBAL_PARAMS from '../utils/global_params';
import Colors from '../utils/Colors';

const styles = StyleSheet.create({
  bottomContainer:{
    width: GLOBAL_PARAMS._winWidth,
    height: 49,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  commonView: { 
    flexDirection:'row',alignItems:'center',justifyContent: 'center',
  },
  commonText:{
    marginLeft:20,
    marginRight:20,
    fontSize: 25
  },
  commonIcon: {
    fontSize: 20
  }
});

export default class BottomOrderConfirm extends PureComponent {
  timer = null;
  static defaultProps = {
    isShow: false,
    btnMessage: '立即預訂',
    btnClick: () => {},
    canClose: true
  }

  static propsType = {
    isShow: PropTypes.bool,
    btnMessage: PropTypes.string,
    btnClick: PropTypes.func,
    canClose: PropTypes.bool
  }

  state = {
    bottom: new Animated.Value(0)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.isShow) {
      this.timer = setTimeout(() => {
        Animated.timing(this.state.bottom, {
          toValue: nextProps.isShow? 1: 0,
          duration: 100,
          easing: Easing.quad
        }).start();
        clearTimeout(this.timer);
      }, 150);
    }else {
      Animated.timing(this.state.bottom, {
        toValue: nextProps.isShow? 1: 0,
        duration: 100,
        easing: Easing.quad
      }).start();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  _cancelOrder = () => {
    this.props.cancelOrder();
  }

  render() {
    let {total,btnClick} = this.props;
    return (
      <Animated.View style={[styles.bottomContainer,{
        bottom:this.state.bottom.interpolate({
        inputRange: [0,1],
        outputRange: [-49, 0]
      })}]}>
        <View style={styles.commonView}>
          {this.props.canClose ?<TouchableOpacity style={{width: GLOBAL_PARAMS._winWidth < 350 ? 30 : 50, alignItems:'center'}} onPress={this._cancelOrder}>
            <Icon name="md-close-circle" style={[styles.commonIcon,{color: Colors.main_gray,fontSize:28,marginTop: 3}]}/>
          </TouchableOpacity> : null}
          <Text allowFontScaling={false} style={{marginLeft: 5}}>HKD{" "}</Text>
          <Text allowFontScaling={false} style={[styles.commonText,{color:'#FF3348',width:Platform.OS == 'ios'?GLOBAL_PARAMS._winWidth<350?60:100:80,marginTop:-5,}]} numberOfLines={1}>{GLOBAL_PARAMS._winWidth<350?total:total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={{backgroundColor:'#FF3348',height:49,width:150,justifyContent:'center',alignItems:'center',marginRight:-10}} onPress={() => btnClick()}>
          <View style={styles.commonView}>
            <Text allowFontScaling={false} style={[styles.commonText,{color:'#fff'}]}>{this.props.btnMessage}</Text>
          </View>
        </TouchableOpacity>  
      </Animated.View>
    )
  }
}