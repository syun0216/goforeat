import React, { Component } from "react";
import { Image, TouchableOpacity,ScrollView,Platform } from "react-native";
import {
  Container,
  Content,
  Header,
  View,
  DeckSwiper,
  Card,
  Button,
  CardItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Icon
} from "native-base";
//components
import CommonHeader from "../components/CommonHeader";
//api
import api from "../api";
//utils
import GLOBAL_PARAMS from '../utils/global_params';

export default class ArticleView extends Component {
  state = {
    shopDetail: null
  };
  componentDidMount = () => {
    this.getRecommendList();
  };
  //api
  getRecommendList = () => {
    api.recommendShop().then(data => {
      // console.log(data);
      if (data.status === 200 && data.data.ro.ok) {
        this.setState({
          shopDetail: data.data.data
        });
      }
    });
  };
  _renderDeskSwiper = () => (
    <DeckSwiper
      ref={c => (this._deckSwiper = c)}
      dataSource={this.state.shopDetail}
      renderEmpty={() => (
        <View style={{ alignSelf: "center" }}>
          <Text>沒有更多了</Text>
        </View>
      )}
      renderItem={item => (
        <Card style={{ elevation: 3 }}>
          <CardItem>
            <Left>
              <Thumbnail source={{uri: item.image}} />
              <Body>
                <Text note>{item.name}</Text>
                <Text note style={{marginTop: 5}}>{item.address}</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem cardBody>
            <Image style={{ height: 300, flex: 1 }} source={{uri: item.image}} />
          </CardItem>
          <CardItem>
            <Icon name="md-card" style={{ color: this.props.screenProps.theme }} />
            <Text>${item.price}</Text>
          </CardItem>
        </Card>
      )}
    />
  );
  render() {
    return (
      <Container>
        <CommonHeader title="線下餐廳" {...this["props"]} />
        {this.state.shopDetail !== null ? this._renderDeskSwiper() : null}

        <View
          style={{
            flexDirection: "row",
            flex: 1,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "space-around",
            alignItems:'center',
            padding: 15,
            // backgroundColor: this.props.screenProps.theme,
            height: GLOBAL_PARAMS._winHeight *0.15
          }}
        >
        <Button
        transparent
        iconRight
        onPress={() => this._deckSwiper._root.swipeRight()}
      >
      <Image style={Platform.OS==='ios'?{width:72,height:72}:{width:50,height:50}} source={{uri:'dislike'}}/>
      </Button>
          <Button
            style={{}}
            transparent
            onPress={() =>
              this.props.navigation.navigate("Content", {
                data: this._deckSwiper._root.state.selectedItem,
                kind: 'canteen'
              })
            }
          >
            <Image style={Platform.OS==='ios'?{width:72,height:72}:{width:50,height:50}} source={{uri:'like'}}/>
          </Button>
         
          </View>
      </Container>
    );
  }
}
