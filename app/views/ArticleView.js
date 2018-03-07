import React, {Component} from 'react'
import {View,Text,Image, TouchableOpacity, Platform, SectionList,StyleSheet} from 'react-native'
import {
  Container,
  Header,
  DeckSwiper,
  Card,
  Button,
  CardItem,
  Thumbnail,
  Left,
  Body,
  Icon
} from 'native-base';
//utils
import ToastUtil from '../utils/ToastUtil'
import Colors from '../utils/Colors'
import GLOBAL_PARAMS from '../utils/global_params'
//api
import api from '../api'
import source from '../api/CancelToken'
//components
import ErrorPage from '../components/ErrorPage'
import CommonHeader from '../components/CommonHeader'
import Divider from '../components/Divider'
import ListFooter from '../components/ListFooter'
import Loading from '../components/Loading'
import ArticleSwiper from '../components/Swiper'

let requestParams = {
  status: {
    LOADING: 0,
    LOAD_SUCCESS: 1,
    LOAD_FAILED: 2,
    NO_MORE_DATA: 3
  },
  nextOffset: 0,
  currentOffset: 0
}

export default class ArticleView extends Component {
  state = {
    articleList: null,
    loadingStatus:{
      firstPageLoading: GLOBAL_PARAMS.httpStatus.LOADING,
      pullUpLoading: GLOBAL_PARAMS.httpStatus.LOADING,
      refresh:false
    },
  }

  componentDidMount() {
    this._onRequestFirstPageData()
  }

  componentWillUnmount() {
    source.cancel()
  }
  //common functions

  _onRequestFirstPageData = () => {
    api.getArticleList(0).then(data => {
      // console.log(data)
      if(data.status === 200) {
        this.setState({
          articleList: data.data.data,
          loadingStatus:{
            firstPageLoading: GLOBAL_PARAMS.httpStatus.LOAD_SUCCESS
          }
        })
      }
      else{
        this.setState({
          articleList: data.data.data,
          loadingStatus:{
            firstPageLoading: GLOBAL_PARAMS.httpStatus.LOAD_FAILED
          }
        })
      }
    },() => {
      ToastUtil.show('网络请求出错',1000,'bottom','warning')
      this.setState({
        loadingStatus:{
          firstPageLoading:GLOBAL_PARAMS.httpStatus.LOAD_FAILED
        }
      })
    })
  }

  _onErrorRequestFirstPage = () => {
    this.setState({
      loadingStatus: {
        firstPageLoading: GLOBAL_PARAMS.httpStatus.LOADING
      }
    })
    this._onRequestFirstPageData()
  }

  // _onRefreshFirstPage = () => {
  //   this.setState({
  //     loadingStatus:{
  //       refresh: true
  //     }
  //   })
  //   api.getArticleList(0).then(data => {
  //     // console.log(data)
  //     if(data.status === 200) {
  //       this.setState({
  //         articleList: data.data.data,
  //         refresh: false
  //       })
  //     }
  //     else{
  //       this.setState({
  //         articleList: data.data.data,
  //         refresh:false
  //       })
  //     }
  //   },() => {
  //     ToastUtil.show('网络请求出错',1000,'bottom','warning')
  //     this.setState({
  //       loadingStatus: {
  //         refresh:false
  //       }
  //     })
  //   })
  // }

  _onRequestNextPage = (offset) => {
    api.getArticleList(offset).then(data => {
      if (data.status === 200 && data.data.ro.ok) {
        // console.log(data.data.data)
        if(data.data.data.length === 0){
          requestParams.nextOffset = requestParams.currentOffset
          this.setState({
            articleList: this.state.articleList.concat(data.data.data),
            loadingStatus: {
              pullUpLoading:GLOBAL_PARAMS.httpStatus.NO_MORE_DATA
            }
          })
          return
        }
        this.setState({
          articleList: this.state.articleList.concat(data.data.data),
          loadingStatus: {
            pullUpLoading:GLOBAL_PARAMS.httpStatus.LOADING
          }
        })
        requestParams.currentOffset = requestParams.nextOffset
      }else{
        ToastUtil.show('加載文章失敗',1000,'bottom','warning')
        requestParams.nextOffset = requestParams.currentOffset
        this.setState({
          loadingStatus: {
            pullUpLoading: GLOBAL_PARAMS.httpStatus.LOAD_FAILED
          }
        })
      }
    },() => {
      requestParams.nextOffset = requestParams.currentOffset
      this.setState({
        loadingStatus: {
          pullUpLoading: GLOBAL_PARAMS.httpStatus.LOAD_FAILED
        }
      })
    })
  }

  _onEndReach = () => {
    requestParams.nextOffset += 5
    this._onRequestNextPage(requestParams.nextOffset)
  }

  _onErrorToRequestNextPage() {
    this.setState({
      loadingStatus:{
        pullUpLoading:GLOBAL_PARAMS.httpStatus.LOADING
      }
    })
    requestParams.nextOffset += 5
    this._onRequestNextPage(requestParams.nextOffset)
  }

  _renderArticleListView = () => (
    <SectionList
      sections={[
        {title:'餐廳列表',data:this.state.articleList},
      ]}
      renderItem = {({item,index}) => this._renderArticleListItemView(item,index)}
      renderSectionHeader= {() => (<View style={{height:20}}></View>)}
      keyExtractor={(item, index) => item.title}
      onEndReachedThreshold={10}
      onEndReached={() => this._onEndReach()}
      ListHeaderComponent={() => <ArticleSwiper />}
      ListFooterComponent={() => (<ListFooter loadingStatus={this.state.loadingStatus.pullUpLoading} errorToDo={() => this._onErrorToRequestNextPage()}/>)}
    />
  )

  _renderArticleListItemView = (item,index) => (
      <TouchableOpacity style={styles.articleItemContainer}
        onPress={() => this.props.navigation.navigate('Content', {data: item,kind:'article'})}>
        <View><Image style={styles.articleImage} source={{uri:item.pic}} /></View>
        <View style={styles.articleDesc}>
          <Text style={styles.articleTitle}>{item.title}</Text>
          <Text style={styles.articleSubTitle}>{item.brief}</Text>
        </View>
        {this.state.articleList.length -1 === index ? null : <Divider height={10} bgColor="transparent"/>}
      </TouchableOpacity>
    )

  render() {
    return (<View style={{position:'relative',backgroundColor:Colors.main_white}}>
      {this.state.loadingStatus.firstPageLoading === GLOBAL_PARAMS.httpStatus.LOADING ?
        <Loading message="玩命加載中..."/> : (this.state.loadingStatus.firstPageLoading === GLOBAL_PARAMS.httpStatus.LOAD_FAILED ?
          <ErrorPage errorTips="加載失敗,請點擊重試" errorToDo={this._onErrorRequestFirstPage}/> : null)}
      <CommonHeader title="文章詳情" {...this['props']}/>
      {/* <View style={{height:150,backgroundColor:this.props.theme,width:GLOBAL_PARAMS._winWidth}} /> */}
          {
            this.state.articleList !== null
            ? this._renderArticleListView()
            : null
          }

    </View>)
  }
}

const styles = StyleSheet.create({
  articleItemContainer:{
    height:250,
    flex:1,
    borderRadius: 20,
  },
  articleImage: {
    width:GLOBAL_PARAMS._winWidth,
    height:180
  },
  articleDesc: {
    flex:1,
    justifyContent:'center',
    paddingLeft:10,
    backgroundColor: '#fff'
  },
  articleTitle: {
    fontSize:18,
    marginBottom:5
  },
  articleSubTitle: {
    fontSize:14,
    color:'#959595'
  }
})
