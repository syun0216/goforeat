import React from 'react'
import PropTypes from 'prop-types'
import {Header,Left,Body,Right,Icon,Button,Text} from 'native-base'
//utils
import Colors from '../utils/Colors'

const CommonHeader = (props) => (
  <Header style={[{backgroundColor:props.screenProps.theme},props.style]} iosBarStyle="light-content">
    <Left>
      {props.canBack ? (props.leftElement !== null ? (<props.leftElement {...props}/>) : (
        <Button transparent onPress={() => props.navigation.goBack()}>
          <Icon
            size={20}
            name="ios-arrow-back"
            style={{ fontSize: 25, color: Colors.main_white }}
          />
        </Button>
      )) : null}
    </Left>
    <Body><Text style={{color: Colors.main_white}}>{props.title}</Text></Body>
    <Right>
      {props.hasRight ? (props.rightElement !== null ? <props.rightElement {...props}/> : (
        <Icon onPress={() => props.rightClick} name={props.rightIcon} size={25} style={{color: Colors.main_white}} />
      )) : null}
    </Right>
  </Header>
)

CommonHeader.defaultProps = {
  title: '詳情',
  canBack:false,
  hasRight: false,
  leftElement: null,
  rightElement: null,
  style:{}
}

CommonHeader.propsType = {
  title: PropTypes.String,
  canBack: PropTypes.bool,
  hasRight: PropTypes.bool,
  rightIcon: PropTypes.String,
  rightClick: PropTypes.func,
  leftElement: PropTypes.element, // 优先级高于前面的left right
  rightElement: PropTypes.element,  // 优先级高于前面的left right
  style: PropTypes.object
}

export default CommonHeader
