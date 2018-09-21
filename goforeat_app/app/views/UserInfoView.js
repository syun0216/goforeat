import React, { PureComponent } from 'react';
import {View, TouchableOpacity, Image, Alert} from 'react-native';
import {Container, Content, Segment, Form,Item, Input, Label, Button} from 'native-base';
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

const SECRET = 0;
const MALE = 1;
const FEMALE = 2;

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
        this.props.screenProps.userLogout();
        this.props.navigation.goBack();
      }
    });
  }

  _updateMyInfo() {
    this.setState({
      loadingModal: true
    })
    updateMyInfo(this.state.myInfo).then(data => {
      if(data.ro.ok) {
        ToastUtil.showWithMessage("更新成功");
        this.setState({
          loadingModal: false
        });
        this.rawMyInfo = JSON.stringify(this.state.myInfo);
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
    this.setState({
      loadingModal: true
    }, () => {
      uploadAvatar(photoData).then(data => {
        // console.log(data);
        if(data.ro.ok) {
          this.setState({
            photoData: photoData
          })
          ToastUtil.showWithMessage("更新頭像成功");
        }
      }).catch(err => {
        this.setState({loadingModal: false});
        ToastUtil.showWithMessage("上傳失敗");
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
    let {i18n, myInfo} = this.state;
    if(this.rawMyInfo != JSON.stringify(this.state.myInfo)) {
      Alert.alert(
        i18n.tips,
        '信息還未保存，是否退出？',
        [
          {text: i18n.cancel, onPress: () => {return null}, style: 'cancel'},
          {text: i18n.confirm, onPress: () => {this.props.navigation.goBack()}},
        ],
        { cancelable: false }
      )
    }else{
      this.props.navigation.navigate("DrawerOpen")
    }
  }

  _renderHeaderView() {
    if(this.state.myInfo==null) return;
    return (
      <CommonHeader title="修改資料" hasMenu leftClickIntercept={() => this._alreadySaveCheck()} {...this.props}/>
    )
  }

  _renderFinishBtn() {
    return (
      <CommonBottomBtn clickFunc={() => this._updateMyInfo()}>
        完成
      </CommonBottomBtn>
    )
  }

  _renderAvatarView() {
    if(this.state.myInfo == null) return;
    let { photoData, myInfo } = this.state;
    let _photo = photoData == null ? {uri: myInfo.profileImg} : {uri: photoData.uri}
    return (
      <View style={UserInfoStyle.AvatarView}>
        <Image style={UserInfoStyle.AvatarImg} source={_photo}/>
        <TouchableOpacity onPress={this._selectPhotoTapped.bind(this)}>
          <Text style={UserInfoStyle.ChangeBtn}>更換頭像</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderFormView() {
    if(this.state.myInfo == null) return;
    let { myInfo:{ address, email, gender, nickName, phone } } = this.state;

    let _form_arr = [
      {label: '賬號', key: 'phone', value: phone},
      {label: '暱稱', key: 'nickName', value: nickName},
      {label: '性别', key: 'gender', value: gender},
      {label: '郵箱', key: 'email', value: email},
      {label: '公司地址', key: 'address', value: address}
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
      {text: '男', value: MALE},
      {text: '女', value: FEMALE},
      {text: '保密', value: SECRET}
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
      <Form style={{backgroundColor: '#fff'}}>
        {_form_arr.map((item,idx) => {
          return (
            <Item inlineLabel key={idx}>
              <Label>{item.label}</Label>
              {item.key != "gender" ? (
                <Input
                onChangeText={text => _changeText(text, item.key)}
                placeholder={item.label}
                clearButtonMode="while-editing" 
                style={item.key == 'account' ? UserInfoStyle.AccountDisable : {}} value={item.value}/>) : _segmentElement}
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