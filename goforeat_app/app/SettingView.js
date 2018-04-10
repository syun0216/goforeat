import React,{PureComponent} from 'react'
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import {Container,Body,Button,Icon,Content} from 'native-base'
import {NavigationActions} from 'react-navigation'
//utils
import Colors from './utils/Colors'
//components
import CommonHeader from './components/CommonHeader'

export default class SettingView extends PureComponent{
  _currentItemClick = theme => {
    // console.log(theme)
    if(theme === this.props.screenProps.theme) return;
    this.props.screenProps.changeTheme(theme)
    // const resetAction = NavigationActions.reset({
    //     index: 0,
    //     actions: [
    //         NavigationActions.navigate( { routeName: 'Home',params:{refresh:123}} )
    //     ],
    // });
    // this.props.navigation.dispatch(resetAction);
  }

  render() {
    const _data = [
      {bgColor:Colors.main_orange,name:'橙'},
      {bgColor:Colors.main_green,name:'綠'},
      {bgColor:Colors.main_blue,name:'藍'},
      {bgColor:Colors.main_black,name:'暗'},
      {bgColor:Colors.main_purple,name:'紫'},
      {bgColor:Colors.main_red,name:'紅'},
      {bgColor:Colors.ionBlue,name:'鐵藍'},
      {bgColor:Colors.main_brown,name:'咖啡'},
      {bgColor:Colors.blue_green,name:'青綠'},
      {bgColor:Colors.deep_green,name:'深綠'},
      {bgColor:Colors.middle_red,name:'緋紅'},      
    ]
    return (
      <Container>
        <CommonHeader title="系統設置" canBack {...this['props']}/>
        <Content>
          <View style={styles.title}>
            <Text>選擇主題</Text>
          </View>
          {
            _data.map((item,idx) => (
              <TouchableOpacity key={idx} style={{height:50,backgroundColor:item.bgColor,
                flex:1,justifyContent:'space-between',paddingLeft:10,paddingRight:10,
                flexDirection:'row',alignItems:'center'}}
                onPress={() => this._currentItemClick(item.bgColor)}>
                <Text style={{color:'#fff',fontSize:18}}>{item.name}</Text>
                {this.props.screenProps.theme === item.bgColor ? (<Icon name="md-checkmark-circle" style={{fontSize:20,color:'#fff'}}/>)
                : null }
              </TouchableOpacity>
            ))
          }
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    height:40,
    padding:10
  }
})
