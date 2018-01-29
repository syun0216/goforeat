import React,{Component} from 'react'
import {View,Text} from 'react-native'
import {Container,Header,Body,Right,Left,Button, Icon, Title,Content } from 'native-base'

export default class PeopleView extends Component{
  render() {
    return (
      <Container>
        <Header />
        <Content>
          <Text>个人详情</Text>
        </Content>
      </Container>
    )
  }
}
