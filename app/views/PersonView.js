import React,{Component} from 'react'
import {View,Text,TouchableOpacity} from 'react-native'
import {Container,Header,Body,Right,Left,Button, Icon, Title,Content } from 'native-base'


export default class PeopleView extends Component{
  componentDidMount() {
  }
  render() {
    return (
      <Container>
        <Header style={{backgroundColor: '#fff'}}>
          <Body><Text>個人詳情</Text></Body>
        </Header>
        <Content>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
            <View style={{ alignSelf: "center",justifyContent:"center" }}>
              <Text>未登錄，請先登錄哦</Text>
            </View>
          </TouchableOpacity>
        </Content>
      </Container>
    )
  }
}
