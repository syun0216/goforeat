import React from 'react';
import {View} from 'react-native';
import {Container,Content} from 'native-base';
//components
import CommonItem from '../components/CommonItem';
import CommonHeader from '../components/CommonHeader';
//utils
import LinkingUtils from '../utils/LinkingUtils';
import Colors from '../utils/Colors';
import ToastUtil from '../utils/ToastUtil';
//language
import i18n from '../language/i18n';

const UserHelper = (props) => {
  let {language} = props.screenProps;
  const _list_arr = [
    {content: i18n[language].phone,isEnd: false,clickFunc: () => LinkingUtils.dialPhoneWithNumber(52268745,props.screenProps.language)},
    // {content: i18n[language].online,isEnd: true,clickFunc: () => {ToastUtil.showWithMessage('該功能暫未開放')}},
  ]
  return (
    <Container>
      <CommonHeader canBack title={i18n[language].contact} {...props}/>
      <Content style={{backgroundColor:Colors.main_white}}>
        <View>
        {_list_arr.map((item,key) => (
          <CommonItem key={key} content={item.content} isEnd={item.isEnd} clickFunc={item.clickFunc}/>
        ))}
        </View>
      </Content>
    </Container>
  )
}

export default UserHelper;

