import React,{PureComponent} from 'react';
import PropTypes from 'prop-types';
import {View,Image,StyleSheet,TouchableOpacity,Easing,Animated} from 'react-native';
//utils
import GLOBAL_PAMRAS,{em} from '../utils/global_params';
//components
import Text from './UnScalingText';

const styles = StyleSheet.create({
  warn_container: {
    backgroundColor: '#FEFCEB',
    width: GLOBAL_PAMRAS._winWidth,
    height: em(36),
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 9,
    paddingBottom: 9,
    paddingLeft: 5,
    paddingRight: 5,
    alignItems: 'center',
    overflow: 'hidden',
  },
  warning_img: {
    width: em(16),
    height: em(16)
  },
  warning_text_container: {
    flexDirection: 'column',
    backgroundColor: '#FEFCEB',
    position: 'relative',
    width: GLOBAL_PAMRAS._winWidth*0.8,
    maxWidth: GLOBAL_PAMRAS._winWidth*0.8,
  },
  warningt_text_inner_container: {
    flexDirection: 'column',
    width: GLOBAL_PAMRAS._winWidth*0.8,
    maxWidth: GLOBAL_PAMRAS._winWidth*0.8,
    position: 'absolute',
    // left: 0
  },
  warning_text: {
    color: '#F86B25',
    fontSize: em(14),
    padding: em(9)
  },
  warning_close: {
    width: 12,
    height: 12,
  }
});

const offset_distance = em(-36);

const WARNING_CONTENT = (v, i, navigation) => (
  <TouchableOpacity key={i} onPress={
    () => navigation.navigate('Content',{
      data: v,kind: 'warning'
    })
  }>
    <Text numberOfLines={1} style={styles.warning_text}>{v.title}</Text>
  </TouchableOpacity>
);

export default class WarningTips extends PureComponent {
  static propsType = {
    data: PropTypes.array,
    closeFunc: PropTypes.func
  };

  static defaultProps = {
    data:[],
    closeFunc: () => {}
  };
  _interval = null;

  state = {
    offsetTop: new Animated.Value(0)
  };

  componentDidMount() {
    this._loopDisplay();
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  _loopDisplay() {
    let { data } = this.props;
    let _temp_index = 1;
    this._interval = setInterval(() => {
      if(_temp_index < data.length) {
        Animated.timing(this.state.offsetTop, {
          toValue: _temp_index / data.length,
          duration: 300,
          easing:Easing.linear
        }).start();
        _temp_index ++ ;
      }else {
        Animated.timing(this.state.offsetTop, {
          toValue: 0,
          duration: 300,
          easing:Easing.linear
        }).start();
        _temp_index = 1;
      }
    }, 2500)
  }

  render() {
    let {data,closeFunc,navigation} = this.props;
    return (
      <View style={styles.warn_container}> 
        <Image source={require('../asset/warning.png')} style={styles.warning_img} resizeMode="contain"/>
        <View style={styles.warning_text_container}>
          <Animated.View style={[styles.warningt_text_inner_container,{
            marginTop: this.state.offsetTop.interpolate({
              inputRange: [0,1],
              outputRange: [em(-18), em(-18+(-33*data.length))]
            })
          }]}>
          { data.map((v,i) => WARNING_CONTENT(v, i, navigation)) }
          </Animated.View>
        </View>  
        <TouchableOpacity onPress={() => closeFunc()}>
          <Image source={require('../asset/close_red.png')} style={styles.warning_close}/>
        </TouchableOpacity>  
      </View>
    )
  }
}

// const WarningTips = ({data,closeFunc,navigation, offset}) => {
//   data = [data].concat([
//     {title: "test11111111", url: "https://www.baidu.com",kind: 'warning'},
//     {title: "test22222222", url: "https://www.baidu.com",kind: 'warning'},
//   ]);
//   return (
//   <View style={styles.warn_container}> 
//     <Image source={require('../asset/warning.png')} style={styles.warning_img} resizeMode="contain"/>
//     <View style={styles.warning_text_container}>
//       <Aniamted.View style={[styles.warningt_text_inner_container]}>
//       { data.map((v,i) => WARNING_CONTENT(v, i, navigation)) }
//       </Aniamted.View>
//     </View>  
//     <TouchableOpacity onPress={() => closeFunc()}>
//       <Image source={require('../asset/close_red.png')} style={styles.warning_close}/>
//     </TouchableOpacity>  
//   </View>
// )};

// WarningTips.propTypes = {
//   data: PropTypes.object,
//   closeFunc: PropTypes.func
// }

// WarningTips.defaultProps = {
//   data:{},
//   closeFunc: () => {}
// }

// export default WarningTips;
