import React,{Component} from 'react'
import {View,Text,TouchableOpacity} from 'react-native'
import {Container,Header,Body,Right,Left,Button, Icon, Title,Content } from 'native-base'


export default class PeopleView extends Component{
  componentDidMount() {
  }

  _renderNotLoginView() {
    return (
        <TouchableOpacity style={{alignSelf:'center',marginTop:100}} onPress={() => this.props.navigation.navigate('Login')}>
          <View>
            <Text>未登錄，請先登錄哦</Text>
          </View>
        </TouchableOpacity>
    )
  }

  render() {
    return (
      <Container>
        <Header style={{backgroundColor: '#fff'}}>
          <Body><Text>個人詳情</Text></Body>
        </Header>
        <Content>
          {this._renderNotLoginView()}
        </Content>
      </Container>
    )
  }
}
