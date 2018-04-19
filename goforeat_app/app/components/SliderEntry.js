import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from '../styles/SliderEntry.style';
import {withNavigation} from 'react-navigation';
import {connect} from 'react-redux';
import ToastUtil from '../utils/ToastUtil';

class SliderEntry extends Component {
    isLogin = false;
    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object,
    };

    componentDidMount = () => {
        // console.log(123, this.props);
    }

    get image () {
        const { data: { foodImage }, parallax, parallaxProps, even } = this.props;
        // console.log(123,foodImage);
        return (
            <Image source={{uri: foodImage}} style={styles.image}/>
        )
        return parallax ? (
            <ParallaxImage
              source={{ uri: foodImage }}
              containerStyle={[styles.imageContainer,]}
              style={styles.image}
              parallaxFactor={0.35}
              showSpinner={true}
              spinnerColor={'rgba(0, 0, 0, 0.25)'}
              {...parallaxProps}
            />
        ) : (
            <Image
              source={{ uri: foodImage }}
              style={styles.image}
            />
        );
    }

    render () {
        const { data: { foodName, foodBrief,foodId,foodImage }, even } = this.props;


        const uppercaseTitle = foodName ? (
            <Text
              style={[styles.title]}
              numberOfLines={2}
            >
                { foodName.toUpperCase() }
            </Text>
        ) : false;

        return (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.slideInnerContainer}
            //   onPress={() =>
            //     this.props.navigation.navigate("Content", {
            //       data: this.props.data,
            //       kind: 'canteen'
            //     })
            //   }
            onPress={() => {
                if(this.props.user !== null) {
                    this.props.navigation.navigate("Order", {
                        foodId
                    })
                }else {
                    this.props.navigation.navigate("Login");
                }
            }}
              >
                <View style={[styles.imageContainer]}>
                    { this.image }
                    <View style={[styles.radiusMask]} />
                </View>
                <View style={[styles.textContainer]}>
                    { uppercaseTitle }
                    <Text
                      style={[styles.subtitle]}
                      numberOfLines={5}
                    >
                        { foodBrief }
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const userStateToProps = (state) => ({
    user: state.auth.username,
})

export default connect(userStateToProps)(withNavigation(SliderEntry))