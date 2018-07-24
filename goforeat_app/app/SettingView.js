import React,{PureComponent} from 'react'
import {View,Text,StyleSheet,Alert,Linking,Image,ScrollView,Platform,TouchableWithoutFeedback} from 'react-native'
import {Container,Button} from 'native-base'
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';
//utils
import Colors from './utils/Colors';
import ToastUtil from './utils/ToastUtil';
import GLOBAL_PARAMS from './utils/global_params';
//components
import CommonHeader from './components/CommonHeader';
import CommonItem from './components/CommonItem';
//language
import i18n from './language/i18n';
//api
import api from './api/index'
//cache
import appStorage from './cache/appStorage';

export default class SettingView extends PureComponent{
  popupDialog = null;
  state = {
    isEnglish: false,
    i18n: i18n[this.props.screenProps.language]
  }

  componentDidMount() {
    this.setState({
      isEnglish: this.props.screenProps.language === 'en'
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      i18n: i18n[nextProps.screenProps.language]
    })
  }

  _logout() {
    // this.props.screenProps.userLogout();
    // this.props.refreshReset();
    api.logout().then(data => {
      if(data.status === 200 && data.data.ro.ok){
        ToastUtil.showWithMessage("登出成功")
        this.props.screenProps.userLogout();
        // this.props.refreshReset();
      }
      else{
        ToastUtil.showWithMessage("登出失敗")
      }
    },() => {
        ToastUtil.showWithMessage("登出失敗,請檢查網絡")
    })
  }
  
  _changeLanguage = (value) => {
    this.props.screenProps.changeLanguage(language = value ? 'en' : 'zh')
      this.setState({
        isEnglish: value,
        i18n: i18n[this.props.screenProps.language]
      });
  }

  _renderListFooterView = () => (
    <Button transparent onPress={() => {
      Alert.alert(
        '提示',
        '確定要登出嗎？',
        [
          {text: '取消', onPress: () => {return null}, style: 'cancel'},
          {text: '確定', onPress: () => this._logout()},
        ],
        { cancelable: false }
      )
    }}
      block style={{
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 0,
        backgroundColor: Colors.main_white,
        
      }}>
      <Text style={{color:Colors.fontBlack,fontSize:16}}>{this.state.i18n.logout}</Text>
    </Button>
  )

  render() {
    let _setting_ios = {content:'通知',isEnd:false,clickFunc:() => {
      Linking.openURL('app-settings:')
      .catch(err => console.log(err))
    }};
    const _list_arr = [      
      // {
      //   content:'語言',isEnd:false,clickFunc:() => {
      //     ToastUtil.showWithMessage('該功能暫未開放');
      //   }
      // },
      {
        content: '隱私政策',isEnd:false,clickFunc:() => {
          this.props.navigation.navigate("Statement", { name: "policy" })
        }
      },
      {
        content: '服務條款',isEnd: true,clickFunc:() => {
          this.props.navigation.navigate("Statement", { name: "service" })
        }
      },
    ];
    if(Platform.OS == 'ios') {
      _list_arr.unshift(_setting_ios);
    }
    return (
      <Container style={{backgroundColor: '#edebf4'}}>
        <CommonHeader title="系統設置" canBack {...this.props}/>
          <ScrollView>
          <TouchableWithoutFeedback delayLongPress={4000} onLongPress={() => {appStorage.removeAll();alert('清除緩存成功')}}>
            <View style={{paddingTop: 20,justifyContent: 'flex-start',alignItems: 'center', height: 200}}>
              <Image source={require('./asset/icon_app.png')} style={{width: 80,height: 80,marginBottom: 20}}/>
              <Text>有得食 v1.1.7 </Text>
            </View>
          </TouchableWithoutFeedback>
            {_list_arr.map((item,key) => (
              <CommonItem key={key} content={item.content} isEnd={item.isEnd} clickFunc={item.clickFunc}/>
            ))}
            {this.props.screenProps.user !== null ? this._renderListFooterView() : null}
          </ScrollView>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    height:40,
    padding:10,
  }
})
