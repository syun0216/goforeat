import React from "react";
import { TextInput } from "react-native";
import { Container, Content } from "native-base";
import { connect } from "react-redux";
//components
import CommonHeader from "../components/CommonHeader";
import CommonBottomBtn from "../components/CommonBottomBtn";
import CustomizeContainer from "../components/CustomizeContainer";
//language
import i18n from "../language/i18n";
//utils
import ToastUtils from "../utils/ToastUtil";
import GLOBAL_PARAMS, { em } from "../utils/global_params";
import NavigationService from "../utils/NavigationService";
//api
import { feedback } from "../api/request";

const FeedbackView = props => {
  let _feedback = {
    content: "",
    memberInfo: "",
    sid: props.sid
  };
  let _hasSubmit = false;
  let { language } = props;
  let _submit = () => {
    if (_feedback.content.length < 5) {
      ToastUtils.showWithMessage(i18n[language].feedbackLength);
      return;
    }
    if (_hasSubmit) {
      ToastUtils.showWithMessage(i18n[language].thankForFeedback);
      return;
    }
    feedback(_feedback)
      .then(data => {
        _hasSubmit = true;
        ToastUtils.showWithMessage(i18n[language].common_tips.send_success);
        NavigationService.back();
      })
      .catch(err => {
        ToastUtils.showWithMessage(i18n[language].common_tips.network_err);
      });
  };
  let _getContent = content => {
    _feedback.content = content;
  };
  let _getPhone = memberInfo => {
    _feedback.memberInfo = memberInfo;
  };
  return (
    <CustomizeContainer.SafeView mode="linear">
      <CommonHeader title={i18n[language].feedback} canBack {...props} />
      <Content style={{ backgroundColor: "#efefef" }}>
        <TextInput
          style={{
            width: GLOBAL_PARAMS._winWidth * 0.9,
            height: GLOBAL_PARAMS._winHeight * 0.15,
            marginTop: em(15),
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
            alignSelf: "center",
            backgroundColor: "#fff",
            textAlign: "justify",
            marginBottom: em(15),
            padding: em(10),
            textAlignVertical: "top"
          }}
          multiline={true}
          underlineColorAndroid="rgba(0,0,0,0)"
          numberOfLines={4}
          placeholderTextColor="#999999"
          placeholder={i18n[language].feedbackTips}
          onChangeText={val => _getContent(val)}
        />
        <TextInput
          style={{
            width: GLOBAL_PARAMS._winWidth * 0.9,
            height: em(50),
            borderRadius: 5,
            alignSelf: "center",
            backgroundColor: "#fff",
            padding: em(10),
            borderWidth: 1,
            borderColor: "#ccc"
          }}
          numberOfLines={1}
          placeholderTextColor="#999999"
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder={i18n[language].feedbackPhoneTips}
          onChangeText={val => _getPhone(val)}
        />
        <CommonBottomBtn clickFunc={_submit}>
          {i18n[language].sendFeedback}
        </CommonBottomBtn>
      </Content>
    </CustomizeContainer.SafeView>
  );
};

const stateToFeedback = state => ({
  language: state.language.language,
  sid: state.auth.sid,
});

export default connect(stateToFeedback, {})(FeedbackView);
