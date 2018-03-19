import React, { PureComponent } from "react";
import {
  View,
  Image,
  SectionList,
  StyleSheet,
  Animated,
  Easing,
  ScrollView
} from "react-native";
import {
  Container,
  Content,
  Footer,
  Button,
  Text,
  List,
  ListItem,
  Left,
  Right,
  Body,
  Thumbnail
} from "native-base";
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
// components
import CommonHeader from "../components/CommonHeader";
// api
import api from "../api";
//utils
import Colors from "../utils/Colors";
import GLOBAL_PARAMS from "../utils/global_params";
import ToastUtil from "../utils/ToastUtil";

const slideAnimation = new SlideAnimation({
  slideFrom: 'bottom',
});

export default class IntegralDetailView extends PureComponent {
  sectionList = null;
  _scrollView = null;
  _popupDialog = null;
  state = {
    projectDetail: null,
    commentsDetail: null,
    isShortCommentsShow: true,
    arrow: new Animated.Value(1)
  };

  componentDidMount = () => {
    let { id } = this.props.navigation.state.params.data;
    Promise.all([
      api.getIntegralProjectDetail(id),
      api.getProjectComments(id)
    ]).then(
      data => {
        for (let idx in data) {
          if (data[idx].status === 200 && data[idx].data.ro.ok) {
            console.log(idx);
            if (idx == 0) {
              console.log(123);
              this.setState({
                projectDetail: data[idx].data.data
              });
            } else if (idx == 1) {
              this.setState({
                commentsDetail: data[idx].data.data
              });
            }
          }
        }
      },
      () => {
        ToastUtil.show("獲取數據失敗", 1000, "bottom", "warning");
      }
    );
  };

  // private function
  _onShowShortComments() {
    if (!this.state.isShortCommentsShow) {
      Animated.timing(this.state.arrow, {
        toValue: 1, // 目标值
        duration: 300, // 动画时间
        easing: Easing.linear // 缓动函数
      }).start();
    } else {
      Animated.timing(this.state.arrow, {
        toValue: 0, // 目标值
        duration: 300, // 动画时间
        easing: Easing.linear // 缓动函数
      }).start();
    }
    if (!this.state.isShortCommentsShow) {
      this.setState({
        isShortCommentsShow: !this.state.isShortCommentsShow
      }, () => {
        this._scrollView.scrollTo({y:65,animated: true})
      });
    } else {
      this.setState({
        isShortCommentsShow: !this.state.isShortCommentsShow
      },() => {
        this._scrollView.scrollToEnd({ animated: true });
      });
    }
  }

  _renderProjectDetail() {
    let {
      bief,
      currentPoint,
      detail,
      image,
      leastPoint,
      requirePoint,
      sponsor,
      title
    } = this.state.projectDetail;
    return (
      <ScrollView ref={s => (this._scrollView = s)} style={{ padding: 10 }}>
        <View style={styles.commonItem}>
          <Image
            source={{ uri: image }}
            style={{ width: GLOBAL_PARAMS._winWidth - 20, height: 150 }}
            resizeMode="cover"
          />
          <Text
            style={{ fontSize: 20, color: Colors.fontBlack, marginTop: 10 }}
          >
            {title}
          </Text>
          <Text>
            目前積分：{currentPoint}需要積分：{requirePoint}
          </Text>
          <Text style={styles.commonText}>{bief}</Text>
        </View>
        <View
          style={[
            styles.commonItem,
            styles.commonPadding,
            { flexDirection: "row", alignItems: "center" }
          ]}
        >
          <Text
            style={{ color: Colors.main_red, fontSize: 28, marginRight: 10 }}
          >
            {leastPoint}
          </Text>
          <Text>積分</Text>
        </View>
        <View style={[styles.commonItem, styles.commonPadding]}>
          <Text style={styles.commonTitle}>發起慈善接受機構</Text>
          <Text style={styles.commonText}>{sponsor}</Text>
        </View>
        <View style={[styles.commonItem, styles.commonPadding]}>
          <Text style={styles.commonTitle}>項目說明</Text>
          <Text style={styles.commonText}>{detail}</Text>
        </View>
        {this._renderCommentView()}
      </ScrollView>
    );
  }

