import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Linking,
  Image,
  ScrollView,
  Platform,
  TouchableWithoutFeedback
} from "react-native";
import {PullPicker} from 'teaset';
import { Container, ActionSheet } from "native-base";
//utils
import ToastUtil from "./utils/ToastUtil";
import { getVersion } from "./utils/DeviceInfo";
import GLOBAL_PARAMS, { em } from "./utils/global_params";
//components
import CommonHeader from "./components/CommonHeader";
import CommonItem from "./components/CommonItem";
import CommonBottomBtn from "./components/CommonBottomBtn";
import Text from "./components/UnScalingText";
import CustomizeContainer from "./components/CustomizeContainer";
//language
import I18n from "./language/i18n";
//api
import { logout } from "./api/request";
//cache
import { languageStorage } from "./cache/appStorage";

const LANGUAGE_BTN = ["繁體中文", "English", "Cancel"];
const DESTRUCTIVE_INDEX = 3;
const CANCEL_INDEX = 2;
export default class SettingView extends PureComponent {
  popupDialog = null;
  _actionSheet = null;
  state = {
    isEnglish: false,
    language: this.props.screenProps.language == "en" ? "English" : "繁體中文",
    lang_idx: this.props.screenProps.language == "en" ? 1 : 0,
    i18n: I18n[this.props.screenProps.language]
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      i18n: I18n[nextProps.screenProps.language]
    });
  }

  componentDidMount() {
    this.setState({
      isEnglish: this.props.screenProps.language === "en"
    });
  }

  _logout() {
    let { i18n } = this.state;
    logout().then(
      data => {
        if (data.ro.respCode == "0000") {
          ToastUtil.showWithMessage(i18n.setting_tips.success.logout);
          this.props.screenProps.userLogout();
        } else {
          ToastUtil.showWithMessage(i18n.setting_tips.fail.logout);
        }
      },
      () => {
        ToastUtil.showWithMessage(i18n.setting_tips.fail.logout_network);
      }
    );
  }

  _renderListFooterView = () => (
    <CommonBottomBtn
      clickFunc={() => {
        Alert.alert(
          this.state.i18n.tips,
          this.state.i18n.setting_tips.common.logout_msg,
          [
            {
              text: this.state.i18n.cancel,
              onPress: () => {
                return null;
              },
              style: "cancel"
            },
            { text: this.state.i18n.confirm, onPress: () => this._logout() }
          ],
          { cancelable: false }
        );
      }}
    >
      {this.state.i18n.logout}
    </CommonBottomBtn>
  );

  render() {
    let { i18n } = this.state;
    let _setting_ios = {
      content: i18n.notice,
      isEnd: false,
      clickFunc: () => {
        Linking.openURL("app-settings:").catch(err => console.log(err));
      }
    };
    const _list_arr = [
      {
        content: i18n.tutorial,
        isEnd: false,
        clickFunc: () => {
          let _url = Platform.select({
            ios: "https://www.youtube.com/watch?v=o7NtHPgx9JY",
            android: "https://www.youtube.com/watch?v=DsQJSMO5U_I"
          });
          Linking.openURL(_url).catch(err => alert(err));
        }
      },
      {
        content: i18n.lang,
        isEnd: true,
        hasRightIcon: true,
        rightIcon: <Text>{this.state.language}</Text>,
        clickFunc: () => {
          if (this._actionSheet != null) {
            PullPicker.show(
              i18n.langChoose,
              LANGUAGE_BTN,
              this.state.language,
              (item, buttonIndex) => {
                if (
                  this.state.lang_idx == buttonIndex &&
                  buttonIndex == CANCEL_INDEX
                )
                  return;
                switch (LANGUAGE_BTN[buttonIndex]) {
                  case "English":
                    {
                      this.props.screenProps.changeLanguage("en");
                      languageStorage.setData("en");
                      this.setState({
                        lang_idx: buttonIndex,
                        language: LANGUAGE_BTN[buttonIndex]
                      });
                    }
                    break;
                  case "繁體中文": {
                    languageStorage.setData("zh");
                    this.props.screenProps.changeLanguage("zh");
                    this.setState({
                      lang_idx: buttonIndex,
                      language: LANGUAGE_BTN[buttonIndex]
                    });
                  }
                }
              }
            );
          }
        }
      },
      {
        content: i18n.policy,
        isEnd: false,
        clickFunc: () => {
          this.props.navigation.navigate("Statement", { name: "policy" });
        }
      },
      {
        content: i18n.services,
        isEnd: false,
        clickFunc: () => {
          this.props.navigation.navigate("Statement", { name: "service" });
        }
      },
      {
        content: i18n.about,
        isEnd: true,
        clickFunc: () => {
          this.props.navigation.navigate("Statement", { name: "about" });
        }
      }
    ];
    if (Platform.OS == "ios") {
      _list_arr.unshift(_setting_ios);
    }
    return (
      <CustomizeContainer.SafeView mode="linear" style={{ backgroundColor: "#efefef" }}>
        <CommonHeader title={i18n.setting} hasMenu />
        <ScrollView>
          <TouchableWithoutFeedback
            delayLongPress={4000}
            onLongPress={() => {
              languageStorage.removeAll();
              alert("清除緩存成功");
            }}
          >
            <View
              style={{
                paddingTop: em(10),
                paddingBottom: em(10),
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <Image
                source={require("./asset/icon_app.png")}
                style={{ width: em(20), height: em(20) }}
              />
              <Text style={{ marginLeft: 10 }}>
                {i18n.goforeat} v{getVersion()}{" "}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          {_list_arr.map((item, key) => (
            <CommonItem
              style={item.style || {}}
              key={key}
              content={item.content}
              hasRightIcon={item.hasRightIcon}
              rightIcon={item.rightIcon}
              isEnd={item.isEnd}
              clickFunc={item.clickFunc}
            />
          ))}
          {this.props.screenProps.user !== null
            ? this._renderListFooterView()
            : null}
        </ScrollView>
        <ActionSheet
          ref={a => {
            this._actionSheet = a;
          }}
        />
      </CustomizeContainer.SafeView>
    );
  }
}
