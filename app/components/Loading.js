import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
// utils
import GLOBAL_PARAMS from "../utils/global_params";
import Colors from "../utils/Colors";

const styles = StyleSheet.create({
  loadingContainer: {
    // position:'absolute',
    // top:0,
    // left:0,
    // flex:1,
    justifyContent: "center",
    zIndex: 10000,
    backgroundColor: "transparent",
    height: GLOBAL_PARAMS._winHeight
  }
});

const Loading = props => {
  return (
    <View style={styles.loadingContainer}>
      <View
        style={{
          alignSelf: "center",
          backgroundColor: Colors.main_white,
          borderRadius: 20,
          opacity: 0.5,
          padding: 25
        }}
      >
        <ActivityIndicator size="small" />
        <Text style={{ color: "#222", marginTop: 10,fontSize: 14 }}>{props.message}</Text>
      </View>
    </View>
  );
};

Loading.defaultProps = {
  message: "正在加載中..."
};

Loading.propTypes = {
  message: PropTypes.string
};

export default Loading;
