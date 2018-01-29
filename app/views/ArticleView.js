import React,{Component} from 'react'
import { Image } from 'react-native'
import { Container, Header, View, DeckSwiper, Card,Button, CardItem, Thumbnail, Text, Left, Body, Icon } from 'native-base';

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
  render() {
    return (
      <Container>
         <Header>
           <Body><Text>文章详情</Text></Body>
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
               <Card style={{ elevation: 3 }}>
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
                   <Image style={{ height: 300, flex: 1 }} source={item.image} />
                 </CardItem>
                 <CardItem>
                   <Icon name="heart" style={{ color: '#ED4A6A' }} />
                   <Text>{item.name}</Text>
                 </CardItem>
               </Card>
             }
           />
         </View>
         <View style={{ flexDirection: "row", flex: 1, position: "absolute", bottom: 50, left: 0, right: 0, justifyContent: 'space-between', padding: 15 }}>
          <Button transparent iconLeft onPress={() => this._deckSwiper._root.swipeLeft()}>
            <Icon name="arrow-back" />
            <Text>Swipe Left</Text>
          </Button>
          <Button transparent iconRight onPress={() => this._deckSwiper._root.swipeRight()}>
            <Text>Swipe Right</Text>
            <Icon name="arrow-forward" />
          </Button>
        </View>
       </Container>
    )
  }
}
