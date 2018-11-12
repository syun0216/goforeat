import React, { PureComponent } from 'react';
import {View, TouchableOpacity, Image, Alert} from 'react-native';
import {Container, Content, Segment, Form,Item, Input, Label, Button, Icon} from 'native-base';
import ImagePicker from 'react-native-image-picker';
//api
import { getMyInfo, updateMyInfo, uploadAvatar } from '../api/request';
//components
import CommonHeader from '../components/CommonHeader';
import Text from '../components/UnScalingText';
import LoadingModal from '../components/LoadingModal';
import Loading from '../components/Loading';
import ToastUtil from '../utils/ToastUtil';
import CommonBottomBtn from '../components/CommonBottomBtn';
//styles
import UserInfoStyle from '../styles/userinfo.style';
//language
import I18n from '../language/i18n';
//cache
import {userStorage} from '../cache/appStorage';

const SECRET = 0;
const FEMALE = 1;
const MALE = 2;

const getUserFormLabel = (key, language) => {
  return language[key];
};

export default class UserInfoView extends PureComponent {

  constructor(props) {
    super(props);
    this.rawMyInfo = null;
    this.state = {
      photoData: null,
      myInfo: null,
      currentGender: SECRET,
      loading: true,
      loadingModal: false,
      i18n: I18n[props.screenProps.language]
    };
  }

  componentDidMount() {
    this._getMyInfo();
  }

  //api
  _getMyInfo() {
    getMyInfo().then(data => {
      // console.log(data);
      if(data.ro.ok) {
        this.rawMyInfo = JSON.stringify(data.data);
        this.setState({
          myInfo: data.data,
          loading: false,
          loadingModal: false,
        });
      } else if(data.ro.respCode == "10006" || data.ro.respCode == "10007") {
        ToastUtil.showWithMessage(data.ro.respMsg)
        this.props.screenProps.userLogout();
        this.props.navigation.goBack();
      }
    });
  }

  _updateMyInfo() {
    // const { account, phoneType, profileImg, ...rest } = this.state.myInfo;
    // for(let key in rest) {
    //   if(key != 'email') {
    //     if(rest[key] == '') {
    //       ToastUtil.showWithMessage(`請填寫${getUserFormLabel(key,this.state.i18n.user_info_tips)}信息`);
    //       return;       
    //     }
    //   }else {
    //     const reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    //     if(!reg.test(rest['email'])) {
    //       ToastUtil.showWithMessage(`郵箱格式不對，請檢查!`);
    //       return;
    //     }        
    //   }
    // }
    this.setState({
      loadingModal: true
    });
    updateMyInfo(this.state.myInfo).then(data => {
      if(data.ro.ok) {
        ToastUtil.showWithMessage("更新成功");
        this.setState({
          loadingModal: false
        });
        let {userInfo} = this.props.screenProps;
        userInfo.nickName = this.state.myInfo.nickName;
        userStorage.setData(userInfo);
        this.props.screenProps.userLogin(userInfo);
        this.rawMyInfo = JSON.stringify(this.state.myInfo);
        this.props.navigation.goBack();
      } else {
        ToastUtil.showWithMessage(data.ri.respMsg);
        this.setState({loadingModal: false})
      }
    }).catch(err => {
      ToastUtil.showWithMessage("更新失敗");
      this.setState({loadingModal: false})
    });
  }

  _uploadAvatar(photoData) {
    if(photoData === null) {
      ToastUtil.showWithMessage("先選擇圖片");
      return;
    }
    const {i18n:{user_info_tips:{tips_avatar_success, tips_fail}}} = this.state;
    this.setState({
      loadingModal: true
    }, () => {
      uploadAvatar(photoData).then(data => {
        console.log(data)
        if(data.data.ro.ok) {
          this.setState({
            photoData: photoData,
            loadingModal: false
          });
          let {userInfo} = this.props.screenProps;
          userInfo.profileImg = data.data.data;
          userStorage.setData(userInfo);
          this.props.screenProps.userLogin(userInfo);
          ToastUtil.showWithMessage(tips_avatar_success);
        }
      }).catch(err => {
        this.setState({loadingModal: false});
        ToastUtil.showWithMessage(tips_fail);
      });
    });
  }

