import React, { Component } from "react";
import { Text } from 'react-native';
import PropTypes from "prop-types";
import Antd from "react-native-vector-icons/AntDesign";
import PopupDialog, {
  SlideAnimation
} from "react-native-popup-dialog";
import FastImage from "react-native-fast-image";
//utils
import GLOBAL_PARAMS, {em} from "../utils/global_params";

const slideAnimation = new SlideAnimation({
  slideFrom: "bottom"
});

let _popupDialog = null;

const previewPlaceImg = ({title, img, getRef}) => (
  <PopupDialog
    ref={popupDialog => {
      _popupDialog = popupDialog;
      getRef(popupDialog);
    }}
    width={GLOBAL_PARAMS._winWidth - em(35)}
    height={em(255)}
    dialogAnimation={slideAnimation}
    actions={[
      <Antd
        name="closecircleo"
        style={{
          width: em(40),
          height: em(40),
          fontSize: em(40),
          color: "#fff",
          alignSelf: "center",
          marginTop: em(28.5)
        }}
        onPress={() => {
          _popupDialog && _popupDialog.dismiss && _popupDialog.dismiss();
        }}
      />
    ]}
  >
    <Text
      style={{
        position: "absolute",
        top: em(-35),
        color: "#fff",
        alignSelf: "center",
        fontSize: em(18),
        fontWeight: "600"
      }}
    >
      {title}
    </Text>
    <FastImage
      source={
        img
        ? { uri: img }
        : require("../asset/gardenListDefault.png")
      }
      style={{
        width: GLOBAL_PARAMS._winWidth - em(35),
        height: em(255),
        borderRadius: 8
      }}
    />
  </PopupDialog>
);

previewPlaceImg.defaultProps = {
  title: "详情",
  img: null,
  getRef: () => {}
};

previewPlaceImg.propTypes = {
  title: PropTypes.string,
  getRef: PropTypes.func.isRequired
};

export default previewPlaceImg;
