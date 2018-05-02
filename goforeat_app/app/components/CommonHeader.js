import React from 'react'
import PropTypes from 'prop-types'
import {Header,Left,Body,Right,Icon,Button,Text} from 'native-base'
//utils
import Colors from '../utils/Colors'

const CommonHeader = (props) => {
  return (
  <Header style={[{backgroundColor:props.screenProps.theme},props.headerStyle]} iosBarStyle={props.iosBarStyle}>
    <Left>
      {props.canBack ? (props.leftElement !== null ? (<props.leftElement {...props}/>) : (
        <Button transparent onPress={() => props.navigation.goBack()}>
          <Icon
            size={20}
            name="ios-arrow-back"
            style={[{ fontSize: 25, color: props.textColor }]}
          />
        </Button>
      )) : null}
    </Left>
    <Body><Text style={[{color: props.textColor},props.titleStyle]} numberOfLines={1}>{props.title}</Text></Body>
    <Right>
      {props.hasRight ? (props.rightElement !== null ? <props.rightElement {...props}/> : (
        <Icon onPress={() => props.rightClick} name={props.rightIcon} size={25} style={{color: Colors.main_white}} />
      )) : null}
    </Right>
  </Header>
)}

CommonHeader.defaultProps = {
  title: '詳情',
  canBack:false,
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
