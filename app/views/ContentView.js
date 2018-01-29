import React,{Component} from 'react'
import {View,Text} from 'react-native'
import {Container,Header,Body,Right,Left,Button, Icon, Title,Content } from 'native-base'

export default class ContentView extends Component {
  componentDidMount(){
    console.log(this.props)
  }
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>{this.props.navigation.state.params.data.name}</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name='menu' />
            </Button>
          </Right>
        </Header>
        <Content>
          <Text>内容页</Text>
        </Content>
      </Container>
    )
  }
}
