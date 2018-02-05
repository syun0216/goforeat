import React,{Component} from 'react'
import { Image,TouchableOpacity,Platform } from 'react-native'
import { Container, Header, View, DeckSwiper, Card,Button, CardItem, Thumbnail, Text, Left, Body, Icon } from 'native-base';
import Colors from '../utils/Colors'
//api
import api from '../api'
const cards = [
  {
    text:'Card One',
    name:'One',
    image:require('../asset/01.png')
  },
  {
    text:'Card Two',
    name:'Two',
    image:require('../asset/02.png')
  },
  {
    text:'Card Third',
    name:'Third',
    image:require('../asset/03.png')
  }
]

export default class ArticleView extends Component{
  ComponentDidMount() {
    api.getArticleList().then(data => {
      console.log(data)
    })
  }
  render() {
    return (
      <Container>
         <Header style={{backgroundColor: '#fff'}}>
           <Body><Text>文章詳情</Text></Body>
         </Header>
           <View>
             <DeckSwiper
               ref={(c) => this._deckSwiper = c}
               dataSource={cards}
               renderEmpty={() => (
                 <View style={{ alignSelf: "center" }}>
                   <Text>沒有更多了</Text>
                 </View>
               )}
               renderItem={item =>
                 <Card style={{ elevation: 3 }} >
                   <CardItem>
                     <Left>
                       <Thumbnail source={item.image} />
                       <Body>
                         <Text>{item.text}</Text>
                         <Text note>NativeBase</Text>
                       </Body>
                     </Left>
                   </CardItem>
                   <CardItem cardBody>
                     <Image style={[{ flex: 1 },Platform.OS === 'ios' ? {height:300} : {height:200}]} source={item.image} />
                   </CardItem>
                   <CardItem>
                     <Icon name="heart" style={{ color: '#ED4A6A' }} />
                     <Text>{item.name}</Text>
                   </CardItem>
                 </Card>
               }
             />
           </View>
         <View style={{ flexDirection: "row", flex: 1, position: "absolute", bottom: 30, left: 0, right: 0, justifyContent: 'space-between', padding: 15 }}>
          <Button transparent iconLeft onPress={() => this._deckSwiper._root.swipeLeft()}>
            <Icon style={{color:Colors.main_orange}} name="arrow-back" />
            <Text style={{color:Colors.main_orange}}>上一篇</Text>
          </Button>
          <Button transparent onPress={() => this.props.navigation.navigate('Content',{data:this._deckSwiper._root.state.selectedItem})}>
            <Text style={{color:Colors.main_orange}}>點擊查看詳情</Text>
          </Button>
          <Button transparent iconRight onPress={() => this._deckSwiper._root.swipeRight()}>
            <Text style={{color:Colors.main_orange}}>下一篇</Text>
            <Icon style={{color:Colors.main_orange}} name="arrow-forward" />
          </Button>
        </View>
       </Container>
    )
  }
}
