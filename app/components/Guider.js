import React, { Component } from 'react';
import {StyleSheet, Text, Image, View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import {isNil} from 'lodash';
//utils
import GLOBAL_PARAMS, { em } from '../utils/global_params';
//cache
import { guideStorage } from '../cache/appStorage';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: GLOBAL_PARAMS._winWidth,
    height: GLOBAL_PARAMS._winHeight,
    zIndex: 100,
    top: 0,

  },
  tipsImg: {
    width: GLOBAL_PARAMS._winWidth - em(30),
    alignSelf: 'center',
  },
  tipsArrow: {
    width: em(20),
    position: 'absolute',
    top: 0,
    right: em(50)
  },
  tipsArrowBottom: {
    width: em(20),
    position: 'absolute',
    transform: [{rotate: '180deg'}],
    left: em(50),
    bottom: 0
  },
  content: {
    position: 'absolute',
    alignItems: 'center',
    width: GLOBAL_PARAMS._winWidth,
  },
  bottomBtn: {
    width: em(140),
    height: em(50),
    borderRadius: em(25),
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomText: {
    color: '#fff',
    fontSize: em(16)
  }
});

const guiderData = {
  foodList: [
    {img: require('../asset/1.3.7/text_1.png'), style: {top: em(20)},start: {x: 0.0, y: 0.0},end: {x: 0.0, y: 1.0},locations: [0, 0.1], colors: ["transparent", "#000"], type: 'top'},
    {img: require('../asset/1.3.7/text_2.png'), style: {top: em(350)},start: {x: 0.0, y: 0.0},end: {x: 0.0, y: 1.0},locations: [0, 0.8], colors: ["transparent", "#000"], type: 'top'},
  ],
  foodDetails: [
    {img: require('../asset/1.3.7/text_3.png'),  style: {top: em(220)},start: {x: 0.0, y: 0.0},end: {x: 0.0, y: 1.0},locations: [0.6, 0.67], colors: ["#000", "transparent"], type: 'bottom'}
  ],
  confirmOrder: [
    {img: require('../asset/1.3.7/text_4.png'),  style: {bottom: em(60)},start: {x: 0.0, y: 0.0},end: {x: 0.0, y: 1.0},locations: [0.85, 0.9], colors: ["#000", "transparent"], type: 'bottom'}
  ]
};

export default class Guider extends Component {
  static defaultProps = {
    pageName: 'foodList'
  } 

  constructor(props) {
    super(props);
    this.stepCount = 0; // 進行到第幾步
    this.cacheTips = {}; // tips緩存
    this.state = {
      step: guiderData[props.pageName][0],
      bottomBtnText: '下一步',
      isTipsShow: false
    }
  }

  componentDidMount = () => {
    guideStorage.getData((error, data) => {
      if(error == null && data != null) {
        this.cacheTips = data;
        console.log(12345, data);
        console.log(12345, isNil(this.cacheTips) || isNil(this.cacheTips[this.props.pageName]));
        console.log(12345, this.props.pageName);
        this.setState({
          isTipsShow: isNil(this.cacheTips) || isNil(this.cacheTips[this.props.pageName]),
          step: guiderData[this.props.pageName][0],
          bottomBtnText: this.stepCount == (guiderData[this.props.pageName].length -1) ? '關閉' : '下一步'
        })
      }else {
        this.setState({
          isTipsShow: true
        })
      }
    });
  };
  
  

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }

  _nextStep() {
    if(this.stepCount == guiderData[this.props.pageName].length - 1) {
      this.setState({ // 看完則關閉
        isTipsShow: false
      }, () => {
        console.log('this.cacheTips :', this.cacheTips);
        this.cacheTips[this.props.pageName] = true;
        guideStorage.setData(this.cacheTips);
      });
      return;
    };
    this.stepCount ++;
    this.setState({
      step: guiderData[this.props.pageName][this.stepCount],
      bottomBtnText: this.stepCount == (guiderData[this.props.pageName].length -1) ? '關閉' : '下一步'
    })
  }
  

  render() {
    const {step, bottomBtnText, isTipsShow} = this.state;
    const Linear = (
      <LinearGradient 
        colors={step.colors}
        locations={step.locations}
        start={step.start}
        end={step.end}
        style={styles.container}
      >
        {
          step.type == 'top' ? (
            <View style={[styles.content, step.style]}>
              <Image source={require('../asset/1.3.7/pic_jiantou.png')} style={styles.tipsArrow} resizeMode="contain"/>
              <Image source={step.img} resizeMode="contain" style={styles.tipsImg}/>
              <TouchableOpacity style={styles.bottomBtn} onPress={() => this._nextStep()}>
                <Text style={styles.bottomText}>{bottomBtnText}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.content, step.style]}>
              <TouchableOpacity style={styles.bottomBtn} onPress={() => this._nextStep()}>
                <Text style={styles.bottomText}>{bottomBtnText}</Text>
              </TouchableOpacity>
              <Image source={step.img} resizeMode="contain" style={styles.tipsImg}/>
              <Image source={require('../asset/1.3.7/pic_jiantou.png')} style={styles.tipsArrowBottom} resizeMode="contain"/>              
            </View>
          )
        }
      </LinearGradient>
    );
    return isTipsShow ? Linear : null
  }
}