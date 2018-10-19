import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity,StyleSheet,Platform } from 'react-native';
import PropTypes from 'prop-types';
import styles,{slideWidth} from '../styles/SliderEntry.style';
import {withNavigation} from 'react-navigation';
import {connect} from 'react-redux';
//utils
import GLOBAL_PARAMS from '../utils/global_params';
import Colors from '../utils/Colors';

class SliderEntry extends Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
    }

    

    image() {
        const { data  } = this.props;
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
        return (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.slideInnerContainer}
              >
                <View style={[styles.imageContainer]}>
                    { this.image() }
                    {/* this._renderStarView() */}
                </View>
            </TouchableOpacity>
        );
    }
}

SliderEntry.propTypes = {
    data: PropTypes.string.isRequired,
    even: PropTypes.bool,
    parallax: PropTypes.bool,
    parallaxProps: PropTypes.object,
    star: PropTypes.number
}

const userStateToProps = (state) => ({
    user: state.auth.username,
})

export default connect(userStateToProps)(withNavigation(SliderEntry))