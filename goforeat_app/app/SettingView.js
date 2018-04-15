import React,{PureComponent} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Switch} from 'react-native'
import {Container,Body,Button,Icon,Content,ListItem,Left,Right} from 'native-base'
import {NavigationActions} from 'react-navigation'
//utils
import Colors from './utils/Colors';
import GLOBAL_PARAMS from './utils/global_params';
//components
import CommonHeader from './components/CommonHeader';
//language
import i18n from './language/i18n';

export default class SettingView extends PureComponent{
  state = {
    isEnglish: false,
    i18n: i18n[this.props.screenProps.language]
  }
  _currentItemClick = theme => {
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

  componentDidMount = () => {
    console.log(this.props);
    this.setState({
      isEnglish: this.props.screenProps.language === 'en'
    })
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      i18n: i18n[nextProps.screenProps.language]
    })
  }
  
  _changeLanguage = (value) => {
    this.props.screenProps.changeLanguage(language = value ? 'en' : 'zh')
      this.setState({
        isEnglish: value,
        i18n: i18n[this.props.screenProps.language]
      });
  }

  render() {
    const _data = [
      {data: [{bgColor:Colors.main_orange,name:'橙'},
      {bgColor:Colors.main_purple,name:'紫'},
      {bgColor:Colors.main_green,name:'綠'},
      {bgColor:Colors.main_blue,name:'藍'},]},
      {data:[{bgColor:Colors.main_black,name:'暗'},
      {bgColor:Colors.main_red,name:'紅'},
      {bgColor:Colors.ionBlue,name:'鐵藍'},
      {bgColor:Colors.main_brown,name:'咖啡'},]},
      {data:[{bgColor:Colors.blue_green,name:'青綠'},
      {bgColor:Colors.deep_green,name:'深綠'},
      {bgColor:Colors.middle_red,name:'緋紅'}, 
      {bgColor:Colors.rate_yellow,name:'黃'}]}     
    ];
    const {i18n} = this.state;
    return (
      <Container>
        <CommonHeader title={i18n.setting_title} canBack {...this['props']}/>
        <Content>
          <View style={styles.title}>
            <Text>{i18n.theme}</Text>
          </View>
          {
            _data.map((item,idx) => (
              <View style={{flex: 1,flexDirection: 'row'}} key={idx}>
                {item.data.map((ditem,didx) => (
                  <TouchableOpacity key={didx} style={{height:50,backgroundColor:ditem.bgColor,
                    flex:1,justifyContent:'center',paddingLeft:10,paddingRight:10,
                    flexDirection:'row',alignItems:'center',width:GLOBAL_PARAMS._winWidth*0.5}}
                    onPress={() => this._currentItemClick(ditem.bgColor)}>
                    {this.props.screenProps.theme === ditem.bgColor ? (<Icon name="md-checkmark-circle" style={{fontSize:20,color:'#fff'}}/>)
                    : null }
                  </TouchableOpacity>
                ))}
              </View>
            ))
          }    
          <View style={styles.title}>
            <Text>{i18n.language}</Text>
          </View>
          <ListItem style={{backgroundColor: Colors.main_white,marginLeft: 0}}>
              <Body>
                <Text style={{paddingLeft:10}}>for English</Text>
              </Body>
              <Right>
                <Switch  value={this.state.isEnglish} onValueChange={(value) => this._changeLanguage(value)}/>
              </Right>
            </ListItem>
            <View style={styles.title}>
              <Text>{i18n.cache}</Text>
            </View>
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
