import React,{PureComponent} from 'react'
import {View,Text} from 'react-native'
import {Container,Header,Left,Body,Right,Button,Icon} from 'native-base'
//utils
import Colors from './utils/Colors'

export default class SettingView extends PureComponent{
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon
                size={20}
                name="ios-arrow-back"
                style={{ fontSize: 25, color: Colors.main_orange }}
              />
            </Button>
          </Left>
          <Body><Text>系統設置</Text></Body>
          <Right />
        </Header>
      </Container>
    )
  }
}
