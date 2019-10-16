import React, { PureComponent } from 'react'
import { View, TouchableOpacity, Image, Alert } from 'react-native'
import { connect } from 'react-redux'
import { Content, Segment, Form, Item, Input, Label, Button } from 'native-base'
import ImagePicker from 'react-native-image-picker'
import CustomizeContainer from '../components/CustomizeContainer'
//api
import { getMyInfo, updateMyInfo, uploadAvatar } from '../api/request'
//components
import CommonHeader from '../components/CommonHeader'
import Text from '../components/UnScalingText'
import LoadingModal from '../components/LoadingModal'
import Loading from '../components/Loading'
import ToastUtil from '../utils/ToastUtil'
import CommonBottomBtn from '../components/CommonBottomBtn'
//styles
import UserInfoStyle from '../styles/userinfo.style'
//language
import I18n from '../language/i18n'
//cache
import { userStorage } from '../cache/appStorage'
//action
import { LOGIN } from '../actions/index'

const SECRET = 0
const FEMALE = 1
const MALE = 2

const getUserFormLabel = (key, language) => {
  return language[key]
}

class UserInfoView extends PureComponent {
  constructor(props) {
    super(props)
    this.rawMyInfo = null
    this.state = {
      photoData: null,
      myInfo: null,
      currentGender: SECRET,
      loadingModal: false,
      i18n: I18n[props.language]
    }
  }

  componentDidMount() {
    this._timer = setTimeout(() => {
      clearTimeout(this._timer)
      this._getMyInfo()
    }, 500)
    this._getMyInfo()
  }

  //api
  /**
   * 获取我的详情信息
   *
   * @memberof UserInfoView
   */
  _getMyInfo() {
    getMyInfo().then(data => {
      // console.log(data);
      this.rawMyInfo = JSON.stringify(data)
      this.setState({
        myInfo: data,
        loadingModal: false
      })
    })
  }

