import React, { PureComponent } from 'react';
import { StyleSheet, View, Image, Animated, TouchableOpacity, Dimensions, Slider,SectionList } from 'react-native';
import {Container,Content,ListItem,Left,Body,Right,Text,Thumbnail} from 'native-base'
//components
import CommonHeader from '../components/CommonHeader'
import Row from '../components/Row'
//utils
import GLOBAL_PARAMS from '../utils/global_params'
import Colors from '../utils/Colors'
//language
import i18n from '../language/i18n';

const Screen = Dimensions.get('window');

export default class MyFavoriteView extends PureComponent {
  state = {
      damping: 1-0.7,
      tension: 300,
      i18n: i18n[this.props.screenProps.language]
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      i18n: i18n[nextProps.screenProps.language]
    })
  }
    _renderSectionList = () => (
      <SectionList
        sections={[this.props.screenProps.shopList]}
        stickySectionHeadersEnabled={true}
        renderItem={({item,index}) => this._renderSectionListItem(item,index)}
        keyExtractor={(item, index) => index} // 消除SectionList warning
        renderSectionHeader={({section}) => (
          <View style={{padding:10,borderBottomWidth:1,borderColor:'#ddd',backgroundColor:Colors.main_white}}><Text style={{fontSize:12}}>{section.title}</Text></View>
        )}
        ListEmptyComponent={() => (
          <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            <Text>{this.state.nodata_text}</Text>
          </View>
        )}
      />
    )

    _renderSectionListItem = (item,index) => {
      // console.log()
      return (
        <Row damping={this.state.damping} tension={this.state.tension} id={item.id} {...this['props']}>
          <TouchableOpacity style={styles.rowContent} onPress={() =>this.props.navigation.navigate('Content',{
            data:item,
            kind:'canteen'
          })}>
            <Image style={styles.rowIcon} source={{uri:item.image}}/>
            <View>
              <Text style={styles.rowTitle}>{item.name}</Text>
              <Text style={styles.rowSubtitle}>{item.address.length > 15 ? `${item.address.substr(0,15)}...` : item.address }</Text>
            </View>
          </TouchableOpacity>
        </Row>
    )
}
  render() {
    return (
      <Container>
        <CommonHeader canBack title={this.state.i18n.myfavorite_text} {...this['props']}/>
        {this._renderSectionList()}
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
