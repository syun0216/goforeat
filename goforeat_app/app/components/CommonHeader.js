import React from 'react'
import PropTypes from 'prop-types'
import {StyleSheet,Platform,TouchableWithoutFeedback,TouchableOpacity,Image} from 'react-native'
import {Header,Left,Body,Right,Icon,Button} from 'native-base'
import LinearGradient from 'react-native-linear-gradient';
//utils
import Colors from '../utils/Colors';
import GLOBAL_PARAMS from "../utils/global_params";
//styles
import CommonStyles from "../styles/common.style";
import HomePageStyles from "../styles/homepage.style";
//components
import Text from './UnScalingText';

const styles = StyleSheet.create({
  linearGradient: {
    height: GLOBAL_PARAMS.isIphoneX() ? 64+GLOBAL_PARAMS.iPhoneXTop: 64,
    width: GLOBAL_PARAMS._winWidth,
    marginTop: Platform.OS == 'ios' ? -15 : -4,
    paddingTop: Platform.OS == 'ios' ? 15 : 0,
    justifyContent:'center',
    alignItems: 'center',
    flexDirection: 'row'
  }
})

const CommonHeader = (props) => {
  return (
  <Header style={[props.headerStyle,{
    marginTop: GLOBAL_PARAMS.isIphoneX() ? -GLOBAL_PARAMS.iPhoneXTop : 0,
    marginBottom: GLOBAL_PARAMS.isIphoneX() ? GLOBAL_PARAMS.iPhoneXTop : 0,
  }]} hasTabs iosBarStyle={props.iosBarStyle} androidStatusBarColor="#333">
  <LinearGradient colors={['#FF7F0B','#FF1A1A']} start={{x:0.0, y:0.0}} end={{x:1.0,y: 0.0}} style={styles.linearGradient}>
    <Left style={{marginTop: GLOBAL_PARAMS.isIphoneX() ? 15 : 0,flex: 1}}>
      {props.canBack ? (props.leftElement !== null ? props.leftElement : (
        Platform.OS == 'ios' ? 
        (<Button transparent onPress={() => {props.navigation.goBack();}}>
          <Icon
            size={20}
            name="ios-arrow-back"
            style={[CommonStyles.common_icon_back,{color: props.textColor}]}
          />
        </Button>) :
        (
          <TouchableWithoutFeedback onPress={() => {props.navigation.goBack();}}>
          <Icon
            size={20}
            name="ios-arrow-back"
            style={[CommonStyles.common_icon_back,{color: props.textColor}]}
          />
        </TouchableWithoutFeedback>
        )
      )) : props.hasMenu ? (
        <TouchableOpacity style={Platform.OS == 'ios' ? HomePageStyles.MenuBtn : HomePageStyles.MenuBtnAndroid} onPress={() => {props.navigation.navigate("DrawerOpen");}}>
          <Image source={require('../asset/menu.png')} style={HomePageStyles.MenuImage} resizeMode="contain"/>
        </TouchableOpacity>
      ) : null}
    </Left>
    <Body style={{minWidth: GLOBAL_PARAMS.em(200),marginTop: GLOBAL_PARAMS.isIphoneX() ? 15 : 0,flex: 1}}><Text allowFontScaling={false} style={[{color: props.textColor,fontSize:GLOBAL_PARAMS.em(16)},props.titleStyle]} numberOfLines={1}>{props.title}</Text></Body>
    <Right style={{marginTop: GLOBAL_PARAMS.isIphoneX() ? 15 : 0,flex:1}}>
      {props.hasRight ? (props.rightElement !== null ? <props.rightElement {...props}/> : (
        <Button transparent onPress={() => props.rightClick()}>
        <Icon name={props.rightIcon} size={25} style={{fontSize:GLOBAL_PARAMS.em(23),color: Colors.main_white,paddingRight: 10}} /></Button>
      )) : null}
    </Right>
  </LinearGradient> 
  </Header>
)}

CommonHeader.defaultProps = {
  title: '詳情',
  canBack:false,
  hasMenu: false,
  hasTabs: false,
  hasRight: false,
  leftElement: null,
  rightElement: null,
  headerStyle:{},
  titleStyle: {},
  leftStyle: {},
  textColor: Colors.main_white,
  iosBarStyle: 'light-content'
}

CommonHeader.propsType = {
  title: PropTypes.String,
  hasTabs: PropTypes.bool,
  hasMenu: PropTypes.bool,
  canBack: PropTypes.bool,
  hasRight: PropTypes.bool,
  rightIcon: PropTypes.String,
  rightClick: PropTypes.func,
  leftElement: PropTypes.element, // 优先级高于前面的left right
  rightElement: PropTypes.element,  // 优先级高于前面的left right
  headerStyle: PropTypes.object,
  titleStyle: PropTypes.object,
  leftStyle: PropTypes.object,
  textColor: PropTypes.String,
  iosBarStyle: PropTypes.String,
}

export default CommonHeader
