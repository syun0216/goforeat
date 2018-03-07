import React, { Component } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  WebView,
  SafeAreaView,
  ScrollView,
  StatusBar
} from "react-native";
import {
  Container,
  Header,
  Title,
  Right,
  Content,
  Badge,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Footer
} from "native-base";
//utils
import ToastUtil from "../utils/ToastUtil";
import Colors from "../utils/Colors";
import GLOBAL_PARAMS from "../utils/global_params";
//api
import api from "../api";
//components
import Loading from "../components/Loading";
import CommonHeader from "../components/CommonHeader";
//styles
import index_style from "../styles/index.style";

export default class ContentView extends Component {
  state = {
    favoriteChecked: false,
    canteenData: null,
    loading: true
  };

  componentDidMount() {
    for (let item of this.props.shopList.data) {
      if (
        item !== null &&
        item.id === this.props.navigation.state.params.data.id
      ) {
        this.setState({
          favoriteChecked: true
        });
      }
    }
    if (this.props.navigation.state.params.kind === "canteen") {
      this.getCanteenDetail();
    }
  }

  componentWillUnmount() {
    this.setState({
      canteenData: null
    });
  }

  //api
  getCanteenDetail() {
    api
      .getCanteenDetail(this.props.navigation.state.params.data.id)
      .then(data => {
        if (data.status === 200 && data.data.ro.ok) {
          console.log(data.data);
          this.setState({
            canteenData: data.data.data
          });
        }
      });
  }

  _addNewsToFavorite() {
    if (this.props.user === null) {
      ToastUtil.show("請先登錄哦", 1000, "bottom", "warning");
      return;
    }
    if (this.props.navigation.state.params.kind === "article") {
      ToastUtil.show("暫未開放收藏文章", 1000, "bottom", "warning");
      return;
    }
    if (!this.state.favoriteChecked) {
      this.setState({
        favoriteChecked: true
      });
      this.props.stockShop(this.props.navigation.state.params.data);
      ToastUtil.show("收藏成功", 1000, "bottom", "success");
    } else {
      this.setState({
        favoriteChecked: false
      });
      this.props.deleteShop(this.props.navigation.state.params.data.id);
      ToastUtil.show("取消收藏", 1000, "bottom", "warning");
    }
  }

  _renderContentView = () => (
    <Content>
      <Card style={{ flex: 0,margin:0 ,borderWidth:0}}>
        <CardItem>
          <Left>
            <Thumbnail source={{ uri: this.state.canteenData.image }} />
            <Body>
              <Text>{this.state.canteenData.name}</Text>
              <Text note>{this.state.canteenData.address}</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem>
          <Body>
            <Text>餐廳菜品</Text>
            {this.state.canteenData.foods.length > 0 ? (
              this.state.canteenData.foods.map((item, idx) => (
                <Image
                  key={idx}
                  style={{
                    width: GLOBAL_PARAMS._winWidth * 0.91,
                    height: 200,
                    marginTop: 10,
                    marginBottom: 10
                  }}
                  source={{ uri: item.foodImage }}
                />
              ))
            ) : (
              <View style={{ marginTop: 10 }}>
                <Text>暫無菜品數據</Text>
              </View>
            )}
          </Body>
        </CardItem>
      </Card>
    </Content>
  );

  _renderArticleContentView = () => (
    <WebView
      bounces={true}
      scalesPageToFit={true}
      source={{ uri: this.props.navigation.state.params.data.url }}
      style={{
        width: GLOBAL_PARAMS._winWidth,
        height: GLOBAL_PARAMS._winHeight
      }}
    />
  );

  render() {
    return (
      <SafeAreaView style={index_style.safeArea}>
        <View style={index_style.container}>
            <StatusBar
              translucent={true}
              backgroundColor={'#fff'}
              barStyle={'light-content'}
            />

            <ScrollView
              style={index_style.scrollview}
              scrollEventThrottle={200}
              directionalLockEnabled={true}
            >
            {this.props.navigation.state.params.kind === "article"
            ? this._renderArticleContentView()
            : null}

          {this.state.canteenData !== null ? this._renderContentView() : null}
            </ScrollView>
        </View>
        <Footer style={{display:'flex',backgroundColor:'#fff',flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{flex:1,justifyContent:'center',alignItems:'flex-start',marginLeft:20}}><Icon
          size={20}
          name="ios-arrow-back"
          style={{ fontSize: 25, color: this.props.theme }}
          /></TouchableOpacity>
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>
          {this.props.navigation.state.params.kind === 'canteen' ? '餐廳詳情' : '文章詳情'}
          </Text></View>
          <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'flex-end',marginRight:20}} transparent onPress={() => this._addNewsToFavorite()}>
              {this.state.favoriteChecked ? (
                <Icon
                  name="md-heart"
                  style={{ fontSize: 20, color: this.props.theme }}
                />
              ) : (
                <Icon
                  name="md-heart-outline"
                  style={{ color: this.props.theme, fontSize: 20 }}
                />
              )}
            </TouchableOpacity>
        </Footer>
    </SafeAreaView>
      
    );
  }
}
