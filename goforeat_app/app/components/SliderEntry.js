import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity,StyleSheet,Platform } from 'react-native';
import PropTypes from 'prop-types';
import styles,{slideWidth} from '../styles/SliderEntry.style';
import {withNavigation} from 'react-navigation';
import {connect} from 'react-redux';
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
    },
})

class SliderEntry extends Component {
    isLogin = false;
    static propTypes = {
        data: PropTypes.string.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object,
        placeId: PropTypes.number.isRequired,
        star: PropTypes.number
    }

    state = {
        count: 0
    }

    get image () {
        const { data , parallax, parallaxProps, even } = this.props;
        // console.log(123,foodImage);
        return (
            <Image source={{uri: data}} style={styles.image}/>
        )
    }

    _renderStarView() {
        let {star} = this.props;
        let _star = [];
        for(let i = 0;i<3;i++) {
            if(star >= 1) {
              _star.push(require('../asset/star_active.png'))
            }else {
                _star.push(require('../asset/star_inactive.png'))
            }
            star = star -1;
        }
        return (
            <View style={{position: 'relative'}}>
                <Image source={require('../asset/starbar.png')} style={{height: 78,width: 85,}}/>
                <Image style={{width: 18, height: 18,position:'absolute',bottom: 20,left:4,transform:[{rotate:'-5deg'}]}} source={_star[0]}/>
                <Image style={{width: 18, height: 18,position:'absolute',bottom: 38,left:23,transform:[{rotate:'-5deg'}]}} source={_star[1]}/>
                <Image style={{width: 18, height: 18,position:'absolute',bottom: 56,left:43,transform:[{rotate:'-5deg'}]}} source={_star[2]}/>
            </View>
        )
    }

    render () {
        const { data, even ,placeId } = this.props;

        return (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.slideInnerContainer}
              >
                <View style={[styles.imageContainer]}>
                    { this.image }
                    { this._renderStarView() }
                </View>
            </TouchableOpacity>
        );
    }
}

const userStateToProps = (state) => ({
    user: state.auth.username,
})

export default connect(userStateToProps)(withNavigation(SliderEntry))