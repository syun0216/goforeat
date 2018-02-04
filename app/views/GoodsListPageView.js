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
import ListFooter from '../components/ListFooter'
import _ from 'lodash'

let requestParams = {
  status: {
    LOADING: 0,
    LOAD_SUCCESS: 1,
    LOAD_FAILED: 2,
    NO_MORE_DATA: 3
  },
  currentPage: 1,
  isFirstTime: false //判断是不是第一次触发sectionlist的onendreach方法
}

const diffplatform = {
  preventViewTop:Platform.select({ios: 56, android: 0}),
  filterTop:Platform.select({ios: 56, android: 56})
}

export default class GoodsListPageView extends Component{

  sectionList = null
  sview = null // 滾動視圖
  onEndReachedCalledDuringMomentum = false

  state = {
    loading: false,
    bottomRequestStatus:GLOBAL_PARAMS.httpStatus.LOADING,
    canteenDetail: [],
    canteenOptions: null,
    showFilterList: false,
    loadingStatus:{
      firstPageLoading: GLOBAL_PARAMS.httpStatus.LOADING,
      pullUpLoading: GLOBAL_PARAMS.httpStatus.LOADING
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
          canteenDetail: data.data.data,
          loadingStatus:{
            firstPageLoading: GLOBAL_PARAMS.httpStatus.LOAD_SUCCESS
          }
        })
      }
      else{
        this.setState({
          canteenDetail: data.data.data,
          loadingStatus:{
            firstPageLoading: GLOBAL_PARAMS.httpStatus.LOAD_SUCCESS
          }
        })
      }
    },() => {
      ToastUtil.show('网络请求出错','bottom',1000,'warning')
      this.setState({
        loadingStatus:{
          firstPageLoading:GLOBAL_PARAMS.httpStatus.LOAD_FAILED
        }
      })
    })
  }

  getCanteenOption = () => {
    api.getCanteenOptions().then(data => {
      if(data.status === 200 ){
        const _newCanteenOptionsArr = []
        for(let i in data.data) {
          data.data[i].unshift(['default','全部'])
          data.data[i] = _.chunk(data.data[i],3);
          switch (i) {
            case 'areas':_newCanteenOptionsArr.push({name:'地區',enName:'areas',value:data.data[i]});break;
            case 'categories':_newCanteenOptionsArr.push({name:'分類',enName:'categories',value:data.data[i]});break;
            case 'seats':_newCanteenOptionsArr.push({name:'人數',enName:'seats',value:data.data[i]});break;
          }
        }
        this.setState({
          canteenOptions: _newCanteenOptionsArr
        })
      }
    },() => {
      ToastUtil.show('网络请求出错','bottom',1000,'warning')
    })
  }

  // common function
  // _getListViewData(sview) {
    // console.log(sview.nativeEvent.contentOffset.y)
      // if (sview.nativeEvent.contentOffset.y > 100) {
      //     Animated.spring(this.state.positionBottom, {
      //         toValue: 1,
      //         duration: 500,
      //         easing: Easing.linear
      //     }).start();
      // }
      // else {
      //     Animated.timing(this.state.positionBottom, {
      //         toValue: 0,
      //         duration: 200,
      //         easing: Easing.linear
      //     }).start();
      // }
      // console.log(sview.nativeEvent.contentOffset.y);
  // }

  _onEndReached = () => {
    requestParams.currentPage ++
    console.log(123)

    // api.getCanteenDetail(requestParams.currentPage).then(data => {
    //   if(data.status === 200) {
    //     console.log(data)
    //     if(data.data.data.length === 0) {
    //       requestParams.currentPage --
    //       // this.setState({
    //       //   canteenDetail:this.state.canteenDetail.concat(data.data.data)
    //       //   loadingStatus: {
    //       //     pullUpLoading:GLOBAL_PARAMS.httpStatus.NO_MORE_DATA
    //       //   }
    //       // })
    //       return
    //     }
    //     this.setState({
    //       canteenDetail:this.state.canteenDetail.concat(data.data.data),
    //       loadingStatus:{
    //         pullUpLoading:GLOBAL_PARAMS.httpStatus.LOADING
    //       }
    //     })
    //   }
    // },() => {
    //   requestParams.currentPage --
    //   this.setState({
    //     loadingStatus: {
    //       pullUpLoading: GLOBAL_PARAMS.httpStatus.LOAD_FAILED
    //     }
    //   })
    // })
  }

  _onRequestFirstPageData = () => {
    requestParams.currentPage = 1
    this.getCanteenDetail()
    // const successCallBack = (data) => {
    //   this.setState({
    //     canteenDetail: data.data.data,
    //     loadingStatus:{
    //       firstPageLoading: GLOBAL_PARAMS.httpStatus.LOAD_SUCCESS
    //     }
    //   })
    // }
    // const successButNoDataCallBack = (data) => {
    //   this.setState({
    //     canteenDetail: data.data.data,
    //     loadingStatus:{
    //       firstPageLoading: GLOBAL_PARAMS.httpStatus.LOAD_SUCCESS
    //     }
    //   })
    // }
    // const failCallBack = () => {
    //   ToastUtil.show('网络请求出错','bottom',1000,'warning')
    //   this.setState({
    //     loadingStatus:{
    //       firstPageLoading:GLOBAL_PARAMS.httpStatus.LOAD_FAILED
    //     }
    //   })
    // }
    // this.getCanteenDetail(successCallBack,failCallBack,successButNoDataCallBack)

  }

  _toToggleFilterListView= () => {
    this.sectionList.scrollToLocation({
      sectionIndex: 0,
      itemIndex: 0,
      viewPosition: 0,
      viewOffset: 0,
      })
    let timer = setTimeout(() => {
      this.setState({
        showFilterList: !this.state.showFilterList
      })
      Animated.spring(this.state.positionTop, {
         toValue: this.state.showFilterList? 1 : 0, // 目标值
         duration: 1000, // 动画时间
         easing: Easing.linear // 缓动函数
       }).start();
      clearTimeout(timer)
    },0)
    // let timer = setTimeout(() => {
    //   Animated.spring(this.state.positionTop, {
    //     toValue: this.state.showFilterList? 0 : 1, // 目标值
    //     duration: 1000, // 动画时间
    //     easing: Easing.linear // 缓动函数
    //   }).start();
    //   clearTimeout(timer)
    // },1000)

  }

  _confirmToFilter = (data) => {
    console.log('data',data)
  }
