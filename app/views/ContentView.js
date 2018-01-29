import React,{Component} from 'react'
import {View,Text} from 'react-native'
import {Container,Header,Body,Right,Left,Button, Icon, Title,Content } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ToastUtil from '../utils/ToastUtil';

export default class ContentView extends Component {

  state = {
    favoriteChecked: false
  }

  componentDidMount(){
    console.log(this.props)
  }

  addNewsToFavorite() {
      if (!this.state.favoriteChecked) {
          this.setState({
              favoriteChecked: true
          });
          ToastUtil.show('收藏成功', 1000, 'bottom', 'success');
      }
      else {
          this.setState({
              favoriteChecked: false
          });
          ToastUtil.show('取消收藏', 1000, 'bottom', 'warning');
      }
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='arrow-back' style={{color:'#f07341'}}/>
            </Button>
          </Left>
          <Body>
            <Title>{this.props.navigation.state.params.data.name}</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.addNewsToFavorite()}>
              {this.state.favoriteChecked ?
                  <MaterialIcons name='favorite' style={{fontSize: 20, color: '#ff5858'}}/> :
                  <MaterialIcons name="favorite-border" style={{color:'#ff5858',fontSize: 20}}/>}
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
