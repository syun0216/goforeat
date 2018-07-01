import React,{PureComponent} from 'react'
import {View,Text,StyleSheet,Alert} from 'react-native'
import {Container,Button} from 'native-base'
//utils
import Colors from './utils/Colors';
import ToastUtil from './utils/ToastUtil';
//components
import CommonHeader from './components/CommonHeader';
//language
import i18n from './language/i18n';
//api
import api from './api/index'

export default class SettingView extends PureComponent{
  state = {
    isEnglish: false,
    i18n: i18n[this.props.screenProps.language]
  }
  _currentItemClick = theme => {
    if(theme === this.props.screenProps.theme) return;
    this.props.screenProps.changeTheme(theme)
  }

  componentDidMount = () => {
    // console.log(this.props);
    this.setState({
      isEnglish: this.props.screenProps.language === 'en'
    })
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      i18n: i18n[nextProps.screenProps.language]
    })
  }

  _logout = () => {
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
        paddingTop: 20,
        borderRadius: 0,
        backgroundColor: Colors.main_white,
        paddingBottom: 20,
      }}>
      <Text style={{color:Colors.fontBlack,fontSize:16}}>{this.state.i18n.logout}</Text>
    </Button>
  )

  render() {
    return (
      <Container>
        <CommonHeader title={i18n.setting_title} canBack {...this.props}/>

          <View style={{paddingTop: 20,justifyContent: 'flex-start',alignItems: 'center', flex: 1,backgroundColor: '#edebf4'}}>
            <Text>有得食 v1.1.5版本</Text>
          </View>
          {this.props.screenProps.user !== null ? this._renderListFooterView() : null}

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
