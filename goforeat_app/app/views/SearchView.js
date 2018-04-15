import React, { Component } from "react";
import {
  Container,
  Header,
  Item,
  Input,
  Icon,
  Button,
  Text,
  ListItem,
  Thumbnail,
  Left,
  Body,
  Right,
  Content
} from "native-base";
import Image from "react-native-image-progress";
//api
import api from "../api";
import source from "../api/CancelToken";
//utils
import ToastUtil from "../utils/ToastUtil";
import GLOBAL_PARAMS from '../utils/global_params';

export default class SearchView extends Component {
  _textInput = null;
  _timer = null;
  state = {
    searchData: null
  };

  componentDidMount = () => {
    this._timer = setTimeout(() => {
      if(this._textInput !== null) {
        this._textInput.wrappedInstance.focus();
      }
      clearTimeout(this._timer);
    },500)
  }

  componentWillUnmount = () => {
    source.cancel();
    clearTimeout(this._timer);
  };

  //common functions
  _onSubmitSearch = content => {
    api.searchCanteenWithName(content).then(
      data => {
        // console.log(data);
        if (data.status === 200 && data.data.ro.ok) {
          if (data.data.data.length === 0) {
            ToastUtil.showWithMessage("暫無篩選數據哦");
            return;
          }
          this.setState({
            searchData: data.data.data
          });
        } else {
          ToastUtil.showWithMessage("獲取數據失敗");
        }
      },
      () => {
        ToastUtil.showWithMessage("獲取數據失敗");
      }
    );
  };

  _toContentView = item => {
    // this.props.navigation.replace('Content',{
    //   data:item,
    //   kind:'canteen'
    // })
    // const resetAction = NavigationActions.reset({
    //     index: 1,
    //     actions: [
    //         NavigationActions.navigate( { routeName: 'Content',params:{
    //           data:item,
    //           kind:'canteen'
    //         }}),
    //     ],
    // });
    // this.props.navigation.dispatch(resetAction);
  };

  _renderSearchListView = () =>
    this.state.searchData.map((item, index) => (
      <ListItem
        avatar
        key={index}
        style={{ backgroundColor: "#fff", marginLeft: 0 }}
        onPress={() =>
          this.props.navigation.navigate("Content", {
            data: item,
            kind: "canteen"
          })
        }
      >
        <Left>
          <Image
              style={{ width: GLOBAL_PARAMS._winWidth*0.2, height: GLOBAL_PARAMS._winHeight*0.2 }}
              imageStyle={{ borderRadius: GLOBAL_PARAMS._winWidth*0.2 / 2 }}
              source={{
                  uri: item.image,
              }}
          />
        </Left>
        <Body style={{ borderBottomWidth: 0 }}>
          <Text>{item.name}</Text>
          <Text note style={{ fontSize: 13 }}>
            地址：{item.address}
          </Text>
          <Text note>评分：{item.rate}</Text>
        </Body>
        <Right style={{ borderBottomWidth: 0 ,justifyContent:'center'}}>
          <Text note style={{ color: "#ff5858", fontSize: 18 }}>
            ${item.price}
          </Text>
        </Right>
      </ListItem>
    ));

  render() {
    return (
      <Container>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input
              ref={(t) => this._textInput = t}
              placeholder="輸入商品名稱"
              multiline={false}
              clearButtonMode="while-editing"
              returnKeyType="search"
              onSubmitEditing={event =>
                this._onSubmitSearch(event.nativeEvent.text)
              }
            />
            {/* <Icon name="ios-people" /> */}
          </Item>
          <Button transparent onPress={() => this.props.navigation.goBack()}>
            <Text style={{ color: this.props.screenProps.theme }}>取消</Text>
          </Button>
        </Header>
        <Content>
          {this.state.searchData !== null ? this._renderSearchListView() : null}
        </Content>
      </Container>
    );
  }
}
