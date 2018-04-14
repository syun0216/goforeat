import React, {PureComponent} from 'react';
import {View, Text, Image,Animated,TouchableOpacity,Platform} from 'react-native';
import {Button,Icon} from 'native-base';
//utils
import Colors from '../utils/Colors';

export default class ScrollTop extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Animated.View style={{
                backgroundColor:Colors.main_white,
                position:'absolute',
                right:18,
                borderRadius: Platform.OS === 'android'?40:50,
                padding:0,
                height:Platform.OS === 'android' ? 38: 30,
                backgroundColor:Colors.main_white,
                bottom:this.props.positionBottom.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-150, 50]
                })}} >
                <TouchableOpacity style={{marginTop: Platform.OS === 'android' ? 0 : -5}} onPress={this.props.toTop}>
                    <Icon name="ios-arrow-dropup-circle-outline"
                    style={{fontSize: 40,color:this.props.color}}/>
                </TouchableOpacity>
            </Animated.View>
        )
    }
}