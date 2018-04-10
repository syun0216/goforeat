import React,{PureComponent} from 'react'
import { StyleSheet, View, Image, Animated, TouchableOpacity, Dimensions, Slider,SectionList } from 'react-native';
import Interactable from 'react-native-interactable';
//utils
import GLOBAL_PARAMS from '../utils/global_params'
import Colors from '../utils/Colors'

export default class Row extends PureComponent {
  constructor(props) {
    super(props);
    this._deltaX = new Animated.Value(0);
  }
  render() {
    return (
      <View style={{backgroundColor: '#ceced2'}}>

        <View style={{position: 'absolute', left: 0, right: 0, height: 75}} pointerEvents='box-none'>
          <Animated.View style={
            [styles.trashHolder, {
              transform: [{
                translateX: this._deltaX.interpolate({
                  inputRange: [-155, 0],
                  outputRange: [0, 155]
                })
              }]
            }
          ]}>
            <TouchableOpacity onPress={() => this.props.screenProps.deleteShop(this.props.id)} style={styles.button}>
              <Image style={styles.button} source={require('../asset/icon-trash.png')} />
            </TouchableOpacity>
          </Animated.View>

          {/* <Animated.View style={
            [styles.snoozeHolder, {
              transform: [{
                translateX: this._deltaX.interpolate({
                  inputRange: [-155, 0],
                  outputRange: [0, 78]
                })
              }]
            }
            ]}>
            <TouchableOpacity onPress={this.onButtonPress.bind(this, 'snooze')} style={styles.button}>
              <Image style={styles.button} source={require('../asset/icon-clock.png')} />
            </TouchableOpacity>
          </Animated.View> */}
        </View>

        {/* <View style={{position: 'absolute', left: 0, right: 0, height: 75}} pointerEvents='box-none'>

          <Animated.View style={
            [styles.doneHolder, {
              transform: [{
                translateX: this._deltaX.interpolate({
                  inputRange: [0, 78],
                  outputRange: [-78, 0]
                })
              }]
            }
            ]}>
            <TouchableOpacity onPress={this.onButtonPress.bind(this, 'done')} style={styles.button}>
              <Image style={styles.button} source={require('../asset/icon-check.png')} />
            </TouchableOpacity>
          </Animated.View>
        </View> */}

        <Interactable.View
          horizontalOnly={true}
          snapPoints={[
            // {x: 78, damping: 1-this.props.damping, tension: this.props.tension},
            {x: 0, damping: 1-this.props.damping, tension: this.props.tension},
            {x: -78, damping: 1-this.props.damping, tension: this.props.tension}
          ]}
          animatedValueX={this._deltaX}>
          <View style={{left: 0, right: 0, height: 75, backgroundColor: 'white'}}>
            {this.props.children}
          </View>
        </Interactable.View>

      </View>
    );
  }
  onButtonPress(name) {
    alert(`Button ${name} pressed`);
  }
}

const styles = StyleSheet.create({
  trashHolder: {
    position: 'absolute',
    top: 0,
    left: GLOBAL_PARAMS._winWidth - 155,
    width: GLOBAL_PARAMS._winWidth,
    height: 75,
    paddingLeft: 18,
    backgroundColor: Colors.main_red,
    justifyContent: 'center',
  },
  snoozeHolder: {
    position: 'absolute',
    top: 0,
    left: GLOBAL_PARAMS._winWidth - 78,
    width: GLOBAL_PARAMS._winWidth,
    height: 75,
    paddingLeft: 18,
    backgroundColor: '#4f7db0',
    justifyContent: 'center'
  },
  doneHolder: {
    position: 'absolute',
    top: 0,
    right: GLOBAL_PARAMS._winWidth - 78,
    width: GLOBAL_PARAMS._winWidth,
    height: 75,
    paddingRight: 18,
    backgroundColor: '#2f9a5d',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  button: {
    width: 40,
    height: 40
  },
})
