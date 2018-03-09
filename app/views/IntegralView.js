import React, { PureComponent } from 'react';
import {Container, Content} from 'native-base';
import { View, Text,SectionList,StyleSheet,Image } from 'react-native';
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
      renderSectionHeader= {() => (<View style={{height:20}}><Text>小積分兌換大慈善</Text></View>)}
      keyExtractor={(item, index) => index}
      // onEndReachedThreshold={10}
      // onEndReached={() => this._onEndReach()}
      ListHeaderComponent={() => this._renderProjectListHeader()}
      // ListFooterComponent={() => (<ListFooter loadingStatus={this.state.loadingStatus.pullUpLoading} errorToDo={() => this._onErrorToRequestNextPage()}/>)}
    />
  )

  _renderProjectListHeader = () => (
    <View style={styles.projectTopContainer}>
      <Image style={styles.projectTopImage} source={{uri: 'integralTopTitle'}}/>
      <View style={styles.projectTopDetails}>
        <View style={styles.projectTopDetailsInner}><Text style={styles.projectText}>我的積分:</Text></View>
        <View style={styles.projectTopDetailsInner}><Text style={styles.projectText}>{this.state.projectList.point}</Text></View>
      </View>
    </View>
  )

  _renderProjectItemView = (item,idx) => {
    return (
      <Text>123</Text>
    )
  }

  render() {
    return (
      <Container style={{backgroundColor:Colors.main_white}}>
        <CommonHeader canBack {...this['props']} title="積分禮遇" />
        <View>{this.state.projectList !== null ? this._renderProjectSectionList() : null}</View>  
      </Container>
    )
  }

}

const styles = StyleSheet.create({
  projectContainer: {
    // flex: 1,
    borderTopWidth: 1,
    borderTopColor: Colors.main_gray
  },
  projectTopContainer: {
    height:300,
    flex:1,
  },
  projectTopImage: {
    width:GLOBAL_PARAMS._winWidth,
    height:210,
    // borderTopColor: Colors.main_gray,
    // borderTopWidth: 1
  },
  projectTopDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: Colors.main_gray,
    borderBottomWidth: 1,
  },
  projectTopDetailsInner: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  projectText: {
    textAlign: 'center'
  }
})