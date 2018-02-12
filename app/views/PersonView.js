import React, { Component } from "react";
import { View, Text, TouchableOpacity,StyleSheet,SectionList,Image,Alert,Modal } from "react-native";
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

export default class PeopleView extends Component {
  state = {
    modalVisible: false
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

  _commonItemClick = () => {
    if(this.props.user === null) {
      this.props.navigation.navigate('Login')
    }else {
      ToastUtil.show('暫未開放',1000,'top','warning')
    }
  }

  _renderPersonDetailHeader = () => (
    <View style={[styles.loginHeader,{backgroundColor:Colors.main_orange}]}>
      {this.props.user !== null ? (<Image style={styles.personAvatar} source={require('../asset/eat.png')}/>) :
    (<Image style={styles.personAvatar} source={require('../asset/touxiang.png')}/>)}
      {this.props.user !== null ? (<Text style={{fontSize:16,color:'#fff',marginTop:10}}>用戶:{this.props.user}</Text>) :
    (<TouchableOpacity style={{marginTop:10}} onPress={() => this.props.navigation.navigate("Login")}>
      <Text style={{fontSize:16,color:'#fff'}}>登錄/註冊</Text>
    </TouchableOpacity>)}
    </View>
  )

  _renderCommonItemView = () => (
    <View style={{flex:1,flexDirection:'row',borderBottomWidth:1,borderColor:'#ddd',backgroundColor:'#fff',height:70,marginBottom:10}}>
      <TouchableOpacity style={styles.commonItem} onPress={this._commonItemClick}>
        <Image source={require('../asset/01-guanli.png')} style={styles.commonImage}/>
        <Text>商鋪管理</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.commonItem} onPress={() => {
        this.props.user !== null ? this.props.navigation.navigate('MyFavorite') : this.props.navigation.navigate('Login')
      }}>
        <Image source={require('../asset/02-guanzhu.png')} style={styles.commonImage}/>
        <Text>我的關注</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.commonItem} onPress={this._commonItemClick}>
        <Image source={require('../asset/03-renzheng.png')} style={styles.commonImage}/>
        <Text>實名認證</Text>
      </TouchableOpacity>
    </View>
  )

  _renderCommonListView = () => (
    <List>
      <ListItem style={{backgroundColor:'#fff',marginLeft:0,paddingLeft:10,marginBottom:10}} icon onPress={() => this.setState({modalVisible:true})}>
        <Left>
          <Icon style={{color: Colors.main_orange,fontSize:22}} name="md-contacts"></Icon>
        </Left>
        <Body>
          <Text>關於我們</Text>
        </Body>
        <Right>
          <Icon name="arrow-forward" />
        </Right>
      </ListItem>
      <ListItem style={{backgroundColor:'#fff',marginLeft:0,paddingLeft:10,marginBottom:10}} icon onPress={() => this.props.navigation.navigate('Setting')}>
        <Left>
          <Icon style={{color: Colors.main_orange,fontSize:22}} name="md-settings"></Icon>
        </Left>
        <Body>
          <Text>系統設置</Text>
        </Body>
        <Right>
          <Icon name="arrow-forward" />
        </Right>
      </ListItem>
    </List>
  )

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
        backgroundColor:Colors.main_orange
      }}>
      <Text style={{color:'#fff',fontSize:16}}>登出</Text>
    </Button>
  )

  _renderModalView = () => (
    <Modal
      animationType={"slide"}
      transparent={false}
      visible={this.state.modalVisible}
      onRequestClose={() => {alert("Modal has been closed.")}}
      >
     <View style={{flex:1,justifyContent:'center'}}>
      <View style={{flex:1,alignItems:'center',justifyContent:'center',marginTop:-20,padding:10}}>
        <Image source={require('../asset/logo.png')} style={{marginBottom:30}}/>
        <Text style={{marginLeft:20,marginRight:20,fontSize:16}}>Goforeat作為香港餐廳互聯網化的技術服務公司，
          力圖打造為每個香港餐廳量身定制網站和應用程序。
          網站不僅只限於展示熱門菜式、優惠，還包括餐廳招聘，數據分析等功能，
          為餐廳處理好每一個細節。讓商家能夠更專注于營運，做出更優質美食。</Text>
      </View>
      <View style={{height:100,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <TouchableOpacity onPress={() => {
          this.setState({modalVisible:false})
        }}>
          <Icon name="md-close-circle" style={{color:Colors.main_orange,fontSize:40}}/>
        </TouchableOpacity>
      </View>
     </View>
    </Modal>
  )

  render() {
    return (
      <Container>
        {this._renderModalView()}
        <Content>
          {this._renderPersonDetailHeader()}
          {this._renderCommonItemView()}
          {this._renderCommonListView()}
          {this.props.user !== null ? this._renderListFooterView() : null}
        </Content>
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
    flex:1,
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
