import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  WebView,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet
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
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar'
//utils
import ToastUtil from "../utils/ToastUtil";
import Colors from "../utils/Colors";
import GLOBAL_PARAMS from "../utils/global_params";
//api
import api from "../api";
//components
import Loading from "../components/Loading";
import CommonHeader from "../components/CommonHeader";
import RecommendShop from "../components/RecommandShop";
import BlankPage from '../components/BlankPage';
//styles
import index_style from "../styles/index.style";

export default class ContentView extends Component {
  state = {
    favoriteChecked: false,
    canteenData: null,
    loading: true
  };

  componentDidMount() {
    // console.log(this.props);
    if(this.props.navigation.state.params.kind === "article") {
      return;
    }
    for (let item of this.props.screenProps.shopList.data) {
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
    if (this.props.screenProps.user === null) {
      ToastUtil.show("請先登錄哦", 1000, "bottom", "warning");
      this.props.navigation.navigate('Login');
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
      this.props.screenProps.stockShop(this.props.navigation.state.params.data);
      ToastUtil.show("收藏成功", 1000, "bottom", "success");
    } else {
      this.setState({
        favoriteChecked: false
      });
      this.props.screenProps.deleteShop(this.props.navigation.state.params.data.id);
      ToastUtil.show("取消收藏", 1000, "bottom", "warning");
    }
  }

  _renderContentView = () => (
    <Content>
      <Card style={{ flex:1,margin:0 ,borderWidth:0}}>
        <CardItem>
          <Left>
            <Thumbnail style={{width:100, height:100,borderRadius: 50,}} size={120} source={{ uri: this.state.canteenData.image }} />
            <Body>
              <Text note style={{marginTop:5,marginBottom: 5}}>{this.state.canteenData.name}</Text>
              <Text note style={{marginTop:5,marginBottom: 5}}>{this.state.canteenData.address}</Text>
              <Text note style={{marginTop:5,marginBottom: 5}}>價格：${this.state.canteenData.price}</Text>
              <Text note style={{marginTop:5,marginBottom: 5}}>評分：{this.state.canteenData.rate}</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem>
          <Body>
            <View style={[styles.subtitle,{borderLeftColor: this.props.screenProps.theme}]}>
              <Text>餐廳菜品</Text>
            </View>
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
                  indicator={ProgressBar}
                  indicatorProps={{color:this.props.screenProps.theme}}
                  source={{ uri: item.foodImage }}
                />
              ))
            ) : <BlankPage message="暫無菜品數據"/>}

          </Body>
        </CardItem>
        <CardItem>
        <Body>
          <View style={[styles.subtitle,{borderLeftColor: this.props.screenProps.theme,marginBottom: 10}]}>
            <Text>餐廳推薦</Text>
          </View>
          {
            RecommendShop({list: this.state.canteenData.recommendCanteen,...this['props']})
          }
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
      <Container>
        <Header style={{backgroundColor: this.props.screenProps.theme}} iosBarStyle="light-content">
          <Left>
          <Button transparent onPress={() => this.props.navigation.goBack()}>
            <Icon size={20} name="ios-arrow-back" style={{fontSize:25,color: Colors.main_white}}/>
          </Button></Left>
          <Body><Text style={{color: Colors.main_white}}>{this.props.navigation.state.params.kind === 'canteen' ? '餐廳詳情' : '文章詳情'}</Text></Body>
          <Right><Button transparent onPress={() => this._addNewsToFavorite()}>
          {this.state.favoriteChecked ? (
            <Icon
              name="md-heart"
              style={{ fontSize: 20, color: Colors.main_white }}
            />
          ) : (
            <Icon
              name="md-heart-outline"
              style={{ color: Colors.main_white, fontSize: 25 }}
            />
          )}
          </Button>
          <Button transparent onPress={() => this.props.navigation.navigate('Comment',{comment: this.state.canteenData.comment})}>
            <Icon name="md-chatboxes" style={{ fontSize: 25, color: Colors.main_white }}/>
          </Button>
          <Button transparent onPress={() => ToastUtil.show("分享功能暫未開放...", 1000, "bottom", "warning")}>
            <Icon name="md-share" style={{ fontSize: 23, color: Colors.main_white }}/>
          </Button>
          </Right>
        </Header>
        <Content>
            {this.props.navigation.state.params.kind === "article"
            ? this._renderArticleContentView()
            : null}
          {this.state.canteenData !== null ? this._renderContentView() : null}
        </Content>
    </Container>

    );
  }
}


const styles = StyleSheet.create({
  subtitle: {
    borderLeftWidth: 6,
    paddingLeft: 10,
  }
})