import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  ProgressBarAndroid,
  ProgressViewIOS,
  Platform,
  ActivityIndicator
} from "react-native";
import PropTypes from "prop-types";
import Modal from "react-native-modal";
import LinearGradient from "react-native-linear-gradient";
import CodePush from "react-native-code-push";
//component
import Text from "./UnScalingText";
import CommonBottomBtn from "./CommonBottomBtn";
//utils
import GLOBAL_PARAMS, { em } from "../utils/global_params";
import * as ViewStatus from "../utils/ViewStatus";
import ToastUtils from "../utils/ToastUtil";
import Colors from "../utils/Colors";

const styles = StyleSheet.create({
  modalContainer: {
    position: "relative",
    backgroundColor: '#fff',
    borderBottomLeftRadius: em(8),borderBottomRightRadius: em(8),
  },
  topContainer: {
    justifyContent: "center",
    borderTopLeftRadius: em(8),
    borderTopRightRadius: em(8),
    paddingLeft: em(20),
    paddingTop: em(60),
    paddingBottom: em(80),
    overflow: "hidden",
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
  },
  topText1: {
    color: "#fff",
    fontSize: em(25),
    marginBottom: em(5),
    fontWeight: "500"
  },
  topText2: {
    color: "#fff",
    fontSize: em(18)
  },
  topImg: {
    width: em(160),
    height: em(160),
    position: "absolute",
    top: em(-70),
    right: -10,
    zIndex: 3
  },
  mediumImg: {
    width: "100%",
  },
  bottomContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    height: em(100),
    bottom: 100,
    left: 0,
    right: 0,
    paddingLeft: em(30),
  },
  bottomText: {
    fontSize: em(18),
    lineHeight: em(30)
  },
  btnContainer:{
    alignSelf: "center",
    backgroundColor: '#fff',
    position: 'absolute',
    height: em(100),
    bottom: 30,
    left: 0,
    right: 0,
  },
  bottomBtn: {
    height: em(10),
    borderRadius: em(15),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#68B0F7",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    backgroundColor: "#68B0F7",
    width: em(100),
    flexDirection: "row"
  },
  btnText: {
    color: "#fff",
    fontSize: em(20),
  }
});

export default class VersionController extends Component {
  
  static defaultProps = {
    remotePackage: null
  }

  state = {
    isVisible: false,
    progress: 0.0,
    viewStatus:  ViewStatus.VIEW_STATUS_INITIAL
  };

  test() {
    this.setState({
      progress: 0
    })
    let _timer = setInterval(() => {
      console.log('123 :', 123);
      this.setState({
        progress: this.state.progress + 0.1
      })
      if(this.state.progress >= 1) {
        this.setState({
          viewStatus: ViewStatus.VIEW_STATUS_REQUEST_NETWORK_ERROR
        })
        clearInterval(_timer);
      }
    },300)
  }
  

  //logic
  setModalVisible = status => {
    this.setState({ isVisible: status });
  }

  _startDownload() {
    const { remotePackage } = this.props;
    if(!remotePackage) {
      ToastUtils.showWithMessage("找不到安裝包...");
    }
    this.setState({
      progress: 0.0,
      viewStatus: ViewStatus.VIEW_STATUS_DATA
    });

    remotePackage.download(progress => this._downloadProgressHasChange(progress))
    .then(localPackage => {
      if(localPackage) {
        localPackage.install(CodePush.InstallMode.IMMEDIATE)
      }else {
        this.setState({
          viewStatus: ViewStatus.VIEW_STATUS_REQUEST_NETWORK_ERROR
        })
      }
    }).catch(error => {
      this.setState({
        viewStatus: ViewStatus.VIEW_STATUS_REQUEST_NETWORK_ERROR
      });
    });
  }

  _downloadProgressHasChange(progress) {
    let progressValue = (progress.receivedBytes * 1.0) / progress.totalBytes;
    this.setState({ progress: progressValue });
  }

  //render
  _renderLoadingProgressView() {
    return (
      <View style={{justifyContent: 'center',paddingTop: em(20)}}>
        {Platform.OS == "ios" ? (
          <ProgressViewIOS
            progressTintColor="#2399fd"
            style={{ width: GLOBAL_PARAMS._winWidth*0.75,transform: [{ scaleX: 1.0 }, { scaleY: 4 }], }}
            progress={this.state.progress}
          />
        ) : null}
        {Platform.OS == "android" ? (
          <ProgressBarAndroid
            style={{ width: GLOBAL_PARAMS._winWidth*0.75,transform: [{ scaleX: 1.0 }, { scaleY: 4 }], }}
            color="#2399fd"
            styleAttr="Horizontal"
            indeterminate={false}
            progress={this.state.progress}
          />
        ) : null}
        <Text style={[styles.bottomText, {marginTop: em(8),}]}>更新中,請稍候...</Text>
      </View>
    );
  }

  _renderUpdateStatusView() {
    const { remotePackage } = this.props;
    switch(this.state.viewStatus) {
      case ViewStatus.VIEW_STATUS_INITIAL:{
        return (
          <View>
            <Text style={styles.bottomText}>- 優化了性能</Text>
            <Text style={styles.bottomText}>- 界面升級</Text>
            <Text style={styles.bottomText}>- 修復了若干bug</Text>
          </View>
        )
      };
      case ViewStatus.VIEW_STATUS_DATA: {
        return this._renderLoadingProgressView()
      };
      case ViewStatus.VIEW_STATUS_REQUEST_NETWORK_ERROR: {
        return (
          <Text style={[styles.bottomText,{marginTop: em(10), fontSize: em(20), color: Colors.main_red}]}>更新失敗,請重試</Text>
        )
      }
    }
  }

  _renderModalContent() {
    const { viewStatus } = this.state;
    return (
      <View style={styles.modalContainer}>
        <Image
          style={styles.topImg}
          source={require("../asset/1.3.7/rocket.png")}
          resizeMode="contain"
        />
        <LinearGradient
          colors={["#2399fd", "#4567ff"]}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 0.0 }}
          style={styles.topContainer}
        >
          <Text style={styles.topText1}>發現新版本更新</Text>
          <Text style={styles.topText2}>v1.3.8</Text>
        </LinearGradient>
          <Image
            style={styles.mediumImg}
            resizeMode="contain"
            source={require("../asset/1.3.7/cloud.png")}
          />
        <ScrollView style={styles.bottomContainer}>
          {this._renderUpdateStatusView()}
        </ScrollView>
        <CommonBottomBtn loading={viewStatus == ViewStatus.VIEW_STATUS_DATA} containerStyle={{position: 'absolute',left: 0,right: 0, bottom: -20,backgroundColor: '#fff',paddingTop: em(30),paddingBottom: em(30),borderBottomLeftRadius: em(8),borderBottomRightRadius: em(8),}} style={{height: em(50),borderRadius: em(25), width: GLOBAL_PARAMS._winWidth*0.75,alignSelf: 'center',overflow: 'hidden'}} colors={['#68B0F7', '#716DFF']} clickFunc={() => this._startDownload()}>
          <Text style={styles.btnText}>
            {
              viewStatus == ViewStatus.VIEW_STATUS_INITIAL ? '立即升級' : viewStatus == ViewStatus.VIEW_STATUS_REQUEST_NETWORK_ERROR ? '點擊重試': null
            }
          </Text>
        </CommonBottomBtn>

      </View>
    );
  }

  render() {
    return (
      <Modal
        isVisible={this.state.isVisible}
        backdropOpacity={0.8}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
      >
        {this._renderModalContent()}
      </Modal>
    );
  }
}