//views
  _renderSubHeader = () => (
    <View style={{
      // position:'absolute',
      // top:diffplatform.subHeaderTop,
      borderColor:'#ccc',
      borderBottomWidth:1,
      zIndex:100,
      width:GLOBAL_PARAMS._winWidth,
      height:50,
      display:'flex',
      justifyContent:'center',
      backgroundColor:'#fff',
      flexDirection:'row'}}>
      <View style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
        {/* <Icon name='md-compass' style={{fontSize:20,color:Colors.main_orange,marginRight:5}}/> */}
        <Text>餐廳列表</Text>
      </View>
      <View style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
        {/* <Icon name='md-funnel' style={{fontSize:20,color:Colors.main_orange,marginRight:5}}/>
        <Text>分類</Text> */}
      </View>
      <TouchableOpacity onPress={() => this._toToggleFilterListView()}
        style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
        {/* <Icon name='md-menu' style={{fontSize:20,color:Colors.main_orange,marginRight:5}}/> */}
        <Text style={{color:Colors.main_orange}}>篩選分類</Text>
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
        height: 400,
        top: this.state.positionTop.interpolate({
            inputRange: [0, 1],
            outputRange: [-420, diffplatform.filterTop]
        })
      }}>
        <Dropdownfilter filterData={this.state.canteenOptions} confirmToDo={(data) => this._confirmToFilter(data)} cancleToDo={() =>this._toToggleFilterListView(0)}/>
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
            top: diffplatform.preventViewTop,
            left: 0,
            backgroundColor: '#5b7492',
            opacity: 0.3
        }}/>
    </TouchableWithoutFeedback> : null;
  }

  _renderSectionList= (data,key) =>{
    return (
        <SectionList
          ref={(sectionList) => this.sectionList = sectionList}
          // onScroll={(sview) => this._getListViewData(sview)}
          sections={[
            {title:'餐廳列表',data:this.state.canteenDetail},
          ]}
          stickySectionHeadersEnabled={true}
          renderItem={({item,index}) => this._renderSectionListItem(item,index)}
          keyExtractor={(item, index) => index} // 消除SectionList warning
          renderSectionHeader={({section}) => this._renderSubHeader()}
          refreshing={true}
          initialNumToRender={7}
          getItemLayout={(data,index) => ({length: 75, offset: 75 * index + 175, index: index})}
          // onRefresh={() => alert('onRefresh: nothing to refresh :P')}
          // onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
          onEndReachedThreshold={10}
          onEndReached={() => this._onEndReached()}
          // onEndReached={this._onEndReached.bind(this)}
          ListHeaderComponent={() => <GoodsSwiper />}
          ListEmptyComponent={() => (
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
              <Text>沒有數據了...</Text>
            </View>
          )}
          ListFooterComponent={() => (<ListFooter loadingStatus={this.state.loadingStatus.pullUpLoading} errorToDo={this._onEndReached}/>)}
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
        {this.state.loadingStatus.firstPageLoading === GLOBAL_PARAMS.httpStatus.LOADING ?
          <Loading message="玩命加載中..."/> : (this.state.loadingStatus.firstPageLoading === GLOBAL_PARAMS.httpStatus.LOAD_FAILED ?
          <ErrorPage errorTips="加載失敗,請點擊重試" errorToDo={this._onRequestFirstPageData}/> : null)}

        {this.state.showFilterList ? this._renderPreventClickView() : null}
        {this.state.canteenOptions ? this._renderFilterView() : null}
        {/* {this._renderSubHeader()} */}
        <Header style={{backgroundColor:'#fff'}}>
          <Left>
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
        <View  style={{backgroundColor:'#fff'}}>
          {this.state.canteenDetail.length > 0 ? this._renderSectionList() : null}
        </View>
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
