import React, { Component } from "react";
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
import GLOBAL_PARAMS, { em, HAS_FOODS, NO_MORE_FOODS, IS_INTERCEPT } from "../utils/global_params";
import Colors from "../utils/Colors";
//components
import Text from "./UnScalingText";

const iPhoneXBottom = {
  marginBottom: GLOBAL_PARAMS.isIphoneX() ? GLOBAL_PARAMS.iPhoneXBottom : 0
};

const styles = StyleSheet.create({
  bottomContainer: {
    width: GLOBAL_PARAMS._winWidth,
    height: 49,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
    paddingRight: em(15),
    paddingLeft: em(10),
    backgroundColor: "#fff",
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
    // ...iPhoneXBottom
  },
  confirmBtn: {
    height: 36,
    minWidth: em(120),
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    overflow: "hidden",
    // ...iPhoneXBottom
  },
  priceText: {
    color: "#FF3348",
    width:
      Platform.OS == "ios" ? (GLOBAL_PARAMS._winWidth < 350 ? 60 : 100) : 80,
    marginTop: -5,
    fontWeight: "600",
    // ...iPhoneXBottom
  },
  iconClose: {
    color: Colors.main_gray,
    fontSize: GLOBAL_PARAMS.em(28),
    marginTop: 3,
    // ...iPhoneXBottom
  },
  closeBtn: {
    width: GLOBAL_PARAMS._winWidth < 350 ? 30 : 50,
    alignItems: "center"
  }
});

export default class BottomOrderConfirm extends Component {
  timer = null;
  static defaultProps = {
    btnMessage: "立即預訂",
    btnClick: () => {},
    shareClick: () => {},
    canClose: true,
    status: HAS_FOODS
  };

  static propsType = {
    btnMessage: PropTypes.string,
    btnClick: PropTypes.func,
    shareClick: PropTypes.func,
    canClose: PropTypes.bool,
    status: PropTypes.number
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    return JSON.stringify(nextState) != JSON.stringify(this.state) || JSON.stringify(nextProps) != JSON.stringify(this.props);
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  _cancelOrder = () => {
    this.props.cancelOrder();
  };

  render() {
    let { total, btnClick, shareClick, canClose, btnMessage, status } = this.props;
    console.log('total :', total);
    const canSold = status == HAS_FOODS;
    return (
      <View
        style={[styles.bottomContainer, { justifyContent: "space-between",...iPhoneXBottom }]}
      >
        <View style={styles.commonView}>
          {/*canClose ?<TouchableOpacity style={styles.closeBtn} onPress={this._cancelOrder}>
            <Icon name="md-close-circle" style={[styles.commonIcon,styles.iconClose]}/>
          </TouchableOpacity> : null*/}
          <Text style={{ marginLeft: 5, fontSize: em(13) }}>
            HKD{" "}
          </Text>
          <Text style={[styles.commonText, styles.priceText]} numberOfLines={1}>
            {GLOBAL_PARAMS._winWidth < 350 ? total : total ? total.toFixed(2) : '--'}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => shareClick()} disabled={!canSold}>
            <LinearGradient
              style={styles.shareBtn}
              colors={canSold ? ["#FFC500", "#FF9402"]: ["#DDD","#CCC"]}
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
          <TouchableOpacity onPress={() => btnClick()} disabled={!canSold}>
            <LinearGradient
              style={[styles.confirmBtn,]}
              colors={canSold ? ["#FF7A00", "#FE560A"]: ["#CCC","#CCC"]}
              start={{ x: 0.0, y: 0.0 }}
              end={{ x: 1.0, y: 0.0 }}
            >
              <View style={styles.commonView}>
                <Text
                  style={{ color: "#fff", fontSize: em(16), fontWeight: "800" }}
                >
                  {canSold ? "立即預訂" : status == NO_MORE_FOODS ? '已售罄' : '已截單'}
                </Text>
                {canSold && <Image
                  style={{ width: em(15), height: em(15), marginLeft: em(3) }}
                  source={require("../asset/double-arrow.png")}
                />}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
