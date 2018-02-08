import React, {Component} from 'react'
import {View,Text,Image, TouchableOpacity, Platform, FlatList,StyleSheet} from 'react-native'
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
//components
import ErrorPage from '../components/ErrorPage'
import CommonHeader from '../components/CommonHeader'

export default class ArticleView extends Component {
  state = {
    articleList: null
  }

  componentDidMount() {
    this._getArticleData()
  }

  _getArticleData = () => {
    api.getArticleList().then(data => {
      if (data.status === 200 && data.data.ro.ok) {
        console.log(data.data.data)
        this.setState({articleList: data.data.data})
      }
    })
  }

  _renderArticleListView = () => (
    <FlatList
      data = {this.state.articleList}
      renderItem = {({item}) => this._renderArticleListItemView(item)}
      keyExtractor={(item, index) => item.title}
    />
  )

  _renderArticleListItemView = (item) => (
    <TouchableOpacity style={styles.articleItemContainer}
      onPress={() => this.props.navigation.navigate('Content', {data: item,kind:'article'})}>
        <View><Image style={styles.articleImage} source={{uri:item.pic}} /></View>
        <View style={styles.articleDesc}>
          <Text style={styles.articleTitle}>{item.title}</Text>
          <Text style={styles.articleSubTitle}>{item.brief}</Text>
        </View>
    </TouchableOpacity>
    )

  render() {
    return (<Container>
      <CommonHeader title="文章詳情"/>
      {
        this.state.articleList !== null
          ? this._renderArticleListView()
          : <ErrorPage errorTips="沒有數據哦,請點擊重試" errorToDo={() => {
                this.getArticleList()
              }}/>
      }
    </Container>)
  }
}

const styles = StyleSheet.create({
  articleItemContainer:{
    marginBottom: 15,
    height:250,
    flex:1,
    backgroundColor:'#fff'
  },
  articleImage: {
    width:GLOBAL_PARAMS._winWidth,
    height:190
  },
  articleDesc: {
    flex:1,
    justifyContent:'center',
    paddingLeft:10
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
