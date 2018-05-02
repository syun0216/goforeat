import React, {Component} from 'react'
import {View,Text, TouchableOpacity,TouchableWithoutFeedback, Platform, SectionList,StyleSheet} from 'react-native'
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
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
//utils
import ToastUtil from '../utils/ToastUtil';
import Colors from '../utils/Colors';
import GLOBAL_PARAMS from '../utils/global_params';
//api
import api from '../api';
import source from '../api/CancelToken';
//components
import ErrorPage from '../components/ErrorPage';
import CommonHeader from '../components/CommonHeader';
import Divider from '../components/Divider';
import ListFooter from '../components/ListFooter';
import Loading from '../components/Loading';
//language
import i18n from '../language/i18n';

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
    i18n: i18n[this.props.screenProps.language]
  }

  componentDidMount() {
    this._onRequestFirstPageData()
  }

  componentWillUnmount() {
    source.cancel()
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      i18n: i18n[nextProps.screenProps.language]
    })
  }
  //common functions

  _onRequestFirstPageData = () => {
    api.getArticleList(0).then(data => {
      // console.log(data)
      if(data.status === 200) {
        data.data.data = data.data.data.map((v,i) => ({
          ...v,
          date_title: v.title.split(' ')[0],
          food_title: v.title.split(' ')[1]
        }))

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
      ToastUtil.showWithMessage('网络请求出错')
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
        data.data.data = data.data.data.map((v,i) => ({
          ...v,
          date_title: v.title.split(' ')[0],
          food_title: v.title.split(' ')[1]
        }))

        this.setState({
          articleList: this.state.articleList.concat(data.data.data),
          loadingStatus: {
            pullUpLoading:GLOBAL_PARAMS.httpStatus.LOADING
          }
        })
        requestParams.currentOffset = requestParams.nextOffset
      }else{
        ToastUtil.showWithMessage('加載文章失敗')
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
      // renderSectionHeader= {() => (<View style={{height:20}}></View>)}
      keyExtractor={(item, index) => index}
      onEndReachedThreshold={0.01}
      onEndReached={() => this._onEndReach()}
      // ListHeaderComponent={() => <ArticleSwiper />}
      ListFooterComponent={() => (<ListFooter loadingStatus={this.state.loadingStatus.pullUpLoading} errorToDo={() => this._onErrorToRequestNextPage()}/>)}
    />
  )

  _renderArticleListItemView = (item,index) => (
      <TouchableWithoutFeedback style={styles.articleItemContainer}
        onPress={() => this.props.navigation.navigate('Content', {data: item,kind:'article'})}>
        <View style={styles.artivleItemInnerContainer}>
          <View><Image style={styles.articleImage} source={{uri:item.pic}} 
          indicator={ProgressBar}
          indicatorProps={{color:this.props.screenProps.theme}}/></View>
          <View style={styles.articleDesc}>
            <Text style={styles.articleTitle}>{item.date_title}{'\n'}{item.food_title}</Text>
          </View>
          <Divider height={10} bgColor="transparent" />
        </View>
      </TouchableWithoutFeedback>
    )

  render() {
    return (<Container style={{position:'relative'}}>
    <CommonHeader title={this.state.i18n.article_title} {...this['props']}/>
    {this.state.loadingStatus.firstPageLoading === GLOBAL_PARAMS.httpStatus.LOADING ?
      <Loading message="玩命加載中..."/> : (this.state.loadingStatus.firstPageLoading === GLOBAL_PARAMS.httpStatus.LOAD_FAILED ?
        <ErrorPage errorTips="加載失敗,請點擊重試" errorToDo={this._onErrorRequestFirstPage}/> : null)}
      {/* <View style={{height:150,backgroundColor:this.props.theme,width:GLOBAL_PARAMS._winWidth}} /> */}
      <View style={{marginBottom:GLOBAL_PARAMS.bottomDistance}}>
        {
            this.state.articleList !== null
            ? this._renderArticleListView()
            : null
        }
      </View>    

    </Container>)
    }
  }

const styles = StyleSheet.create({
  articleItemContainer:{
    height:250,
    flex:1,
    borderRadius: 20,
  },
  artivleItemInnerContainer: {
    borderRadius: 20,
    flex:1,
    // paddingTop:10,
    // paddingBottom: 0,
  },
  articleImage: {
    width:GLOBAL_PARAMS._winWidth,
    height:180
  },
  articleDesc: {
    flex:1,
    justifyContent:'center',
    alignItems: 'center',
    paddingLeft:10,
    backgroundColor: '#fff',
    paddingTop:10,
    paddingBottom:10
  },
  articleTitle: {
    fontSize:18,
    marginBottom:5,
    textAlign:'center'
  },
  articleSubTitle: {
    fontSize:14,
    color:'#959595'
  }
})
