import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
//utils
import GLOBAL_PARAMS, { em } from "../utils/global_params";
import Colors from "../utils/Colors";
//components
import Text from "./UnScalingText";

const iPhoneXBottom = {
  marginBottom: GLOBAL_PARAMS.isIphoneX() ? GLOBAL_PARAMS.iPhoneXBottom : 0
};

const styles = StyleSheet.create({
  bottomContainer: {
    width: GLOBAL_PARAMS._winWidth,
    height: GLOBAL_PARAMS.isIphoneX() ? 83 : 49,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
    paddingRight: em(15),
    paddingLeft: em(10),
    backgroundColor: "#fff",
    borderBottomWidth: GLOBAL_PARAMS.isIphoneX() ? 1 : 0,
    borderBottomColor: "#E5E5E5",
    left: 0,
    bottom: 0
  },
  commonView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  commonText: {
    // marginLeft:20,
    // marginRight:20,
    fontSize: 25
  },
  commonIcon: {
    fontSize: em(18)
  },
  shareBtn: {
    height: 36,
    minWidth: em(80),
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    overflow: "hidden",
    // marginRight: -12,
    ...iPhoneXBottom
  },
  confirmBtn: {
    height: 36,
    minWidth: em(120),
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    overflow: "hidden",
    ...iPhoneXBottom
  },
  priceText: {
    color: "#FF3348",
    width:
      Platform.OS == "ios" ? (GLOBAL_PARAMS._winWidth < 350 ? 60 : 100) : 80,
    marginTop: -5,
    fontWeight: "600",
    ...iPhoneXBottom
  },
  iconClose: {
    color: Colors.main_gray,
    fontSize: GLOBAL_PARAMS.em(28),
    marginTop: 3,
    ...iPhoneXBottom
  },
  closeBtn: {
    width: GLOBAL_PARAMS._winWidth < 350 ? 30 : 50,
    alignItems: "center"
  }
});

export default class BottomOrderConfirm extends PureComponent {
  timer = null;
  static defaultProps = {
    btnMessage: "立即預訂",
    btnClick: () => {},
    shareClick: () => {},
    canClose: true
  };

  static propsType = {
    btnMessage: PropTypes.string,
    btnClick: PropTypes.func,
    shareClick: PropTypes.func,
    canClose: PropTypes.bool
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  _cancelOrder = () => {
    this.props.cancelOrder();
  };

  render() {
    let { total, btnClick, shareClick, canClose, btnMessage } = this.props;
    return (
      <View
        style={[styles.bottomContainer, { justifyContent: "space-between" }]}
      >
        <View style={styles.commonView}>
          {/*canClose ?<TouchableOpacity style={styles.closeBtn} onPress={this._cancelOrder}>
            <Icon name="md-close-circle" style={[styles.commonIcon,styles.iconClose]}/>
          </TouchableOpacity> : null*/}
          <Text style={{ marginLeft: 5, fontSize: em(13), ...iPhoneXBottom }}>
            HKD{" "}
          </Text>
          <Text style={[styles.commonText, styles.priceText]} numberOfLines={1}>
            {GLOBAL_PARAMS._winWidth < 350 ? total : total ? total.toFixed(2) : '--'}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => shareClick()}>
            <LinearGradient
              style={styles.shareBtn}
              colors={["#FFC500", "#FF9402"]}
              start={{ x: 0.0, y: 0.0 }}
              end={{ x: 1.0, y: 0.0 }}
            >
              <View style={styles.commonView}>
                <Text
                  style={{ color: "#fff", fontSize: em(16), fontWeight: "800" }}
                >
                  分享
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => btnClick()}>
            <LinearGradient
              style={styles.confirmBtn}
              colors={["#FF7A00", "#FE560A"]}
              start={{ x: 0.0, y: 0.0 }}
              end={{ x: 1.0, y: 0.0 }}
            >
              <View style={styles.commonView}>
                <Text
                  style={{ color: "#fff", fontSize: em(16), fontWeight: "800" }}
                >
                  立即預訂
                </Text>
                <Image
                  style={{ width: em(15), height: em(15), marginLeft: em(3) }}
                  source={require("../asset/double-arrow.png")}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
