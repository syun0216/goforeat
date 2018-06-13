import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {View,Animated,Easing,StyleSheet,Text,TouchableOpacity} from 'react-native';
import {Icon} from 'native-base';
//utils
import GLOBAL_PARAMS from '../utils/global_params';
const styles = StyleSheet.create({
  bottomContainer:{
    width: GLOBAL_PARAMS._winWidth,
    height: 49,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 99999,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  commonView: { 
    flexDirection:'row',alignItems:'center'
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
    isShow: false
  }

  static propsType = {
    isShow: PropTypes.bool
  }

  state = {
    bottom: new Animated.Value(0)
  }

  componentWillReceiveProps(nextProps) {
    this.timer = setTimeout(() => {
      Animated.timing(this.state.bottom, {
        toValue: nextProps.isShow? 1: 0,
        duration: 100,
        easing: Easing.quad
      }).start();
      clearTimeout(this.timer);
    }, 300);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  _cancelOrder = () => {
    this.props.cancelOrder();
  }

  render() {
    let {screenProps:{theme},total,goToOrder} = this.props;
    return (
      <Animated.View style={[styles.bottomContainer,{
        bottom:this.state.bottom.interpolate({
        inputRange: [0,1],
        outputRange: [-49, 0]
      })}]}>
        <View style={styles.commonView}>
          <TouchableOpacity style={{width: GLOBAL_PARAMS._winWidth < 350 ? 30 : 50, alignItems:'center'}} onPress={this._cancelOrder}>
            <Icon name="md-close-circle" style={[styles.commonIcon,{color: '#FF3348',fontSize:28,marginTop: 3}]}/>
          </TouchableOpacity>
          <Text style={{marginLeft: 10}}>HKD{" "}</Text>
          <Text style={[styles.commonText,{color:'#FF3348'}]}>{total}</Text>
        </View>
        <TouchableOpacity style={{backgroundColor:'#FF3348',height:49,width:150,justifyContent:'center',alignItems:'center',marginRight:-10}} onPress={() => goToOrder()}>
          <View style={styles.commonView}>
            <Text style={[styles.commonText,{color:'#fff'}]}>立即預訂</Text>
          </View>
        </TouchableOpacity>  
      </Animated.View>
    )
  }
}