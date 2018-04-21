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
import Divider from '../components/Divider';
//language
import i18n from '../language/i18n';

export default class PeopleView extends Component {
  state = {
    modalVisible: false,
    modalContent: '',
    modalTitle:'',
    i18n: i18n[this.props.screenProps.language]
  }


  componentWillReceiveProps = (nextProps) => {
    this.setState({
      i18n: i18n[nextProps.screenProps.language]
    })
  }

  //common function

  _renderPersonDetailHeader = () => (
    <View style={[styles.loginHeader,{backgroundColor:this.props.screenProps.theme}]}>
      <Button transparent onPress={() => this.props.navigation.goBack()} 
      style={{position: 'absolute',top: 90,left: 10}}>
      <Icon
        size={30}
        name="ios-arrow-back"
        style={[{ fontSize: 25, color: Colors.main_white }]}
      />
    </Button>
      {this.props.screenProps.user !== null ? (<Image style={styles.personAvatar} source={require('../asset/eat.png')}/>) :
    (<Image style={styles.personAvatar} source={require('../asset/touxiang.png')}/>)}
      {this.props.screenProps.user !== null ? (<Text style={{fontSize:16,color:'#fff',marginTop:10}}>用戶:{this.props.screenProps.user}</Text>) :
    (<TouchableOpacity style={{marginTop:10}} onPress={() => this.props.navigation.navigate("Login")}>
      <Text style={{fontSize:16,color:'#fff'}}>{this.state.i18n.login_text}</Text>
    </TouchableOpacity>)}
    </View>
  )

  render() {
    return (
      <Container>
        <StatusBar />
        <View style={{flex:1}}>
          {this._renderPersonDetailHeader()}
          <ScrollView style={{paddingBottom:10}}>
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
    alignItems: 'center',
    position: 'relative'
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
