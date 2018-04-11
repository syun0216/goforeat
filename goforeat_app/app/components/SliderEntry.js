import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from '../styles/SliderEntry.style';
import {withNavigation} from 'react-navigation';
import {connect} from 'react-redux'


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

        return parallax ? (
            <ParallaxImage
              source={{ uri: foodImage }}
              containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
              style={styles.image}
              parallaxFactor={0.35}
              showSpinner={true}
              spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
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
        const { data: { foodName, foodBrief,foodId }, even } = this.props;


        const uppercaseTitle = foodName ? (
            <Text
              style={[styles.title, even ? styles.titleEven : {}]}
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
                <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
                    { this.image }
                    <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} />
                </View>
                <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
                    { uppercaseTitle }
                    <Text
                      style={[styles.subtitle, even ? styles.subtitleEven : {}]}
                      numberOfLines={2}
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