import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity,StyleSheet } from 'react-native';
import {Icon} from 'native-base';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles,{slideWidth} from '../styles/SliderEntry.style';
import {withNavigation} from 'react-navigation';
import {connect} from 'react-redux';
import ToastUtil from '../utils/ToastUtil';
//utils
import GLOBAL_PARAMS from '../utils/global_params';

const _styles = StyleSheet.create({
    countContainer:{
        width: GLOBAL_PARAMS._winWidth*0.9,
        backgroundColor:'#fff'
    },
    countInnerContainer: {
        height: 40,
        width: GLOBAL_PARAMS._winWidth*0.80,
        borderRadius: 20,
        marginLeft: GLOBAL_PARAMS._winWidth*0.055,
        marginTop: -30,
        zIndex: 999,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    count: {
        flexDirection:'row',
        justifyContent: 'center',
        flex: 1
    },
    common_text: {
        color: '#fff',
        fontSize: 16,
        maxWidth: 120
    },
    common_icon: {
        color: '#fff',
        fontSize: 20,
        marginLeft: 25,
        marginRight: 25,
    },
    common_view:{
        width: GLOBAL_PARAMS._winWidth*0.45,
        flexDirection: 'row',
        justifyContent: 'center',
    }
})

class SliderEntry extends Component {
    isLogin = false;
    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object,
        placeId: PropTypes.number.isRequired,
        getCount: PropTypes.func
    };

    state = {
        count: 0
    }

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

    _add() {
        this.setState({
            count: this.state.count + 1
        });
        this.props.getCount(this.state.count + 1);
    }

    _remove() {
        if(this.state.count == 0) {
            return;
        }
        this.setState({
            count: this.state.count - 1
        })
        this.props.getCount(this.state.count - 1);
    }

    _renderCountView() {
        const { data: { foodName, foodBrief,foodId,foodImage } } = this.props;
        return (
            <View style={_styles.countContainer}>
                <View style={[_styles.countInnerContainer,{backgroundColor: this.props.screenProps.theme}]}>
                    <View style={_styles.common_view}>
                        <Text style={_styles.common_text} numberOfLines={1}>{foodName}12321</Text>
                        <Text style={[_styles.common_text,{marginLeft: 10}]}>{" "}|{" "}</Text>
                    </View>
                    <View style={_styles.count}>
                        <TouchableOpacity onPress={() => this._remove()}>
                            <Icon name="md-remove" style={_styles.common_icon}/>
                        </TouchableOpacity>
                        <Text style={_styles.common_text}>{this.state.count}</Text>
                        <TouchableOpacity onPress={() => this._add()}>
                            <Icon name="md-add" style={_styles.common_icon}/>
                        </TouchableOpacity>    
                    </View>
                </View>
            </View>
        )
    }

    render () {
        const { data: { foodName, foodBrief,foodId,foodImage }, even ,placeId } = this.props;

        const uppercaseTitle = foodName ? (
            <Text
              style={[styles.title]}
              numberOfLines={1}
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
                        foodId,
                        placeId
                    })
                }else {
                    this.props.navigation.navigate("Login",{foodId,placeId});
                }
            }}
              >
                <View style={[styles.imageContainer]}>
                    { this.image }
                    <View style={[styles.radiusMask]} />
                </View>
                {this._renderCountView()}
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