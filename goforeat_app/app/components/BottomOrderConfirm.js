import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {View,StyleSheet,TouchableOpacity,Platform} from 'react-native';
import {Icon} from 'native-base';
//utils
import GLOBAL_PARAMS,{em} from '../utils/global_params';
import Colors from '../utils/Colors';
//components
import Text from './UnScalingText';

const iPhoneXBottom = {
  marginBottom: GLOBAL_PARAMS.isIphoneX() ? GLOBAL_PARAMS.iPhoneXBottom : 0,
}

const styles = StyleSheet.create({
  bottomContainer:{
    width: GLOBAL_PARAMS._winWidth,
    height: GLOBAL_PARAMS.isIphoneX() ? 83 : 49,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
    paddingRight: em(15),
    backgroundColor: '#fff',
    borderBottomWidth: GLOBAL_PARAMS.isIphoneX() ? 1 : 0,
    borderBottomColor: '#E5E5E5',
    left:0 ,
    bottom: 0
  },
  commonView: { 
    flexDirection:'row',alignItems:'center',justifyContent: 'center',
  },
  commonText:{
    // marginLeft:20,
    // marginRight:20,
    fontSize: 25
  },
  commonIcon: {
    fontSize: em(18)
  },
  confirmBtn: {
    backgroundColor:'#FF3348',
    height:40,
    minWidth:150,
    justifyContent:'center',
    alignItems:'center',
    borderRadius: 25,
    ...iPhoneXBottom
  },
  priceText: {
    color:'#FF3348',
    width:Platform.OS == 'ios'?GLOBAL_PARAMS._winWidth<350?60:100:80,
    marginTop:-5,
    fontWeight:'600',
    ...iPhoneXBottom
  },
  iconClose: {
    color: Colors.main_gray,
    fontSize: GLOBAL_PARAMS.em(28),
    marginTop: 3,
    ...iPhoneXBottom
  },
  closeBtn:{width: GLOBAL_PARAMS._winWidth < 350 ? 30 : 50, alignItems:'center'}
});

export default class BottomOrderConfirm extends PureComponent {
  timer = null;
  static defaultProps = {
    btnMessage: '立即預訂',
    btnClick: () => {},
    canClose: true
  }

  static propsType = {
    btnMessage: PropTypes.string,
    btnClick: PropTypes.func,
    canClose: PropTypes.bool
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  _cancelOrder = () => {
    this.props.cancelOrder();
  }

  render() {
    let {total,btnClick,canClose,btnMessage} = this.props;
    return (
      <View style={[styles.bottomContainer,{justifyContent: canClose?'space-between':'flex-end',}]}>
        <View style={styles.commonView}>
          {canClose ?<TouchableOpacity style={styles.closeBtn} onPress={this._cancelOrder}>
            <Icon name="md-close-circle" style={[styles.commonIcon,styles.iconClose]}/>
          </TouchableOpacity> : null}
          <Text style={{marginLeft: 5,fontSize: em(13),...iPhoneXBottom}}>HKD{" "}</Text>
          <Text style={[styles.commonText,styles.priceText]} numberOfLines={1}>{GLOBAL_PARAMS._winWidth<350?total:total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.confirmBtn} onPress={() => btnClick()}>
          <View style={styles.commonView}>
            <Text style={{color:'#fff', fontSize: em(20)}}>{btnMessage}</Text>
          </View>
        </TouchableOpacity>  
      </View>
    )
  }
}