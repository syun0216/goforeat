import React,{Component} from 'react'
import {View,SectionList,Image,StyleSheet,ScrollView,TouchableWithoutFeedback,ActivityIndicator,TouchableOpacity,Animated,Easing} from 'react-native'
import {Container,Header,Content,List,ListItem,Left,Body,Right,Thumbnail,Button,Text,Spinner} from 'native-base'
import FeatherIcon from 'react-native-vector-icons/Feather'
//api
import api from '../api'
//components
import GoodsSwiper from '../components/Swiper'
import Dropdownfilter from '../components/Dropdownfilter'
//utils
import GLOBAL_PARAMS from '../utils/global_params'
import Colors from '../utils/Colors'

export default class GoodsListPageView extends Component{

  state = {
    canteenDetail: [],
    canteenOptions: null,
    currentPage: 1,
    showFilterList: false,
    positionTop: new Animated.Value(0)
  }

  //api function
  getCanteenDetail(){
    api.getCanteenDetail(this.state.currentPage).then(data => {
      if(data.status === 200 && data.data.data.length > 0) {
        this.setState({
          canteenDetail: data.data.data
        })
      }
    })
  }

  getCanteenOption() {
    api.getCanteenOptions().then(data => {
      if(data.status === 200 ){
        this.setState({
          canteenOptions: data.data
        })
      }
    })
  }

  // common function
  _onEndReached() {
    console.log('onend')
  }

  _onRefreshToRequestFirstPageData(){
    this.setState({
      currentPage: 1
    })
    this.getCanteenDetail()
  }

  _toToggleFilterListView() {
    this.setState({
      showFilterList: !this.state.showFilterList
    })
    Animated.spring(this.state.positionTop, {
      toValue: this.state.showFilterList? 0 : 1, // 目标值
      duration: 1000, // 动画时间
      easing: Easing.linear // 缓动函数
    }).start();
  }

  componentDidMount() {
    this.getCanteenDetail()
    this.getCanteenOption()
  }

  _renderFilterView() {
    return (

      <Animated.View style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        position: 'absolute',
        zIndex: 1,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        width: GLOBAL_PARAMS._winWidth,
        height: 251,
        top: this.state.positionTop.interpolate({
            inputRange: [0, 1],
            outputRange: [-250, 62]
        })
      }}>
        <Dropdownfilter filterData={this.state.canteenOptions}/>
      </Animated.View>
    )
  }

  _renderPreventClickView() {
    return this.state.showFilterList ? <TouchableWithoutFeedback onPress={() => this._toToggleFilterListView(0)}>
        <View style={{
            width: GLOBAL_PARAMS._winWidth,
            height: GLOBAL_PARAMS._winHeight,
            position: 'absolute',
            zIndex: 99,
            top: 0,
            left: 0,
            backgroundColor: '#5b7492',
            opacity: 0.3
        }}/>
    </TouchableWithoutFeedback> : null;
  }

  _renderSectionList(data,key) {
    return (
        <SectionList
          sections={[
            {title:'餐廳列表',data:this.state.canteenDetail},
          ]}
          stickySectionHeadersEnabled={true}
          renderItem={({item,index}) => this._renderSectionListItem(item,index)}
          keyExtractor={(item, index) => index} // 消除SectionList warning
          renderSectionHeader={({section}) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          refreshing={true}
          initialNumToRender={7}
          // onRefresh={() => this._onRefreshToRequestFirstPageData}
          onEndReachedThreshold={10}
          onEndReached={this._onEndReached}
          ListHeaderComponent={() => <GoodsSwiper />}
          ListEmptyComponent={() => (
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
              <Text>沒有數據了...</Text>
            </View>
          )}
          ListFooterComponent={() => (
            <View style={{height:50,flex:1,flexDirection:'row',justifyContent:'center'}}>
              <ActivityIndicator style={{flex:1,}} size='small' color='#000'/>
              {/* <Text style={{flex:1}}>正在加載中...</Text> */}
            </View>
          )}
        />
    )
  }

  _renderSectionListItem(item,index) {
    return (
      <ListItem avatar key={index} onPress={() =>this.props.navigation.navigate('Content',{
        data:item
      })}>
        <Left>
          <Thumbnail size={10}  source={{uri:item.image}} />
        </Left>
        <Body>
          <Text>{item.name}</Text>
          <Text note style={{fontSize:13}}>地址：{item.address}</Text>
          <Text note>评分：{item.rate}</Text>
        </Body>
        <Right>
          <Text note style={{color:'#ff5858'}}>${item.price}</Text>
        </Right>
      </ListItem>
    )
  }

    render(){
      return (
        <Container>
          {/* {this.state.showFilterList ? this._renderPreventClickView() : null} */}
          {this.state.canteenOptions ? this._renderFilterView() : null}
          <Header style={{backgroundColor:'#fff',zIndex:10}}>
            <Left>
              <TouchableOpacity onPress={() => this._toToggleFilterListView()}>
                <View>
                  <Text style={{color: Colors.main_orange}}>{this.state.showFilterList? '收起分類' : '篩選分類'}</Text>
                </View>
              </TouchableOpacity>
              {/* <Image style={{width:40,height:40}} source={require('../asset/eat.png')}/> */}
            </Left>
            <Body>
              <Text>Goforeat</Text>
            </Body>
            <Right><FeatherIcon onPress={() => this.props.navigation.navigate('Search')} name="search" size={25} style={{color: Colors.main_orange}} /></Right>
          </Header>
          <Content>
            {this.state.canteenDetail.length > 0 ? this._renderSectionList() : null}
          </Content>
        </Container>
      )
    }
}

const styles = StyleSheet.create({
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
