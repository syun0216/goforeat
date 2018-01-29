import React,{Component} from 'react'
import {View,FlatList,Image} from 'react-native'
import {Container,Header,Content,List,ListItem,Left,Body,Right,Thumbnail,Button,Text} from 'native-base'
import FeatherIcon from 'react-native-vector-icons/Feather'
//api
import api from '../api'

export default class GoodsListPageView extends Component{
  state = {
    canteenDetail: []
  }
  componentDidMount() {
    api.getCanteenDetail(1).then(data => {
      if(data.status === 200 && data.data.data.length > 0) {
        // console.log(data.data.data)
        this.setState({
          canteenDetail: data.data.data
        })
      }
    })
  }

  _renderFlatListItem(data,key) {
    return (
      this.state.canteenDetail.map((item,idx) => (
        <ListItem avatar key={idx} onPress={() =>this.props.navigation.navigate('Content',{
          data:item
        })}>
          <Left>
            <Thumbnail size={10}  source={{uri:item.image}} />
          </Left>
          <Body>
            <Text>{item.name}</Text>
            <Text note style={{fontSize:13}}>地址：{item.address}</Text>
            <Text note>评分：{item.rate}</Text>
          </Body>
          <Right>
            <Text note style={{color:'#ff5858'}}>${item.price}</Text>
          </Right>
        </ListItem>
      ))
    )
  }


    render(){
      return (
        <Container>
          <Header>
            <Left>
              <Image style={{width:40,height:40}} source={require('../asset/eat.png')}/>
            </Left>
            <Body>
              <Text>Goforeat</Text>
            </Body>
            <Right><FeatherIcon name="search" size={30} style={{color: '#f07341'}} /></Right>
          </Header>
          <Content>
            {this.state.canteenDetail.length > 0 ? this._renderFlatListItem() : null}
          </Content>
        </Container>
      )
    }
}
