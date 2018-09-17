import React, {Component} from 'react'
import {View,TouchableWithoutFeedback, SectionList,StyleSheet,RefreshControl} from 'react-native'
import {
  Container,
  Card,
  CardItem,
} from 'native-base';
import Image from 'react-native-image-progress';
//utils
import ToastUtil from '../utils/ToastUtil';
import Colors from '../utils/Colors';
import GLOBAL_PARAMS, { em } from '../utils/global_params';
//api
import {getArticleList,getNewArticleList} from '../api/request';
import source from '../api/CancelToken';
//components
import ErrorPage from '../components/ErrorPage';
import CommonHeader from '../components/CommonHeader';
import ListFooter from '../components/ListFooter';
import Loading from '../components/Loading';
import Text from '../components/UnScalingText';
//language
import I18n from '../language/i18n';

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
  static navigationOptions = ({screenProps}) => ({
    tabBarLabel: I18n[screenProps.language].weekMenu
  });
  state = {
    articleList: null,
    loadingStatus:{
      firstPageLoading: GLOBAL_PARAMS.httpStatus.LOADING,
      pullUpLoading: GLOBAL_PARAMS.httpStatus.LOADING,
    },
    refreshing: false,
    i18n: I18n[this.props.screenProps.language]
  }

  componentDidMount() {
    this._onRequestFirstPageData()
  }

  componentWillReceiveProps(nextProps) {
    this._onRequestFirstPageData();
  }

  componentWillUnmount() {
    source.cancel()
  }
  
  //common functions

  _onRequestFirstPageData = () => {
    let { place: {id} } = this.props.screenProps;
    getNewArticleList(0, id).then(data => {
      this.setState({
        refreshing: false
      })
      if(data.ro.respCode == '0000') {
        console.log(data);
        // data.data = data.data.map((v,i) => ({
        //   ...v,
        //   date_title: v.title.split(' ')[0],
        //   food_title: v.title.split(' ')[1]
        // }))

        this.setState({
          articleList: data.data.list,
          loadingStatus:{
            firstPageLoading: GLOBAL_PARAMS.httpStatus.LOAD_SUCCESS
          }
        })
      }
      else{
        this.setState({
          articleList: data.data.list,
          refreshing: false,
          loadingStatus:{
            firstPageLoading: GLOBAL_PARAMS.httpStatus.LOAD_FAILED
          }
        })
      }
    },() => {
      ToastUtil.showWithMessage(this.state.i18n.common_tips.network_err);
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

  _onRequestNextPage = (offset) => {
    if(this.state.loadingStatus.pullUpLoading == GLOBAL_PARAMS.httpStatus.NO_MORE_DATA) {
      return;
    }
    let { place: {id} } = this.props.screenProps;
    getNewArticleList(offset, id).then(data => {
      console.log(9999,data);
      if (data.ro.respCode == '0000') {
        if(data.data.list.length === 0){
          requestParams.nextOffset = requestParams.currentOffset
          this.setState({
            articleList: this.state.articleList.concat(data.data.list),
            loadingStatus: {
              pullUpLoading:GLOBAL_PARAMS.httpStatus.NO_MORE_DATA
            }
          })
          return
        }
        // data.data = data.data.map((v,i) => ({
        //   ...v,
        //   date_title: v.title.split(' ')[0],
        //   food_title: v.title.split(' ')[1]
        // }))
  
        this.setState({
          articleList: this.state.articleList.concat(data.data.list),
          loadingStatus: {
            pullUpLoading:GLOBAL_PARAMS.httpStatus.LOADING
          }
        })
        requestParams.currentOffset = requestParams.nextOffset
      }else{
        ToastUtil.showWithMessage(this.state.i18n.article_tips.fail.load)
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

  _onRefreshToRequestFirstPageData() {
    this.setState({
      refreshing: true
    });
    requestParams.currentOffset = 1;
    this._onRequestFirstPageData();
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
      ListFooterComponent={() => (<ListFooter loadingStatus={this.state.loadingStatus.pullUpLoading} errorToDo={() => this._onErrorToRequestNextPage()} {...this.props}/>)}
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={() => this._onRefreshToRequestFirstPageData()}
        />
      }
    />
  )

  _renderArticleListItemView = (item,index) => {
    if(typeof item === 'undefined') return;
    // console.log(123,item);
    return (
      <View style={styles.articleItemContainer}
        onPress={() => this.props.navigation.navigate('Content', {data: item,kind:'article'})}>
        <Image source={{uri: item.thumbnail}} style={{width: em(124),height: em(150)}} resizeMode="cover"/>
        <View style={styles.articleItemDetails}>
          <View style={[styles.itemName, styles.marginBottom9]}>
            <Text style={styles.foodName}>{item.name}</Text>
            <Text style={styles.foodTime}>{item.date}</Text>
          </View>
          <View style={{height: em(45),marginBottom: 12.5}}>
            <Text style={styles.foodBrief} numberOfLines={5}>{item.brief}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.foodUnit}>HKD</Text>
            <Text style={styles.foodPrice}>{item.price}</Text>
          </View>
        </View>
      </View>
    )}

  render() {
    let {i18n} = this.state;
    return (
    <Container style={{position:'relative'}}>
      <CommonHeader hasMenu headerHeight={em(76)} title={i18n.weekMenu} {...this.props}/>
      {this.state.loadingStatus.firstPageLoading === GLOBAL_PARAMS.httpStatus.LOADING ?
        <Loading/> : (this.state.loadingStatus.firstPageLoading === GLOBAL_PARAMS.httpStatus.LOAD_FAILED ?
          <ErrorPage errorTips={i18n.common_tips.network_err} errorToDo={this._onErrorRequestFirstPage} {...this.props}/> : null)}
        <View style={{marginBottom:GLOBAL_PARAMS.isIphoneX() ? GLOBAL_PARAMS.bottomDistance + GLOBAL_PARAMS.iPhoneXBottom : GLOBAL_PARAMS.bottomDistance,marginTop:-em(75)}}>
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
    height:150,
    flex:1,
    borderRadius: 8,
    margin: 10,
    borderRadius :5,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ededeb',
    shadowColor: '#ededeb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden'
  },
  articleItemDetails: {
    padding: 17,
    flex: 1,
    backgroundColor: '#fff',
    
  },
  itemName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  foodName: {
    fontSize: em(18),
    color: '#111',
    fontWeight: '800',
  },
  foodTime: {
    fontSize: em(13),
    color: '#666',
  },
  foodBrief: {
    fontSize: em(11),
    color: '#111',
    textAlign: 'justify'
  },
  foodUnit: {
    fontSize: em(14),
    color: '#666',
    marginRight: em(5)
  },
  foodPrice: {
    fontSize: em(18),
    color: '#2a2a2a',
    lineHeight: em(18)
  },
  marginBottom9: {
    marginBottom: em(10),
  }
})
