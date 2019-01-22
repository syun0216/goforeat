import React from "react";
import { View, Text, StatusBar } from "react-native";
import { SafeAreaView } from "react-navigation";
import { Container } from "native-base";
import LinearGradient from "react-native-linear-gradient";
//utils
import Colors from "../utils/Colors";
import GLOBAL_PARAMS from "../utils/global_params";

const styles = {
  position: "absolute",
  top: 0,
  height: GLOBAL_PARAMS.isIphoneX() ? 44 : 20,
  width: GLOBAL_PARAMS._winWidth,
  backgroundColor: Colors.main_white,
  zIndex: 10
};

const linear = {
  height: GLOBAL_PARAMS.isIphoneX() ? 44 : 20,
  width: GLOBAL_PARAMS._winWidth,
  position: "absolute",
  top: 0,
  zIndex:10
};

const SafeView = props => (
  <SafeAreaView style={[{ flex: 1, backgroundColor: "transparent" },props.style]}>
    {props.mode == "default" ? (
      <View style={[styles,{backgroundColor: props.statusbarColor}]} />
    ) : (
      <LinearGradient
        colors={['#FF7F0B', '#FF1A1A']}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 0.0 }}
        style={linear}
      />
    )}
    <Container>
      <StatusBar barStyle={props.barStyle} androidStatusBarColor="#666"/>
      {props.children}
    </Container>
  </SafeAreaView>
);

SafeView.defaultProps = {
  mode: 'default',
  statusbarColor: Colors.main_white,
  barStyle: "light-content"
}

const common = props => <Container>{props.children}</Container>;

export default {
  SafeView,
  common
};
