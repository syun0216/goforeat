import React,{PureComponent} from 'react'
import {SectionList,View} from 'react-native'
import {Container,Content,ListItem,Left,Body,Right,Text,Thumbnail} from 'native-base'
//components
import CommonHeader from '../components/CommonHeader'

export default class MyFavoriteView extends PureComponent{
  componentDidMount() {
      console.log(this.props)
  }

  _renderSectionListItem = (item,index) => (
      <ListItem avatar key={index} onPress={() =>this.props.navigation.navigate('Content',{
        data:item,
        kind:'canteen'
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

  _renderSectionList = () => (
    <SectionList
      sections={[this.props.shopList]}
      stickySectionHeadersEnabled={true}
      renderItem={({item,index}) => this._renderSectionListItem(item,index)}
      keyExtractor={(item, index) => index} // 消除SectionList warning
      renderSectionHeader={({section}) => (
        <View style={{padding:10,borderBottomWidth:1,borderColor:'#ddd'}}><Text style={{fontSize:12}}>{section.title}</Text></View>
      )}
      ListEmptyComponent={() => (
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
          <Text>沒有數據了...</Text>
        </View>
      )}
    />
  )

  render() {
    return (
      <Container style={{backgroundColor:'#fff'}}>
        <CommonHeader canBack title="我的關注" {...this['props']}/>
        <View style={{flex:1}}>
          {this._renderSectionList()}
        </View>
      </Container>
    )
  }
}
