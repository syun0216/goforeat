import React,{PureComponent} from 'react'
import {View,Image} from 'react-native'

export default class RegisterView extends PureComponent {
  render() {
    return (
      <View>
        <Image source={{uri:'loginbg'}} style={{width:100,height:100}}/>
      </View>
    )
  }
}
