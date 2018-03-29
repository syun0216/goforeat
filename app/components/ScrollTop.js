import React, {PureComponent} from 'react';
import {View, Text, Image,Animated} from 'react-native';
import {Button,Icon} from 'native-base';

export default class ScrollTop extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Animated.View style={{position:'absolute',right:10,bottom:this.props.positionBottom.interpolate({
                inputRange: [0, 1],
                outputRange: [-150, 50]
            })}} >
                <Button transparent onPress={this.props.toTop}>
                    <Icon name="ios-arrow-dropup-circle-outline"
                    style={{fontSize: 40,color:this.props.color}}/>
                </Button>
            </Animated.View>
            
        )
    }
}