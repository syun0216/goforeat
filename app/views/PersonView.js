import React, { Component } from "react";
import { View, StatusBar, Text, TouchableOpacity,StyleSheet,SectionList,Image,Alert,Modal,ScrollView } from "react-native";
import {
  Container,
  Header,
  Body,
  Right,
  Left,
  Button,
  Icon,
  Title,
  Content,
  ListItem,
  List
} from "native-base";
//cache
import appStorage from "../cache/appStorage";
//Colors
import Colors from '../utils/Colors'
//utils
import GLOBAL_PARAMS from '../utils/global_params'
import ToastUtil from '../utils/ToastUtil'
//api
import api from '../api'
//components
import CommonModal from '../components/CommonModal'
import Divider from '../components/Divider'

export default class PeopleView extends Component {
  state = {
    modalVisible: false,
    modalContent: '',
    modalTitle:''
  }
  //common function
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

  _commonItemClick = (name) => {
    let {navigate} = this.props.navigation;
    if(this.props.screenProps.user === null) {
      navigate('Login')
    }else {
      if(name === 'integral') {
        navigate('Integral');
      }else if(name === 'upload'){
        navigate('Upload');
      }else{
        navigate('Statement',{name:name})
      }
    }
  }

  _showModal = (title,content) => {
    this.setState({
      modalVisible: true,
      modalContent: content,
      modalTitle: title
    })
    // console.log(123)
  }

  _renderPersonDetailHeader = () => (
    <View style={[styles.loginHeader,{backgroundColor:this.props.screenProps.theme}]}>
      {this.props.screenProps.user !== null ? (<Image style={styles.personAvatar} source={require('../asset/eat.png')}/>) :
    (<Image style={styles.personAvatar} source={require('../asset/touxiang.png')}/>)}
      {this.props.screenProps.user !== null ? (<Text style={{fontSize:16,color:'#fff',marginTop:10}}>用戶:{this.props.screenProps.user}</Text>) :
    (<TouchableOpacity style={{marginTop:10}} onPress={() => this.props.navigation.navigate("Login")}>
      <Text style={{fontSize:16,color:'#fff'}}>登錄/註冊</Text>
    </TouchableOpacity>)}
    </View>
  )

  _renderCommonItemView = () => (
    <View style={{display:'flex',flexDirection:'row',borderBottomWidth:1,borderColor:'#ddd',backgroundColor:'#fff',height:70,marginBottom:10}}>
      <TouchableOpacity style={styles.commonItem} onPress={() => this._commonItemClick('integral')}>
        <Image source={require('../asset/01-guanli.png')} style={styles.commonImage}/>
        <Text>積分兌換</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.commonItem} onPress={() => {
        this.props.screenProps.user !== null ? this.props.navigation.navigate('MyFavorite') : this.props.navigation.navigate('Login')
      }}>
        <Image source={require('../asset/02-guanzhu.png')} style={styles.commonImage}/>
        <Text>我的關注</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.commonItem} onPress={() => this._commonItemClick('upload')}>
        <Image source={require('../asset/03-renzheng.png')} style={styles.commonImage}/>
        <Text>上傳發票</Text>
      </TouchableOpacity>
    </View>
  )

  _renderCommonListView = () => {
    const _data = [
      // {name:'關於我們',icon:'md-people',func:() => this._commonItemClick('about')},
        {name:'允許使用政策',icon:'md-log-in',func:() => this._commonItemClick('allowPolicy')},
        {name:'刪除內容政策',icon:'md-log-out',func:() => this._commonItemClick('deletePolicy')},
        {name:'系統設置',icon:'md-settings',func:() => this.props.navigation.navigate('Setting')},
        // {name:'上傳發票',icon:'md-cloud-upload',func:() => this.props.navigation.navigate('Setting')},
        // {name:'積分兌換',icon:'md-attach',func:() => this.props.navigation.navigate('Setting')},
    ]
    return (
    <List>
      {_data.map((item,idx) => (
        <View key={idx} >
          <ListItem style={{backgroundColor:'#fff',marginLeft:0,paddingLeft:10}} icon onPress={() => item.func()}>
            <Left>
              <Icon style={{color: this.props.screenProps.theme,fontSize:22}} name={item.icon}></Icon>
            </Left>
            <Body style={{borderBottomWidth:0}}>
              <Text>{item.name}</Text>
            </Body>
            <Right style={{borderBottomWidth:0}}>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          <Divider />
        </View>
      ))}
    </List>
  )}

  _renderListFooterView = () => (
    <Button onPress={() => {
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
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor:this.props.screenProps.theme
      }}>
      <Text style={{color:'#fff',fontSize:16}}>登出</Text>
    </Button>
  )

  _renderModalView = () => (
    <CommonModal content={this.state.modalContent}
      title={this.state.modalTitle}
       modalVisible={this.state.modalVisible}
       closeFunc={() => this.setState({modalVisible:false})}
       {...this['props']}/>
  )

  render() {
    return (
      <Container>
        {this._renderModalView()}
        <StatusBar />
        <View style={{flex:1}}>
          {this._renderPersonDetailHeader()}
          {this._renderCommonItemView()}
          <ScrollView style={{paddingBottom:10}}>
            {this._renderCommonListView()}
            {this.props.screenProps.user !== null ? this._renderListFooterView() : null}
          </ScrollView>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  loginContainer:{
    flex:1
  },
  loginHeader: {
    width: GLOBAL_PARAMS._winWidth,
    height: 200,
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  personAvatar: {
    width:65,
    height:65,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  commonItem:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  commonImage: {
    width:28,
    height:28,
    marginBottom:10
  }
})
