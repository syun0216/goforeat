import React from "react";
import { View, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-navigation";
import { Container } from "native-base";
import LinearGradient from "react-native-linear-gradient";
//utils
import Colors from "../utils/Colors";
import GLOBAL_PARAMS from "../utils/global_params";
import { isIphoneXr } from "../utils/DeviceInfo";

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

const linearAndroid = {
  height: StatusBar.currentHeight,
  width: GLOBAL_PARAMS._winWidth,
};

const SafeView = props => (
  <SafeAreaView style={[{ flex: 1, backgroundColor: "transparent" },props.style]} forceInset={props.forceInset}>
    {props.mode != 'none' ? props.mode == "default" ? (
      <View style={[styles,{backgroundColor: props.statusbarColor}]} />
    ) : (
      <LinearGradient
        colors={['#FF7A00', '#FE560A']}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 0.0 }}
        style={Platform.OS == 'ios' ? linear : linearAndroid}
      />
    ) : null}
    <Container style={{marginTop: isIphoneXr() ? 20 : 0}}>
      <StatusBar barStyle={props.barStyle} backgroundColor='transparent' translucent/>
      {props.children}
    </Container>
  </SafeAreaView>
);

SafeView.defaultProps = {
  mode: 'default',
  statusbarColor: Colors.main_white,
  barStyle: "light-content",
  forceInset: {
    bottom: 'never'
  }
}

const common = props => <Container>{props.children}</Container>;

export default {
  SafeView,
  common
};
