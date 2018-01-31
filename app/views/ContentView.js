import React, { Component } from "react";
import { View, Text } from "react-native";
import {
  Container,
  Header,
  Body,
  Right,
  Left,
  Button,
  Icon,
  Title,
  Content
} from "native-base";
//utils
import ToastUtil from "../utils/ToastUtil";
import Colors from "../utils/Colors";

export default class ContentView extends Component {
  state = {
    favoriteChecked: false
  };

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
          <Text>内容页</Text>
        </Content>
      </Container>
    );
  }
}
