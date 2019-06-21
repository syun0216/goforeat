import React from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image
} from "react-native";
import LottieView from 'lottie-react-native';
// utils
import GLOBAL_PARAMS, { em } from "../utils/global_params";
import Colors from "../utils/Colors";

const styles = StyleSheet.create({
  loadingContainer: {
    position:'absolute',
    top:0,
    left:0,
    bottom: 0,
    right: 0,
    flex:1,
    backgroundColor: 'transparent',
    justifyContent: "center",
    zIndex: 10000,
  },
  loadingContainerAndroid: {
    position: "absolute",
    top: 0,
    left: 0,
    flex: 1,
    justifyContent: "center",
    backgroundColor: 'transparent',
    width: GLOBAL_PARAMS._winWidth,
    height: GLOBAL_PARAMS._winHeight,
    zIndex: 10
  }
});

const Loading = props => {
  return (
    <View
      style={[
        Platform.OS === "ios"
          ? styles.loadingContainer
          : styles.loadingContainerAndroid,
        props.style
      ]}
    >
      <View
        style={{
          alignSelf: "center",
          width: em(80),height: em(80),
          borderRadius: em(40),
          backgroundColor: 'rgba(255,255,255,1)',
          // padding: 10,
        }}
      >
        {/* <Image
          source={require("../asset/Coffeeloading.gif")}
          style={{ width: em(60), height: em(50)}}
          resizeMode="contain"
        /> */}
        <LottieView 
        autoPlay={true}
        source={require('../animations/loading.json')}
        loop={true}
        style={{width: em(80),height: em(80),transform:[{scale: 1.3}]}}
        />
        {/* <Text
          allowFontScaling={false}
          style={{
            color: Colors.fontBlack,
            marginTop: 10,
            fontSize: GLOBAL_PARAMS.em(14)
          }}
        >
          {props.message}
        </Text> */}
      </View>
    </View>
  );
};

Loading.defaultProps = {
  message: "Loading...",
  style: {}
};

Loading.propTypes = {
  message: PropTypes.string,
  style: PropTypes.object
};

export default Loading;
