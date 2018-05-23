import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {View,Animated,Easing,StyleSheet,Text,TouchableOpacity} from 'react-native';
import {Icon} from 'native-base';
//utils
import GLOBAL_PARAMS from '../utils/global_params';
const styles = StyleSheet.create({
  bottomContainer:{
    width: GLOBAL_PARAMS._winWidth,
    height: 50,
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
    Animated.timing(this.state.bottom, {
      toValue: nextProps.isShow? 1: 0,
      duration: 100,
      easing: Easing.quad
    }).start();
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
        outputRange: [-50, 0]
      })}]}>
        <View style={styles.commonView}>
          <TouchableOpacity onPress={this._cancelOrder}>
            <Icon name="md-close-circle" style={[styles.commonIcon,{color: theme,fontSize:28,marginTop: 3}]}/>
          </TouchableOpacity>
          <Text style={{marginLeft: 10}}>HKD{" "}</Text>
          <Text style={[styles.commonText,{color:theme}]}>{total}</Text>
        </View>
        <TouchableOpacity onPress={() => goToOrder()}>
          <View style={styles.commonView}>
            <Text style={[styles.commonText,{color:theme}]}>立即預定</Text>
            <Icon name="md-arrow-round-forward" style={[styles.commonIcon,{color: theme}]}/>
          </View>
        </TouchableOpacity>  
      </Animated.View>
    )
  }
}