  /**
   * 更新个人信息
   *
   * @memberof UserInfoView
   */
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
    updateMyInfo(this.state.myInfo)
      .then(data => {
        ToastUtil.showWithMessage('更新成功')
        let { userInfo } = this.props
        userInfo.nickName = this.state.myInfo.nickName
        userStorage.setData(userInfo)
        this.props.userLogin(userInfo)
        this.rawMyInfo = JSON.stringify(this.state.myInfo)
        this.props.navigation.goBack()
      })
      .catch(err => {})
  }

  /**
   * 上传头像
   *
   * @param {*} photoData
   * @returns
   * @memberof UserInfoView
   */
  _uploadAvatar(photoData) {
    if (photoData === null) {
      ToastUtil.showWithMessage('先選擇圖片')
      return
    }
    const {
      i18n: {
        user_info_tips: { tips_avatar_success, tips_fail }
      }
    } = this.state
    uploadAvatar(photoData)
      .then(data => {
        this.setState({
          photoData: photoData
        })
        let { userInfo } = this.props
        userInfo.profileImg = data
        userStorage.setData(userInfo)
        this.props.userLogin(userInfo)
        ToastUtil.showWithMessage(tips_avatar_success)
      })
      .catch(err => {
        console.log('err :', err)
        ToastUtil.showWithMessage(tips_fail)
      })
  }

  /**
   * 选择图片
   *
   * @memberof UserInfoView
   */
  _selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    }

    ImagePicker.showImagePicker(options, async response => {
      console.log(response)
      if (response.didCancel) {
        console.log(response)
      } else if (response.error) {
        console.log(response)
      } else if (response.customButton) {
      } else {
        console.log(1234)
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this._uploadAvatar(response)
      }
    })
  }

  /**
   * 修改性别
   *
   * @param {*} name
   * @memberof UserInfoView
   */
  _changeGender(name) {
    let _newInfo = Object.assign({}, this.state.myInfo, {
      gender: name
    })
    this.setState({
      myInfo: _newInfo
    })
  }

  /**
   * 检查是否已保存
   *
   * @memberof UserInfoView
   */
  _alreadySaveCheck() {
    const {
      i18n: {
        user_info_tips: { tips_quit },
        cancel,
        confirm,
        tips
      }
    } = this.state
    if (this.rawMyInfo != JSON.stringify(this.state.myInfo)) {
      Alert.alert(
        tips,
        tips_quit,
        [
          {
            text: cancel,
            onPress: () => {
              return null
            },
            style: 'cancel'
          },
          {
            text: confirm,
            onPress: () => {
              this.props.navigation.goBack()
            }
          }
        ],
        { cancelable: false }
      )
    } else {
      this.props.navigation.navigate('DrawerOpen')
    }
  }

  /**
   * 头部导航栏
   *
   * @returns
   * @memberof UserInfoView
   */
  _renderHeaderView() {
    const {
      i18n: {
        user_info_tips: { title }
      }
    } = this.state
    if (this.state.myInfo == null) return
    return (
      <CommonHeader
        title={title}
        canBack
        leftClickIntercept={() => this._alreadySaveCheck()}
      />
    )
  }

  /**
   * 底部完成按钮
   *
   * @returns
   * @memberof UserInfoView
   */
  _renderFinishBtn() {
    const {
      i18n: {
        user_info_tips: { finish }
      }
    } = this.state
    if (this.state.myInfo == null) return
    return (
      <CommonBottomBtn clickFunc={() => this._updateMyInfo()}>
        {finish}
      </CommonBottomBtn>
    )
  }

  /**
   * 头像
   *
   * @returns
   * @memberof UserInfoView
   */
  _renderAvatarView() {
    const {
      i18n: {
        user_info_tips: { changeAvatar }
      }
    } = this.state
    if (this.state.myInfo == null) return
    let { photoData, myInfo } = this.state
    let _photo =
      photoData == null
        ? myInfo.profileImg
          ? { uri: myInfo.profileImg }
          : require('../asset/defaultAvatar.png')
        : { uri: photoData.uri }
    return (
      <View style={UserInfoStyle.AvatarView}>
        <Image style={UserInfoStyle.AvatarImg} source={_photo} />
        <TouchableOpacity
          style={UserInfoStyle.ChangeBtnContainer}
          onPress={this._selectPhotoTapped.bind(this)}>
          <Text style={UserInfoStyle.ChangeBtn}>{changeAvatar}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  /**
   * 用户详情form表单
   *
   * @returns
   * @memberof UserInfoView
   */
  _renderFormView() {
    const { user_info_tips } = this.state.i18n
    if (this.state.myInfo == null) return
    let {
      myInfo: { address, email, gender, nickName, phone }
    } = this.state

    let _form_arr = [
      {
        label: getUserFormLabel('phone', user_info_tips),
        key: 'phone',
        value: phone
      },
      {
        label: getUserFormLabel('nickName', user_info_tips),
        key: 'nickName',
        value: nickName
      },
      {
        label: getUserFormLabel('email', user_info_tips),
        key: 'email',
        value: email
      },
      {
        label: getUserFormLabel('address', user_info_tips),
        key: 'address',
        value: address
      },
      {
        label: getUserFormLabel('gender', user_info_tips),
        key: 'gender',
        value: gender
      }
    ]

    const _changeText = (text, key) => {
      let _newInfo = Object.assign({}, this.state.myInfo, {
        [key]: text
      })
      this.setState({
        myInfo: _newInfo
      })
    }

    let _segment = [
      {
        text: getUserFormLabel('male', user_info_tips),
        value: MALE,
        icon: 'md-male'
      },
      {
        text: getUserFormLabel('female', user_info_tips),
        value: FEMALE,
        icon: 'md-female'
      },
      {
        text: getUserFormLabel('secret', user_info_tips),
        value: SECRET,
        icon: 'md-eye-off'
      }
    ]

    const _segmentElement = (
      <Segment style={UserInfoStyle.Segment}>
        {_segment.map((item, idx) => {
          let _isCurrentGender = gender == item.value
          return (
            <Button
              key={idx}
              onPress={() => this._changeGender(item.value)}
              style={
                _isCurrentGender
                  ? UserInfoStyle.SegmentActiveBtn
                  : UserInfoStyle.SegmentDefaultBtn
              }
              first={idx === 0}
              last={idx === _segment.length - 1}>
              <Text
                style={
                  _isCurrentGender
                    ? UserInfoStyle.SegmentActiveText
                    : UserInfoStyle.SegmentDefaultText
                }>
                {item.text}
              </Text>
            </Button>
          )
        })}
      </Segment>
    )

    return (
      <Form>
        {_form_arr.map((item, idx) => {
          return (
            <Item inlineLabel key={idx} last={idx == _form_arr.length - 1}>
              <Label>{item.label}</Label>
              {item.key != 'gender' ? (
                <Input
                  onChangeText={text => _changeText(text, item.key)}
                  placeholder={item.label}
                  placeholderTextColor='#ccc'
                  clearButtonMode='while-editing'
                  disabled={item.key == 'phone'}
                  style={
                    item.key == 'phone' ? UserInfoStyle.AccountDisable : {}
                  }
                  value={item.value}
                />
              ) : (
                _segmentElement
              )}
            </Item>
          )
        })}
      </Form>
    )
  }

  render() {
    let { loadingModal } = this.state
    return (
      <CustomizeContainer.SafeView mode='linear'>
        {this._renderHeaderView()}
        <Content style={UserInfoStyle.UserInfoContent}>
          {loadingModal ? <LoadingModal /> : null}
          {this._renderAvatarView()}
          {this._renderFormView()}
          {this._renderFinishBtn()}
        </Content>
      </CustomizeContainer.SafeView>
    )
  }
}

const stateToUserInfo = state => ({
  language: state.language.language,
  userInfo: state.auth
})

const propsToUserInfo = dispatch => ({
  userLogin: user => dispatch({ type: LOGIN, ...user })
})

export default connect(
  stateToUserInfo,
  propsToUserInfo
)(UserInfoView)
