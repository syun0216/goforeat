import React,{Component} from 'react'
import {View,SectionList,Image,StyleSheet,Platform,ScrollView,TouchableWithoutFeedback,ActivityIndicator,TouchableOpacity,Animated,Easing} from 'react-native'
import {Container,Header,Content,List,ListItem,Left,Body,Right,Thumbnail,Button,Text,Spinner,Icon} from 'native-base'

//api
import api from '../api'
//components
import GoodsSwiper from '../components/Swiper'
import Dropdownfilter from '../components/Dropdownfilter'
import Loading from '../components/Loading'
import ErrorPage from '../components/ErrorPage'
//utils
import GLOBAL_PARAMS from '../utils/global_params'
import Colors from '../utils/Colors'
import ToastUtil from '../utils/ToastUtil'

let requestParams = {
  status: {
    LOADING: 0,
    LOAD_SUCCESS: 1,
    LOAD_FAILED: 2
  },
  currentPage: 1,
  isFirstTime: false //判断是不是第一次触发sectionlist的onendreach方法
}

const diffplatform = {
  subHeaderTop:Platform.select({ios: 64, android: 52}),
  filterTop:Platform.select({ios: 94, android: 82})
}

export default class GoodsListPageView extends Component{

  sectionList = null
  onEndReachedCalledDuringMomentum = false

  state = {
    loading: false,
    bottomRequestStatus:requestParams.status.LOADING,
    canteenDetail: [],
    canteenOptions: null,
    showFilterList: false,
    loadingStatus:{
      firstPageLoading: requestParams.status.LOADING,
      pullUpLoading: requestParams.status.LOADING
    },
    positionTop: new Animated.Value(0)
  }

  componentDidMount() {
    this.getCanteenDetail()
    this.getCanteenOption()
  }


  //api function
  getCanteenDetail = () => {
    api.getCanteenDetail(requestParams.currentPage).then(data => {
      if(data.status === 200) {
        this.setState({
          canteenDetail: this.state.canteenDetail.concat(data.data.data),
          loadingStatus:{
            firstPageLoading: requestParams.status.LOAD_SUCCESS
          }
        })
      }
      else{
        this.setState({
          loadingStatus:{
            firstPageLoading: requestParams.status.LOAD_FAILED
          }
        })
        requestParams.currentPage --;
      }
    },() => {
      ToastUtil.show('网络请求出错','bottom',1000,'warning')
      this.setState({
        loadingStatus:{
          firstPageLoading:requestParams.status.LOAD_FAILED
        }
      })
      requestParams.currentPage --;
    })
  }

  getCanteenOption = () => {
    api.getCanteenOptions().then(data => {
      if(data.status === 200 ){
        this.setState({
          canteenOptions: data.data,
        })
      }
    },() => {
      ToastUtil.show('网络请求出错','bottom',1000,'warning')
    })
  }

  // common function
  _onEndReached = () => {
    if (!this.onEndReachedCalledDuringMomentum) {
      console.log('onend')
      this.onEndReachedCalledDuringMomentum = true;
    }
    console.log('onend')
    // requestParams.currentPage ++;
    // this.getCanteenDetail()

  }

  _onRefreshToRequestFirstPageData = () => {
    // requestParams.currentPage = 1
    this.getCanteenDetail()
  }

  _toToggleFilterListView= () => {
    this.setState({
      showFilterList: !this.state.showFilterList
    })
    Animated.spring(this.state.positionTop, {
      toValue: this.state.showFilterList? 0 : 1, // 目标值
      duration: 1000, // 动画时间
      easing: Easing.linear // 缓动函数
    }).start();
  }

//views
  _renderSubHeader = () => (
    <View style={{
      position:'absolute',
      top:diffplatform.subHeaderTop,
      zIndex:100,
      width:GLOBAL_PARAMS._winWidth,
      height:30,
      display:'flex',
      justifyContent:'center',
      backgroundColor:'#fff',
      flexDirection:'row'}}>
      <TouchableOpacity onPress={() => this._toToggleFilterListView()} style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
        <Icon name='md-compass' style={{fontSize:20,color:Colors.main_orange,marginRight:5}}/>
        <Text>地區</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => this._toToggleFilterListView()} style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
        <Icon name='md-funnel' style={{fontSize:20,color:Colors.main_orange,marginRight:5}}/>
        <Text>分類</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => this._toToggleFilterListView()} style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
        <Icon name='md-contacts' style={{fontSize:20,color:Colors.main_orange,marginRight:5}}/>
        <Text>人數</Text>
      </TouchableOpacity>
    </View>
  )

  _renderFilterView= () => {
    return (

      <Animated.View style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        position: 'absolute',
        zIndex: 100,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        width: GLOBAL_PARAMS._winWidth,
        height: 251,
        top: this.state.positionTop.interpolate({
            inputRange: [0, 1],
            outputRange: [-270, diffplatform.filterTop]
        })
      }}>
        <Dropdownfilter filterData={this.state.canteenOptions}/>
      </Animated.View>
    )
  }

  _renderPreventClickView= () => {
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

  _renderSectionList= (data,key) =>{
    return (
        <SectionList
          style={{marginTop:32}}
          bounces={false}
          ref={(sectionList) => this.sectionList = sectionList}
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
          // onRefresh={() => alert('onRefresh: nothing to refresh :P')}
          // onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
          onEndReachedThreshold={0}
          onEndReached={() => this._onEndReached()}
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

  _renderSectionListItem = (item,index) => (
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
          <Text note style={{color:'#ff5858',fontSize:18}}>${item.price}</Text>
        </Right>
      </ListItem>
    )

    render(){
      return (
        <Container>
          {this.state.loadingStatus.firstPageLoading === requestParams.status.LOADING ?
            <Loading message="玩命加載中..."/> : (this.state.loadingStatus.firstPageLoading === requestParams.status.LOAD_FAILED ?
            <ErrorPage errorTips="加載失敗,請點擊重試" errorToDo={this._onRefreshToRequestFirstPageData}/> : null)}

          {this.state.showFilterList ? this._renderPreventClickView() : null}
          {this.state.canteenOptions ? this._renderFilterView() : null}
          {this._renderSubHeader()}
          <Header style={{backgroundColor:'#fff'}}>
            <Left>
              {/* <TouchableOpacity onPress={() => this._toToggleFilterListView()}>
                <View>
                  <Text style={{color: Colors.main_orange}}>{this.state.showFilterList? '收起分類' : '篩選分類'}</Text>
                </View>
              </TouchableOpacity> */}
              <TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerOpen')}>
                <View>
                  <Icon name="md-apps" size={20} style={{color:Colors.main_orange}}/>
                </View>
              </TouchableOpacity>
            </Left>
            <Body>
              <Text>Goforeat</Text>
            </Body>
            <Right><Icon onPress={() => this.props.navigation.navigate('Search')} name="ios-search" size={25} style={{color: Colors.main_orange}} /></Right>
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
