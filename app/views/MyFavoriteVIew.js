import React, { PureComponent } from 'react';
import { StyleSheet, View, Image, Animated, TouchableOpacity, Dimensions, Slider,SectionList } from 'react-native';
import {Container,Content,ListItem,Left,Body,Right,Text,Thumbnail} from 'native-base'
//components
import CommonHeader from '../components/CommonHeader'
import Row from '../components/Row'
//utils
import GLOBAL_PARAMS from '../utils/global_params'

const Screen = Dimensions.get('window');

export default class MyFavoriteView extends PureComponent {
  state = {
      damping: 1-0.7,
      tension: 300
  }

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

    _renderSectionListItem = (item,index) => (

        <Row damping={this.state.damping} tension={this.state.tension} id={item.id} {...this['props']}>
          <TouchableOpacity style={styles.rowContent} onPress={() =>this.props.navigation.navigate('Content',{
            data:item,
            kind:'canteen'
          })}>
            <Image style={styles.rowIcon} source={{uri:item.image}}/>
            <View>
              <Text style={styles.rowTitle}>{item.name}</Text>
              <Text style={styles.rowSubtitle}>{item.address}</Text>
            </View>
          </TouchableOpacity>
        </Row>
    )

  render() {
    return (
      <Container>
        <CommonHeader canBack title="我的關注" {...this['props']}/>
        {this._renderSectionList()}
        {/* <View style={styles.playground}>
          <Text style={styles.playgroundLabel}>Change spring damping:</Text>
          <Slider
            key='damping'
            style={styles.slider}
            value={this.state.damping}
            minimumValue={0.1}
            maximumValue={0.6}
            minimumTrackTintColor={'#007AFF'}
            maximumTrackTintColor={'white'}
            thumbTintColor={'white'}
            onSlidingComplete={(value) => this.setState({damping: value})}
          />
          <Text style={styles.playgroundLabel}>Change spring tension:</Text>
          <Slider
            key='tension'
            style={styles.slider}
            value={this.state.tension}
            minimumValue={0.0}
            maximumValue={1000.0}
            minimumTrackTintColor={'#007AFF'}
            maximumTrackTintColor={'white'}
            thumbTintColor={'white'}
            onSlidingComplete={(value) => this.setState({tension: value})}
          />
        </View> */}

      </Container>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  rowContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eeeeee'
  },
  rowIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#73d4e3',
    margin: 20
  },
  rowTitle: {
    fontWeight: 'bold',
    fontSize: 20
  },
  rowSubtitle: {
    fontSize: 18,
    color: 'gray'
  },
  playground: {
    marginTop: GLOBAL_PARAMS._winHeight <= 500 ? 0 : 80,
    padding: 20,
    width: GLOBAL_PARAMS._winWidth - 40,
    backgroundColor: '#5894f3',
    alignItems: 'stretch',
    alignSelf: 'center'
  },
  playgroundLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15
  },
  slider: {
    height: 40
  }
});
