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
import Loading from '../components/Loading';
import ErrorPage from "../components/ErrorPage";
//api
import api from "../api";
//utils
import GLOBAL_PARAMS from '../utils/global_params';
import ToastUtil from '../utils/ToastUtil';
//language
import i18n from '../language/i18n';

export default class ArticleView extends Component {
  _current_offset = 0
  state = {
    shopDetail: null,
    loading: false,
    isError: false,
    i18n: i18n[this.props.screenProps.language]
  };
  componentDidMount = () => {
    this._current_offset = 0;
    this.getRecommendList();
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
        i18n: i18n[nextProps.screenProps.language]
      })
  }
  //api
  getRecommendList = () => {
    api.recommendShop(10,this._current_offset).then(data => {
      // console.log(data);
      if (data.status === 200 && data.data.ro.ok) {
        if(data.data.data.length === 0) {
          ToastUtil.showWithMessage('沒有更多數據了...');
          this.setState({
            loading: false
          });
          return;
        }
        this.setState({
          shopDetail: data.data.data,
          loading: false
        });
      }
    },() => {
      if(this._current_offset > 0) {
        this._current_offset -= 10;
      } 
      this.setState({ isError: true,loading: false });
    });
  };

  _refresh = () => {
    this._current_offset += 10;
    this.setState({
        loading: true
    });
    this.getRecommendList();
  }

  _renderDeskSwiper = () => {
    let _imgHeight = GLOBAL_PARAMS._winWidth < 350 ? GLOBAL_PARAMS._winHeight*0.34 : GLOBAL_PARAMS._winHeight*0.5;
    _imgHeight = Platform.OS === 'android' ? GLOBAL_PARAMS._winHeight*0.6 : _imgHeight;
    return (
    <DeckSwiper
      ref={c => (this._deckSwiper = c)}
      dataSource={this.state.shopDetail}
      renderEmpty={() => (
        <View style={{ alignSelf: "center",marginTop: 100 }}>
          <Text>{this.state.i18n.nodata_text}</Text>
        </View>
      )}
      renderItem={item => (
        <Card style={{ elevation: 3,height:_imgHeight }}>
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
            <Image style={{ height: _imgHeight, flex: 1 }} source={{uri: item.image}} />
          </CardItem>
          <CardItem>
            <Icon name="md-card" style={{ color: this.props.screenProps.theme }} />
            <Text>${item.price}</Text>
          </CardItem>
        </Card>
      )}
    />
  );}
  render() {
    const {i18n} = this.state;
    return (
      <Container>
        <CommonHeader title={i18n.offline_title} canBack {...this["props"]} />
        {this.state.loading ? <Loading /> : null}
        {this.state.isError ? (
          <ErrorPage errorTips={i18n.load_failed} errorToDo={this.getRecommendList} />
        ) : null}
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
            transparent
            style={{ flexDirection: "row" }}
            onPress={() => this._refresh()}
          >
            <Icon
              name="md-refresh"
              style={{ fontSize: 40, color: this.props.screenProps.theme }}
            />
            <Text style={{ fontSize: 18, color: this.props.screenProps.theme,textAlignVertical:'center' }}>
              {i18n.change_other}
            </Text>
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
