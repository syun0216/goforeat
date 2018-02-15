import React, { Component } from "react";
import { View, Text, TouchableOpacity,StyleSheet,SectionList,Image,Alert,Modal,ScrollView } from "react-native";
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
    api.logout().then(data => {
      if(data.status === 200 && data.data.ro.ok){
        ToastUtil.show("登出成功", 1000, "bottom","success")
        this.props.userLogout();
        this.props.refreshReset();
      }
      else{
        ToastUtil.show("登出失敗", 1000, "bottom","warning")
      }
    },() => {
        ToastUtil.show("登出失敗,請檢查網絡", 1000, "bottom","warning")
    })
  }

  _commonItemClick = (name) => {
    if(this.props.user === null) {
      this.props.navigation.navigate('Login')
    }else {
      this.props.navigation.navigate('Statement',{name:name})
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
    <View style={[styles.loginHeader,{backgroundColor:this.props.theme}]}>
      {this.props.user !== null ? (<Image style={styles.personAvatar} source={require('../asset/eat.png')}/>) :
    (<Image style={styles.personAvatar} source={require('../asset/touxiang.png')}/>)}
      {this.props.user !== null ? (<Text style={{fontSize:16,color:'#fff',marginTop:10}}>用戶:{this.props.user}</Text>) :
    (<TouchableOpacity style={{marginTop:10}} onPress={() => this.props.navigation.navigate("Login")}>
      <Text style={{fontSize:16,color:'#fff'}}>登錄/註冊</Text>
    </TouchableOpacity>)}
    </View>
  )

  _renderCommonItemView = () => (
    <View style={{display:'flex',flexDirection:'row',borderBottomWidth:1,borderColor:'#ddd',backgroundColor:'#fff',height:70,marginBottom:10}}>
      <TouchableOpacity style={styles.commonItem} onPress={() => this._commonItemClick('service')}>
        <Image source={require('../asset/01-guanli.png')} style={styles.commonImage}/>
        <Text>服務條款</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.commonItem} onPress={() => {
        this.props.user !== null ? this.props.navigation.navigate('MyFavorite') : this.props.navigation.navigate('Login')
      }}>
        <Image source={require('../asset/02-guanzhu.png')} style={styles.commonImage}/>
        <Text>我的關注</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.commonItem} onPress={() => this._commonItemClick('policy')}>
        <Image source={require('../asset/03-renzheng.png')} style={styles.commonImage}/>
        <Text>隱私政策</Text>
      </TouchableOpacity>
    </View>
  )

  _renderCommonListView = () => {
    const _data = [
      {name:'關於我們',icon:'md-people',func:() => this._commonItemClick('about')},
        {name:'允許使用政策',icon:'md-log-in',func:() => this._commonItemClick('allowPolicy')},
        {name:'刪除內容政策',icon:'md-log-out',func:() => this._commonItemClick('deletePolicy')},
        {name:'系統設置',icon:'md-settings',func:() => this.props.navigation.navigate('Setting')}
    ]
    return (
    <List>
      {_data.map((item,idx) => (
        <View key={idx} >
          <ListItem style={{backgroundColor:'#fff',marginLeft:0,paddingLeft:10}} icon onPress={() => item.func()}>
            <Left>
              <Icon style={{color: this.props.theme,fontSize:22}} name={item.icon}></Icon>
            </Left>
            <Body>
              <Text>{item.name}</Text>
            </Body>
            <Right>
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
        backgroundColor:this.props.theme
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
        <View style={{flex:1}}>
          {this._renderPersonDetailHeader()}
          {this._renderCommonItemView()}
          <ScrollView style={{paddingBottom:10}}>
            {this._renderCommonListView()}
            {this.props.user !== null ? this._renderListFooterView() : null}
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
