import React, { PureComponent } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Easing,
  Animated,
  Platform
} from "react-native";
import {withNavigation} from 'react-navigation';
import Antd from 'react-native-vector-icons/AntDesign';
//utils
import GLOBAL_PAMRAS, { em } from "../utils/global_params";
//components
import Text from "./UnScalingText";
//api
import { queryList } from "../api/request";
//cache
import {warningTipsStorage} from "../cache/appStorage";

const ITEM_HEIGHT = Platform.select({
  ios: { height: em(36) },
  android: {}
});

const styles = StyleSheet.create({
  warn_container: {
    backgroundColor: "transparent",
    width: GLOBAL_PAMRAS._winWidth,
    height: em(36),
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 9,
    paddingBottom: 9,
    paddingLeft: em(5),
    paddingRight: em(5),
    alignItems: "center",
    overflow: "hidden"
  },
  warning_img: {
    width: em(16),
    height: em(16)
  },
  warning_text_container: {
    flexDirection: "column",
    backgroundColor: "transparent",
    position: "relative",
    width: GLOBAL_PAMRAS._winWidth * 0.8,
    maxWidth: GLOBAL_PAMRAS._winWidth * 0.8,
    height: em(36), 
  },
  warningt_text_inner_container: {
    // flexDirection: 'column',
    width: GLOBAL_PAMRAS._winWidth * 0.8,
    maxWidth: GLOBAL_PAMRAS._winWidth * 0.8,
    ...ITEM_HEIGHT
  },
  warning_text: {
    color: "#fff",
    fontSize: em(14),
    paddingLeft: em(22),
    padding: em(9)
  },
  close_btn: {
    width: em(36),
    height: em(36),
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10
  },
  warning_close: {
    width: 12,
    height: 12
  }
});

const WARNING_CONTENT = (v, i, navigation) => (
  <TouchableOpacity
    key={i}
    onPress={() =>
      navigation.navigate("Content", {
        data: v,
        kind: "warning"
      })
    }
  >
    <Text numberOfLines={1} style={styles.warning_text}>
      {v.title}
    </Text>
  </TouchableOpacity>
);

class WarningTips extends PureComponent {
  _interval = null;
  _container_height = Platform.OS == "ios" ? -33.7 : -37.5;
  state = {
    translateY: new Animated.Value(0),
    warningTipsData: null,
    isWarningTipShow: false
  };

  componentDidMount() {
    warningTipsStorage.getData((error, data) => {
      if(!error) {
        let currentTime = + new Date();
        if(data) {
          if(currentTime - data.cacheTime > 1800000) {
            this._getWarningTips();
          }else {
            this.setState({
              warningTipsData: data.data,
              isWarningTipShow: true
            },() => {
              if (data.data.length == 1) return;
              this._loopDisplay(0, data.data.length);
            })
          }
        } else {
          this._getWarningTips();
        }
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  //api
  _getWarningTips() {
    queryList().then(data => {
      if (!data || data.length == 0) return;
        // data.data = data.data.concat(data.data);
        // data.data = data.data.concat(data.data);
        // data.data = data.data.concat(data.data);
        // console.log(data);
        let cacheTime = + new Date();
        warningTipsStorage.setData({data: data, cacheTime})
        this.setState(
          {
            warningTipsData: data,
            isWarningTipShow: true
          },
          () => {
            if (data.length == 1) return;
            this._loopDisplay(0, data.length);
          }
        );
    });
  }

  _layout(e) {
    // console.log(e);
    // this._container_height = - e.layout.width;
  }

  _loopDisplay(index, count) {
    index++;
    Animated.timing(this.state.translateY, {
      toValue: em(this._container_height * index),
      duration: 300,
      easing: Easing.linear,
      delay: 2500
    }).start(() => {
      if (index >= count) {
        index = 0;
        let _y = Platform.OS == "ios" ? 0 : 0;
        this.state.translateY.setValue(_y);
      }
      this._loopDisplay(index, count);
    });
  }

  _loopDataArr(arr) {
    let _temp = arr.shift();
    arr.push(_temp);
    return arr;
  }

  render() {
    let { navigation } = this.props;
    let { warningTipsData } = this.state;
    return this.state.isWarningTipShow ? (
      <View style={styles.warn_container}>
        {/* <Image
          source={require("../asset/warning.png")}
          style={styles.warning_img}
          resizeMode="contain"
        /> */}
        <Antd name="notification" style={{fontSize: em(20), color: "#fff",transform: [{rotateY: "-180deg"}]}}/>
        <View style={styles.warning_text_container}>
          <Animated.View
            onLayout={({ nativeEvent: e }) => this._layout(e)}
            style={[
              styles.warningt_text_inner_container,
              {
                transform: [
                  {
                    translateY: this.state.translateY
                  }
                ]
              }
            ]}
          >
            {warningTipsData.map((v, i) => WARNING_CONTENT(v, i, navigation))}
          </Animated.View>
        </View>
        {/* <TouchableOpacity
          style={styles.close_btn}
          onPress={() => this.setState({ isWarningTipShow: false })}
        >
          <Antd name="close" style={{fontSize: em(20), color: "#fff"}}/>
        </TouchableOpacity> */}
      </View>
    ) : null;
  }
}


export default withNavigation(WarningTips);