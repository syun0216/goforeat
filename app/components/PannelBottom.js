import React, { Component } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import Antd from "react-native-vector-icons/AntDesign";
import {isNil} from 'lodash';
//component
import Text from '../components/UnScalingText';
//utils
import GLOBAL_PARAMS, {em} from '../utils/global_params';

const pannelStyle = {
  pannelContainer: {
    width: GLOBAL_PARAMS._winWidth,
    height: GLOBAL_PARAMS._winHeight * 0.7,
    backgroundColor: '#fff',
    padding: em(10),
  },
  topTitle: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: em(50),
  },
  topTitleText: {
    fontSize: em(18),
    fontWeight: 'bold',
  },
  downIconBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex:10
  },
  downIcon: {
    color: '#666',
    fontSize: em(25)
  }
};

export default class PannelBottom extends Component {

  state = {
    visibleModal: null
  }

  handleOnScroll = event => {
    this.setState({
      scrollOffset: event.nativeEvent.contentOffset.y,
    });
  };

  handleScrollTo = p => {
    if (this.scrollViewRef) {
      this.scrollViewRef.scrollTo(p);
    }
  };

  toggleVisible = () => {
    const {visibleModal} = this.state;
    this.setState({
      visibleModal: isNil(visibleModal) ? 'scrollable' : null
    })
  }

  render() {
    return(
      <Modal
      style={{backgroundColor: '#fff',height: this.props.height}}
      isVisible={this.state.visibleModal === 'scrollable'}
      onSwipeComplete={() => this.toggleVisible()}
      swipeDirection="down"
      // scrollTo={this.handleScrollTo}
      // scrollOffset={this.state.scrollOffset}
      onBackButtonPress={() => this.toggleVisible()}
      onBackdropPress={() => this.toggleVisible()}
      // scrollOffsetMax={400 - 300} // content height - ScrollView height
      style={{justifyContent: 'flex-end',
      margin: 0,}}
    >
      <View style={pannelStyle.pannelContainer}>
        <View style={pannelStyle.topTitle}>
          <Text style={pannelStyle.topTitleText}>{this.props.title}</Text>
          <TouchableOpacity onPress={() => this.toggleVisible()} style={pannelStyle.downIconBtn}>
            <Antd style={pannelStyle.downIcon} name="closecircleo"/>
          </TouchableOpacity>
        </View>
        <ScrollView 
          // ref={ref => (this.scrollViewRef = ref)}
          // onScroll={this.handleOnScroll}
          // scrollEventThrottle={16}
        >
          {this.props.children}
        </ScrollView>
      </View>
    </Modal>
    )
  }
}

PannelBottom.propsTypes = {
  height: PropTypes.number,
  title: PropTypes.string
};

PannelBottom.defaultProps = {
  height: GLOBAL_PARAMS._winHeight*0.5,
  title: '用戶評論'
};