  _selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        console.log(response);
      }
      else if (response.error) {
        console.log(response);
      }
      else if (response.customButton) {
      }
      else {
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this._uploadAvatar(response);
      }
    })
  }

  _changeGender(name) {
    let _newInfo = Object.assign({}, this.state.myInfo, {
      gender: name
    });
    this.setState({
     myInfo: _newInfo
    });
  }

  _alreadySaveCheck() {
    const {i18n:{user_info_tips:{tips_quit},cancel,confirm,tips}} = this.state;
    if(this.rawMyInfo != JSON.stringify(this.state.myInfo)) {
      Alert.alert(
        tips,
        tips_quit,
        [
          {text: cancel, onPress: () => {return null}, style: 'cancel'},
          {text: confirm, onPress: () => {this.props.navigation.goBack()}},
        ],
        { cancelable: false }
      )
    }else{
      this.props.navigation.navigate("DrawerOpen")
    }
  }

  _renderHeaderView() {
    const {i18n:{user_info_tips:{title}}} = this.state;
    if(this.state.myInfo==null) return;
    return (
      <CommonHeader title={title} hasMenu leftClickIntercept={() => this._alreadySaveCheck()}/>
    )
  }

  _renderFinishBtn() {
    const {i18n:{user_info_tips:{finish}}} = this.state;
    return (
      <CommonBottomBtn clickFunc={() => this._updateMyInfo()}>
        {finish}
      </CommonBottomBtn>
    )
  }

  _renderAvatarView() {
    const {i18n:{user_info_tips:{changeAvatar}}} = this.state;
    if(this.state.myInfo == null) return;
    let { photoData, myInfo } = this.state;
    let _photo = photoData == null ? {uri: myInfo.profileImg} : {uri: photoData.uri}
    return (
      <View style={UserInfoStyle.AvatarView}>
        <Image style={UserInfoStyle.AvatarImg} source={_photo}/>
        <TouchableOpacity style={UserInfoStyle.ChangeBtnContainer} onPress={this._selectPhotoTapped.bind(this)}>
          <Text style={UserInfoStyle.ChangeBtn}>{changeAvatar}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderFormView() {
    const {user_info_tips} = this.state.i18n;
    if(this.state.myInfo == null) return;
    let { myInfo:{ address, email, gender, nickName, phone } } = this.state;

    let _form_arr = [
      {label: getUserFormLabel('phone', user_info_tips), key: 'phone', value: phone},
      {label: getUserFormLabel('nickName', user_info_tips), key: 'nickName', value: nickName},
      {label: getUserFormLabel('email', user_info_tips), key: 'email', value: email},
      {label: getUserFormLabel('address', user_info_tips), key: 'address', value: address},
      {label: getUserFormLabel('gender', user_info_tips), key: 'gender', value: gender},
    ];

    const _changeText = (text, key) => {
      let _newInfo = Object.assign({}, this.state.myInfo, {
        [key]: text
      });
      this.setState({
        myInfo: _newInfo
      });
    };

    let _segment = [
      {text: getUserFormLabel('male', user_info_tips), value: MALE, icon: 'md-male'},
      {text: getUserFormLabel('female', user_info_tips), value: FEMALE, icon: 'md-female'},
      {text: getUserFormLabel('secret', user_info_tips), value: SECRET, icon: 'md-eye-off'},
    ];

    const _segmentElement = (
      <Segment style={UserInfoStyle.Segment}>
      {
        _segment.map((item,idx) => {
          let _isCurrentGender = gender == item.value;
          return (<Button key={idx} onPress={() => this._changeGender(item.value)} style={_isCurrentGender ? UserInfoStyle.SegmentActiveBtn : UserInfoStyle.SegmentDefaultBtn} first={idx===0} last={idx === _segment.length - 1}><Text style={_isCurrentGender ? UserInfoStyle.SegmentActiveText : UserInfoStyle.SegmentDefaultText}>{item.text}</Text></Button>
        )})
      }
    </Segment>)

    return (
      <Form>
        {_form_arr.map((item,idx) => {
          return (
            <Item inlineLabel key={idx} last={idx == _form_arr.length - 1}>
              <Label>{item.label}</Label>
              {item.key != "gender" ? (
                <Input
                onChangeText={text => _changeText(text, item.key)}
                placeholder={item.label}
                placeholderTextColor="#ccc"
                clearButtonMode="while-editing" 
                disabled={item.key == 'phone'}
                style={item.key == 'phone' ? UserInfoStyle.AccountDisable : {}} value={item.value}/>) : _segmentElement}
            </Item>
          )
        })}
      </Form>
    )
  }

  render() {
    let {loading, loadingModal} = this.state;
    return (
      <Container>
        {this._renderHeaderView()}
        <Content style={UserInfoStyle.UserInfoContent} >
          {loading ? <Loading /> : null}
          {loadingModal ? <LoadingModal /> : null}
          {this._renderAvatarView()}
          {this._renderFormView()}
          {this._renderFinishBtn()}
        </Content>
      </Container>
    )
  }
}