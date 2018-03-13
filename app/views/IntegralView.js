import React, { PureComponent } from 'react';
import {Container, Content,Button} from 'native-base';
import { View, Text,SectionList,StyleSheet,TouchableOpacity } from 'react-native';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar'
// components
import CommonHeader from '../components/CommonHeader';
// api
import api from '../api';
//utils
import GLOBAL_PARAMS from '../utils/global_params';
import Colors from '../utils/Colors';

export default class IntegralView extends PureComponent {
  state = {
    projectList: null
  }

  componentDidMount() {
    this._getProjectList();
  }

  _getProjectList() {
    api.getIntegralProjectListData().then(data => {
      if(data.status === 200 && data.data.ro.ok) {
        this.setState({
          projectList: data.data.data
        })
      }
    });
  }

  //views
  _renderProjectSectionList = () => (
    <SectionList
      style={styles.projectContainer}
      sections={[
        {title:'小積分兌換大慈善',data:this.state.projectList.list},
      ]}
      renderItem = {({item,index}) => this._renderProjectItemView(item,index)}
      renderSectionHeader= {() => (
        <View style={{height:50,backgroundColor: Colors.main_white,paddingLeft:10,
          justifyContent:'center'}}>
          <Text>小積分兌換大慈善</Text>
        </View>
      )}
      keyExtractor={(item, index) => index}
      // onEndReachedThreshold={10}
      // onEndReached={() => this._onEndReach()}
      ListHeaderComponent={() => this._renderProjectListHeader()}
      // ListFooterComponent={() => (<ListFooter loadingStatus={this.state.loadingStatus.pullUpLoading} errorToDo={() => this._onErrorToRequestNextPage()}/>)}
    />
  )

  _renderProjectListHeader = () => (
    <View style={styles.projectTopContainer}>
      <Image style={styles.projectTopImage} source={{uri: 'integralTopTitle'}} resizeMode="contain"/>
      <View style={styles.projectTopDetails}>
        <View style={[styles.projectTopDetailsInner]}>
        <Text style={styles.projectText}>我的積分:</Text></View>
        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
          <Image source={{uri:'integral'}} style={styles.projectIntegralIcon}/>
          <Text style={styles.projectText}>
            {this.state.projectList.point}
          </Text>
        </View>
      </View>
    </View>
  )

  _renderProjectItemView = (item,idx) => {
    return (
      <View style={{height:300,flex:1,
        borderTopWidth:1,
        borderColor:Colors.main_gray,marginBottom:10,backgroundColor:Colors.main_white}}>
        <Image source={{uri:item.image}} style={{width:GLOBAL_PARAMS._winWidth,height:190,}} indicator={ProgressBar} indicatorProps={{color:this.props.screenProps.theme}}/>
        <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',borderBottomWidth:1,borderBottomColor:Colors.main_gray}}>
          <Text style={{marginLeft:10}}>{item.title}</Text>
          <Text style={{marginRight:10}}>限量{item.currentPoint}件</Text>
        </View>
        <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',borderBottomWidth:1,borderBottomColor:Colors.main_gray}}>
          <Text style={{marginLeft:10}}>{item.requirePoint}-{item.leastPoint}積分</Text>
          <View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('IntegralDetail',{data:item})}
              style={{backgroundColor: this.props.screenProps.theme,marginRight:10,borderRadius:20,width:120,padding:10,paddingLeft:20,paddingRight:20}}>
              <Text style={{color: Colors.main_white,textAlign:'center'}}>立即兌換</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  render() {
    return (
      <Container>
        <CommonHeader canBack {...this['props']} title="積分禮遇" />
        <Content>
          <View>{this.state.projectList !== null ? this._renderProjectSectionList() : null}</View>  
        </Content>
      </Container>
    )
  }

}

const styles = StyleSheet.create({
  projectContainer: {
    // flex: 1,
    // borderTopWidth: 1,
    // borderTopColor: Colors.main_gray
  },
  projectTopContainer: {
    height:200,
    flex:1,
  },
  projectTopImage: {
    width:GLOBAL_PARAMS._winWidth,
    height:150,
    // borderTopColor: Colors.main_gray,
    // borderTopWidth: 1
  },
  projectTopDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: Colors.main_gray,
    borderBottomWidth: 1,
    backgroundColor: Colors.main_white
  },
  projectTopDetailsInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft:10,
    marginRight:10
  },
  projectIntegralIcon: {
    width:20,
    height:20,
    marginRight: 5,
  },
  projectText: {
    // marginLeft:10,
    marginRight:10
    // textAlign: 'center'
  }
})