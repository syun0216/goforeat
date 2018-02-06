import React, { Component } from "react";
import { View, Text, TouchableOpacity,StyleSheet,SectionList,Image,Alert } from "react-native";
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
  ListItem
} from "native-base";
//cache
import appStorage from "../utils/appStorage";
//Colors
import Colors from '../utils/Colors'
//utils
import GLOBAL_PARAMS from '../utils/global_params'
import ToastUtil from '../utils/ToastUtil'
//api
import api from '../api'

export default class PeopleView extends Component {
  componentDidMount() {
  }
  //common function
  _logout = () => {
    api.logout().then(data => {
      if(data.status === 200 && data.data.ro.ok){
        ToastUtil.show("登出成功", 1000, "top","success")
        this.props.userLogout();
        this.props.refreshReset();
      }
      else{
        ToastUtil.show("登出失敗", 1000, "top","warning")
      }
    },() => {
        ToastUtil.show("登出失敗,請檢查網絡", 1000, "top","warning")
    })
  }

  _renderNotLoginView() {
    return (
      <Button style={{ alignSelf: "center", marginTop: 100 }} transparent onPress={() => this.props.navigation.navigate("Login")}>
        <Text style={{color:Colors.main_orange,fontSize:20}}>未登錄，請先登錄哦</Text>
      </Button>
    );
  }

  _renderIsLoginView = () => (
    <SectionList
      ref={(sectionList) => this.sectionList = sectionList}
      sections={[
        {title:'收藏餐廳列表',data:[
          {name:'大頭蝦餐廳',icon:'md-pizza'},
          {name:'滾滾來火鍋',icon:'md-pizza'}
        ]},
        {title:'收藏文章列表',data:[
          {name:'九龍最火的美食城',icon:'md-bookmarks'},
          {name:'搜羅最全中環地道美食',icon:'md-bookmarks'},
        ]}
      ]}
      keyExtractor={(item, index) => index} // 消除SectionList warning
      renderItem={({item}) => (
        <ListItem icon onPress={() => this.props.navigation.navigate('Content',{data:{name:item.name},kind:'canteen'})}>
          <Left>
            <Icon color={Colors.main_orange} name={item.icon}></Icon>
          </Left>
          <Body>
            <Text>{item.name}</Text>
          </Body>
          <Right>
            <Icon name="arrow-forward" />
          </Right>
        </ListItem>
      )}
      renderSectionHeader={({section}) => (
        <Text style={styles.sectionHeader}>{section.title}</Text>
      )}
      ListHeaderComponent={() => this._renderPersonDetailHeader()}
      ListEmptyComponent={() => (
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
          <Text>您還未收藏任何餐廳和文章哦</Text>
        </View>
      )}
      ListFooterComponent={() => (
        <Button style={{ alignSelf: "center"}} transparent onPress={() => {
          Alert.alert(
            '提示',
            '確定要登出嗎？',
            [
              {text: '取消', onPress: () => {return null}, style: 'cancel'},
              {text: '確定', onPress: () => this._logout()},
            ],
            { cancelable: false }
          )
        }}>
          <Text style={{color:Colors.main_orange,fontSize:20}}>登出</Text>
        </Button>
      )}
    />
  )

  _renderPersonDetailHeader = () => (
    <View style={[styles.loginHeader,{backgroundColor:Colors.main_orange}]}>
      <Image style={styles.personAvatar} source={require('../asset/eat.png')}/>
      <Text style={{marginTop:10}}>用戶:{this.props.user}</Text>
    </View>
  )

  render() {
    return (
      <Container>
        {this.props.user !== null ? null : (<Header style={{ backgroundColor: "#fff" }}>
          <Body>
            <Text>個人詳情</Text>
          </Body>
        </Header>)}
        <Content>
          {this.props.user !== null
            ? this._renderIsLoginView()
            : this._renderNotLoginView()}
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
    width:80,
    height:80,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  }
})
