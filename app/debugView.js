import React, { Component } from 'react';
import {
  View,
  Image,
  Text
} from 'react-native';
import {Item,Input,Label,List,ListItem,Left} from "native-base";
//components
import CustomizeContainer from "./components/CustomizeContainer";
import CommonHeader from "./components/CommonHeader";
import CommonItem from "./components/CommonItem";
import CommonBottomBtn from "./components/CommonBottomBtn";
//styles
import PaySettingStyles from "./styles/paysetting.style";
//utils
import ToastUtil from "./utils/ToastUtil";
import {isDebugVersion} from "./utils/DeviceInfo";
//cache
import {debugStorage} from "./cache/appStorage";


const _checked = "./asset/checked.png";
const _unchecked = "./asset/unchecked.png";
const server = [
  {id: 1,label: '正式服', value: "https://api.goforeat.hk"},
  {id: 2,label: '测试服', value: "http://118.25.159.37"},
  {id: 3, label: '自定義服務器地址', value: ''}
];
export default class debugView extends Component {
  serveCustom = "";
  state = {
    curselect: null
  }

  componentDidMount() {
    debugStorage.getData((err, data) => {
      if(err == null && data) {
        console.log(data);
        this.setState({
          curselect: data
        })
      }else {
        this.setState({
          curselect: {id: 1,label: '正式服', value: "https://api.goforeat.hk"}
        })
      }
    })
  }

  _checked(item) {
    this.setState({
      curselect: item
    })
  }

  _confirmServer() {
    if(this.state.curselect.id == 3 && this.state.curselect.value == "") {
      ToastUtil.showWithMessage("請輸入服務器地址");
      return;
    }
    debugStorage.setData(this.state.curselect);
    ToastUtil.showWithMessage("设置成功");
  }

  _renderCheckImage(id) {
    return (
      <Image 
        source={this.state.curselect && this.state.curselect.id == id ? require(_checked): require(_unchecked)}
        style={PaySettingStyles.payRightImage}
        resizeMode="contain"
      />
    )
  }

  render() {
    return (
      <CustomizeContainer.SafeView mode="linear" >
        <CommonHeader title="debug setting" canBack/>
        <List style={{marginBottom: 15}}>
            <ListItem onPress={() => debugStorage.removeData()}>
              <Left>
                <Text>清空緩存</Text>
              </Left>
            </ListItem>
        </List>
        {
          server.map((val,idx) => (
            <CommonItem key={idx} content={val.label+" "+val.value} clickFunc={() => this._checked(val)} rightIcon={this._renderCheckImage(val.id)}/>
          ))
        }
        {
          this.state.curselect && this.state.curselect.id == 3 ? (
            <Item inlineLabel style={{paddingLeft: 10}}>
              <Label>自定義</Label>
              <Input placeholder="輸入服務器地址" allowFontScaling={false} clearButtonMode="while-editing" onChangeText={text => {
                let _obj = {
                  ...this.state.curselect,
                  value: text
                }
                this.setState({
                  curselect: _obj
                })
              }} value={this.state.curselect.value}/>
            </Item>
          ) : null
        }
        <CommonBottomBtn clickFunc={() => this._confirmServer()} style={{marginTop: 15}}>確定切換服務器</CommonBottomBtn>
      </CustomizeContainer.SafeView>
    )
  }
}