import React,{PureComponent} from 'react'
import {View,Text} from 'react-native'
import {Container,Body,Button,Icon} from 'native-base'
//utils
import Colors from './utils/Colors'
//components
import CommonHeader from './components/CommonHeader'

export default class SettingView extends PureComponent{
  render() {
    return (
      <Container>
        <CommonHeader title="系統設置" canBack {...this['props']}/>
      </Container>
    )
  }
}