  _renderCommentView = () => (
    <SectionList
      ref={sectionList => (this.sectionList = sectionList)}
      sections={[
        {
          title: `愛心留言(${this.state.commentsDetail.total})`,
          data: this.state.commentsDetail.list
        }
      ]}
      renderItem={({ item, index }) => this._renderCommentItemView(item, index)}
      renderSectionHeader={() => (
        <Button
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: 10,
            paddingBottom: 10,
            borderBottomWidth: 1,
            height: 50,
            backgroundColor: "white",
            borderBottomColor: Colors.main_gray
          }}
          transparent
          onPress={() => this._onShowShortComments()}
        >
          <Text
            style={{
              flex: 1,
              justifyContent: "flex-start",
              color: Colors.fontBlack,
              marginLeft: -15
            }}
          >
            愛心留言({this.state.commentsDetail.total})
          </Text>
          <Animated.Image
            style={[
              { width: 10, height: 10 },
              {
                transform: [
                  {
                    rotateZ: this.state.arrow.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "180deg"]
                    })
                  }
                ]
              }
            ]}
            source={{ uri: "arrowDown" }}
          />
        </Button>
      )}
      keyExtractor={(item, index) => index}
    />
  );

  _renderCommentItemView = (item, idx) => (
    <ListItem
      avatar
      key={idx}
      style={{
        borderBottomWidth: 1,
        borderBottomColor: Colors.main_gray,
        marginLeft: 0,
        paddingTop: 10,
        paddingBottom: 10
      }}
    >
      <Left>
        <Thumbnail source={{ uri: item.image }} />
      </Left>
      <Body style={{ borderBottomWidth: 0 }}>
        <Text>{item.name}</Text>
        <Text note style={{ marginTop: 5 }}>
          {item.content}
        </Text>
      </Body>
      <Right style={{ borderBottomWidth: 0 }} />
    </ListItem>
  );

  _renderPopupDiaogView = () => (
    <PopupDialog
    width={GLOBAL_PARAMS._winWidth*0.8}
    ref={(popupDialog) => { this._popupDialog = popupDialog; }}
    dialogAnimation={slideAnimation}
    >
      <View>
        <Text>Hello</Text>
      </View>
    </PopupDialog>
  )

  //private function
  _openDialog = () => {
    this._popupDialog.show(() => {
      console.log('opened!')
    })
  }

  render = () => (
    <Container style={{ backgroundColor: Colors.main_white }}>
      <CommonHeader title="積分詳情" canBack {...this["props"]} />
      {this._renderPopupDiaogView()}
      {this.state.projectDetail !== null &&
      this.state.commentsDetail !== null ? (
        <View style={{ marginBottom: GLOBAL_PARAMS.bottomDistance + 60 }}>
          {this._renderProjectDetail()}
        </View>
      ) : null}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          height: 57,
          backgroundColor: Colors.main_white,
          flex: 1,
          width: GLOBAL_PARAMS._winWidth,
          borderTopColor: Colors.main_gray,
          borderTopWidth: 1,
          padding: 5
        }}
      >
        <Button
          block
          style={{
            backgroundColor: this.props.screenProps.theme,
          }}
          onPress={() => this._openDialog()}
        >
          <Text style={{ color: Colors.main_white }}>立即兌換</Text>
        </Button>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  commonItem: {
    borderBottomColor: Colors.main_gray,
    borderBottomWidth: 1,
    // paddingTop: 10,
    paddingBottom: 10
  },
  commonText: {
    color: Colors.deep_gray,
    fontSize: 14,
    marginTop: 10
  },
  commonTitle: {
    color: Colors.fontBlack,
    fontSize: 16
  },
  commonPadding: {
    paddingTop: 10,
    paddingBottom: 10
  }
});
