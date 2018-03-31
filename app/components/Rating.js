import React from 'react';
import {View } from 'react-native';
import {Icon, Text} from 'native-base';
import PropTypes from "prop-types";
//utils
import Colors from '../utils/Colors';

const Rating = ({rate,screenProps}) => {
  let _rate_arr = ((num) => {
    let _arr = []
    for(let i = 0;i<5;i++) {
      if(num >= 1) {
        _arr.push('md-star')
      }else if(num >0 && num < 1){
        _arr.push('md-star-half')
      }else if(num <= 0){
        _arr.push('md-star-outline');
      }
      num = num -1;
    }
    return _arr;
  })(rate);
  return (
    <View style={{flexDirection: 'row',marginBottom: 10,alignItems: 'center',}}>
      <View style={{flexDirection: 'row',marginTop: -5,}}>
        {_rate_arr.map((item,idx) => (<Icon key={idx}  name={item} style={{width:26,height:26,color: Colors.rate_yellow,marginRight:1}}/>))}
      </View>
    </View>
  )
  
}

Rating.defaultProps = {
  rate: 0
}

Rating.propTypes = {
  rate: PropTypes.number
}

export default Rating;