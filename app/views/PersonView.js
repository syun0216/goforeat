import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
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
//cache
import appStorage from "../utils/appStorage";

export default class PeopleView extends Component {
  state = {
    user: this.props.user
  };
  componentDidMount() {
    console.log(this.props);
  }

  // shouldComponentUpdate = (nextProps, nextState) => {
  //   if(nextProps.user === this.state.user) {
  //     return false
  //   }
  // }

  //common function

  _renderNotLoginView() {
    return (
      <TouchableOpacity
        style={{ alignSelf: "center", marginTop: 100 }}
        onPress={() => this.props.navigation.navigate("Login")}
      >
        <View>
          <Text>未登錄，請先登錄哦</Text>
        </View>
      </TouchableOpacity>
    );
  }

  _renderIsLoginView() {
    return (
      <View style={{ alignSelf: "center" }}>
        <Text>您已經登錄了</Text>
        <TouchableOpacity
          onPress={() => {
            this.props.userLogout();
            this.setState({
              user: null
            });
          }}
        >
          <View>
            <Text>登出</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: "#fff" }}>
          <Body>
            <Text>個人詳情</Text>
          </Body>
        </Header>
        <Content>
          {this.state.user !== null
            ? this._renderIsLoginView()
            : this._renderNotLoginView()}
        </Content>
      </Container>
    );
  }
}
