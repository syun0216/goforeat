import React, { Component } from "react";
import { View,Image,TouchableOpacity } from "react-native";
import { Container, Header,Title,Right, Content,Badge, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body,Footer } from 'native-base';
//utils
import ToastUtil from "../utils/ToastUtil";
import Colors from "../utils/Colors";
import GLOBAL_PARAMS from '../utils/global_params'
//api
import api from '../api'
export default class ContentView extends Component {
  state = {
    favoriteChecked: false,
    canteenData:null
  };

  componentWillMount(){
    if(this.props.navigation.state.params.kind === 'canteen'){
     this.getCanteenDetail()
    }
  }

  //api
  getCanteenDetail(){
    api.getCanteenDetail(1).then(data => {
      if(data.status === 200 && data.data.ro.ok) {
        this.setState({
          canteenData:data.data.data
        })
      }
    })
  }
  addNewsToFavorite() {
    if (!this.state.favoriteChecked) {
      this.setState({
        favoriteChecked: true
      });
      ToastUtil.show("收藏成功", 1000, "bottom", "success");
    } else {
      this.setState({
        favoriteChecked: false
      });
      ToastUtil.show("取消收藏", 1000, "bottom", "warning");
    }
  }

  _renderContentView = () => (
          <Card style={{flex: 0}}>
            <CardItem>
              <Left>
                <Thumbnail source={{uri: this.state.canteenData.image}} />
                <Body>
                  <Text>{this.state.canteenData.name}</Text>
                  <Text note>{this.state.canteenData.address}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
                <Text>餐廳菜品</Text>
                {this.state.canteenData.foods.map((item,idx) => (
                  <Image key={idx}
                    style={{
                      width:GLOBAL_PARAMS._winWidth*0.91,
                      height:200,
                      marginTop:10,
                      marginBottom:10
                    }}
                    source={{uri:item.foodImage}}/>
                ))}
              </Body>
            </CardItem>
          </Card>
  )

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: "#fff" }}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon
                size={20}
                name="ios-arrow-back"
                style={{ fontSize: 25, color: Colors.main_orange }}
              />
            </Button>
          </Left>
          <Body>
            <Title style={{ color: "#707070" }}>
              {this.props.navigation.state.params.data.name}
            </Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.addNewsToFavorite()}>
              {this.state.favoriteChecked ? (
                <Icon
                  name="md-heart"
                  style={{ fontSize: 20, color: Colors.main_orange }}
                />
              ) : (
                <Icon
                  name="md-heart-outline"
                  style={{ color: "#ff5858", fontSize: 20 }}
                />
              )}
            </Button>
          </Right>
        </Header>
        <Content>
          {this.state.canteenData !== null ? this._renderContentView() : null}
        </Content>
        {this.state.canteenData !== null ?(<Footer style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
          <Text style={{flex:1}}>價格:{this.state.canteenData.price}</Text>
          <Text style={{flex:1}}>評分:{this.state.canteenData.rate}</Text>
          <TouchableOpacity transparent style={{flex:1,flexDirection:'row',alignSelf:'center'}}>
            <Text style={{color:Colors.main_orange}}>评论</Text>
            {/* <Badge style={{marginLeft:10,paddiBottom:10}}>
             <Text>2</Text>
           </Badge> */}
          </TouchableOpacity>
        </Footer>) : null}
      </Container>
    );
  }
}
