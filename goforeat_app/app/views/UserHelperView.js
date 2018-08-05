import React from 'react';
import {View,Image,Linking} from 'react-native';
import {Container,Content,Icon} from 'native-base';
//components
import CommonItem from '../components/CommonItem';
import CommonHeader from '../components/CommonHeader';
//utils
import LinkingUtils from '../utils/LinkingUtils';
import Colors from '../utils/Colors';
import ToastUtil from '../utils/ToastUtil';
import {em} from '../utils/global_params';
//language
import i18n from '../language/i18n';
//styles
import PaySettingStyles from '../styles/paysetting.style';
const EMAIL = 'contact@goforeat@hk';
const UserHelper = (props) => {
  let {language} = props.screenProps;
  let _left_icon = (img) => (<Image source={img} style={PaySettingStyles.payLeftImage} resizeMode="contain"/>)
  const _list_arr = [
    {content: i18n[language].phone,leftIcon:_left_icon(require('../asset/phonecall.png')),isEnd: false,clickFunc: () => LinkingUtils.dialPhoneWithNumber(52268745,props.screenProps.language)},
    {content: i18n[language].email,leftIcon:_left_icon(require('../asset/email_orange.png')),isEnd: false,clickFunc: () => {Linking.openURL(`mailto:${EMAIL}`)}},
    {content: i18n[language].feedback,leftIcon:_left_icon(require('../asset/feedback.png')),isEnd: false,clickFunc: () => {props.navigation.navigate('Feedback')}},
    // {content: i18n[language].online,isEnd: true,clickFunc: () => {ToastUtil.showWithMessage('該功能暫未開放')}},
  ]
  return (
    <Container>
      <CommonHeader canBack title={i18n[language].contact} {...props}/>
      <Content style={{backgroundColor:Colors.main_white}}>
        <View>
        {_list_arr.map((item,key) => (
          <CommonItem key={key} hasLeftIcon  leftIcon={item.leftIcon} content={item.content} isEnd={item.isEnd} clickFunc={item.clickFunc}/>
        ))}
        </View>
      </Content>
    </Container>
  )
}

export default UserHelper;

