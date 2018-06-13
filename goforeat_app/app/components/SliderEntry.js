import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity,StyleSheet,Platform } from 'react-native';
import {Icon} from 'native-base';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles,{slideWidth} from '../styles/SliderEntry.style';
import {withNavigation} from 'react-navigation';
import {connect} from 'react-redux';
import ToastUtil from '../utils/ToastUtil';
//utils
import GLOBAL_PARAMS from '../utils/global_params';
import Colors from '../utils/Colors';

const _styles = StyleSheet.create({
    countContainer:{
        width: GLOBAL_PARAMS._winWidth*0.8,
        backgroundColor:'#fff',
        marginTop:Platform.OS == 'android'?-10:0
    },
    countInnerContainer: {
        height: 40,
        width: GLOBAL_PARAMS._winWidth*0.801,
        opacity:0.9,
        // borderRadius: 20,
        marginTop: Platform.OS == 'android'? 0:-48,
        zIndex: 999,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    count: {
        flexDirection:'row',
        justifyContent: 'space-around',
        flex: 1,
    },
    common_text: {
        color: '#fff',
        fontSize: 16,
        maxWidth: GLOBAL_PARAMS._winWidth < 350 ? 130 : 170
    },
    common_icon: {
        color: '#fff',
        fontSize: 20,
        // marginLeft: 25,
        // marginRight: 25,
    },
    common_view:{
        // width: GLOBAL_PARAMS._winWidth*0.52,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    price_view: {
        position: 'absolute',
        width: 'auto',
        top: 0,
        right: 0,
        paddingLeft: 15,
        paddingRight: 15,
        // backgroundColor: '#3B254B',
        opacity: 0.9,
        flexDirection: 'row',
        zIndex:10,
        alignItems: 'center',
        borderTopRightRadius: 5,
        height: 40,
        borderBottomLeftRadius: 30,
    },
    price_text: {
        fontSize: 20,
        color: Colors.main_white,
        marginLeft: 10,
        marginRight: 10
    },
    orgin_price_text: {
        fontSize: 14,
        color: Colors.main_white,
        textDecorationLine: 'line-through',
        marginRight: 10
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
        getCount: PropTypes.func,
        count: PropTypes.number
    };

    state = {
        count: 0
    }

    componentDidMount() {
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
        this.props.getCount(this.props.count + 1);
    }

    _remove() {
        if(this.props.count == 0) {
            return;
        }
        this.props.getCount(this.props.count - 1);
    }

    reInit() {
        this.setState({
            count: 0
        })
    }

    _renderCountView() {
        const { data: { foodName, foodBrief,foodId,foodImage,price } } = this.props;
        return (
            <View style={_styles.countContainer}>
                <View style={[_styles.countInnerContainer,{backgroundColor: this.props.screenProps.theme}]}>
                    <View style={_styles.common_view}>
                        <Text style={_styles.common_text} numberOfLines={1}>{foodName}</Text>
                    </View>
                    <View style={{width: 1,height: 15,backgroundColor: '#fff'}}/>
                    <View style={_styles.count}>
                        <TouchableOpacity style={{width: 40,alignItems:'center'}} onPress={() => this._remove()}>
                            <Icon name="md-remove" style={_styles.common_icon}/>
                        </TouchableOpacity>
                        <Text style={_styles.common_text}>{this.props.count}</Text>
                        <TouchableOpacity style={{width: 40,alignItems:'center'}} onPress={() => this._add()}>
                            <Icon name="md-add" style={_styles.common_icon}/>
                        </TouchableOpacity>    
                    </View>
                </View>
            </View>
        )
    }

    _renderPriceView() {
        const { data: { price, originPrice } } = this.props;
        return (
            <View style={[_styles.price_view,{backgroundColor:this.props.screenProps.theme}]}>
                <Text style={_styles.price_text}>HKD {price}</Text>
                <Text style={_styles.orgin_price_text}>
                HKD {originPrice}</Text>
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
            // onPress={() => {
            //     if(this.props.user !== null) {
            //         this.props.navigation.navigate("Order", {
            //             foodId,
            //             placeId
            //         })
            //     }else {
            //         this.props.navigation.navigate("Login",{foodId,placeId});
            //     }
            // }}
              >
                <View style={[styles.imageContainer]}>
                    { this.image }
                    </View>
                {this._renderCountView()}
                {/*<View style={[styles.textContainer]}>
                    
                    <Text
                      style={[styles.subtitle]}
                      numberOfLines={5}
                    >
                        { foodBrief }
                    </Text>
        </View>*/}
            </TouchableOpacity>
        );
    }
}

const userStateToProps = (state) => ({
    user: state.auth.username,
})

export default connect(userStateToProps)(withNavigation(SliderEntry))