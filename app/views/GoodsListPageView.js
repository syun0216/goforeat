import React,{Component} from 'react'
import {View,SectionList,Image,StyleSheet,ScrollView} from 'react-native'
import {Container,Header,Content,List,ListItem,Left,Body,Right,Thumbnail,Button,Text} from 'native-base'
import FeatherIcon from 'react-native-vector-icons/Feather'
//api
import api from '../api'

export default class GoodsListPageView extends Component{
  state = {
    canteenDetail: []
  }
  componentDidMount() {
    api.getCanteenDetail(1).then(data => {
      if(data.status === 200 && data.data.data.length > 0) {
        // console.log(data.data.data)
        this.setState({
          canteenDetail: data.data.data
        })
      }
    })
  }

  _renderSectionList(data,key) {
    return (
        <SectionList
          sections={[
            {title:'菜單列表',data:this.state.canteenDetail},
          ]}
          stickySectionHeadersEnabled={true}
          renderItem={({item,index}) => this._renderSectionListItem(item,index)}
          keyExtractor={(item, index) => index} // 消除SectionList warning
          renderSectionHeader={({section}) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          initialNumToRender={7}
          onEndReachedThreshold={10}
          ListEmptyComponent={() => (
            <View>
              <Text>沒有數據了...</Text>
            </View>
          )}
          ListFooterComponent={() => (
            <View style={{alignSelf:'center'}}>
              <Text>正在加載中...</Text>
            </View>
          )}
        />
    )
  }

  _renderSectionListItem(item,index) {
    console.log(index)
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
          <Header style={{backgroundColor:'#fff'}}>
            <Left>
              <Image style={{width:40,height:40}} source={require('../asset/eat.png')}/>
            </Left>
            <Body>
              <Text>Goforeat</Text>
            </Body>
            <Right><FeatherIcon onPress={() => this.props.navigation.navigate('Search')} name="search" size={25} style={{color: '#f07341'}} /></Right>
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
