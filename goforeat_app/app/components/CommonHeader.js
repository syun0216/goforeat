import React from 'react'
import PropTypes from 'prop-types'
import {StyleSheet,Platform} from 'react-native'
import {Header,Left,Body,Right,Icon,Button,Text} from 'native-base'
import LinearGradient from 'react-native-linear-gradient';
//utils
import Colors from '../utils/Colors';
import GLOBAL_PARAMS from "../utils/global_params";

const styles = StyleSheet.create({
  linearGradient: {
    height: 65,
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
  <Header style={[props.headerStyle]} hasTabs iosBarStyle={props.iosBarStyle}>
  <LinearGradient colors={['#FF7F0B','#FF1A1A']} start={{x:0.0, y:0.0}} end={{x:1.0,y: 0.0}} style={styles.linearGradient}>
    <Left>
      {props.canBack ? (props.leftElement !== null ? (<props.leftElement {...props}/>) : (
        <Button transparent onPress={() => {props.navigation.goBack();}}>
          <Icon
            size={20}
            name="ios-arrow-back"
            style={[{ fontSize: 25, color: props.textColor,paddingLeft: 10 }]}
          />
        </Button>
      )) : null}
    </Left>
    <Body><Text style={[{color: props.textColor},props.titleStyle]} numberOfLines={1}>{props.title}</Text></Body>
    <Right>
      {props.hasRight ? (props.rightElement !== null ? <props.rightElement {...props}/> : (
        <Button transparent onPress={() => props.rightClick()}>
        <Icon name={props.rightIcon} size={20} style={{color: Colors.main_white,paddingRight: 10}} /></Button>
      )) : null}
    </Right>
  </LinearGradient> 
  
  </Header>
)}

CommonHeader.defaultProps = {
  title: '詳情',
  canBack:false,
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
