import React from 'react'
import PropTypes from 'prop-types'
import {View,ActivityIndicator,Text,TouchableOpacity,StyleSheet} from 'react-native'
import GLOBAL_PARAMS from '../utils/global_params'

const styles = StyleSheet.create({
  commonContainer:{
    height:50,flex:1,flexDirection:'row',justifyContent:'center'
  }
})

const ListFooter = ({loadingStatus,errorToDo}) => {
  switch (loadingStatus){
    case GLOBAL_PARAMS.httpStatus.LOADING:{
      return (
        <View style={styles.commonContainer}>
          <ActivityIndicator style={{flex:1,}} size='small' color='#000'/>
          {/* <Text style={{flex:1}}>正在加載中...</Text> */}
        </View>
      )
    }
    case GLOBAL_PARAMS.httpStatus.LOAD_FAILED: {
      return (
        <TouchableOpacity style={style.commonContainer} onPress={() => errorToDo()}>
          <Text style={{flex:1}}>加載失敗,請點擊重試...</Text>
        </TouchableOpacity>
      )
    }
    case GLOBAL_PARAMS.httpStatus.LOAD_SUCCESS: {
      return (
        <View style={styles.commonContainer}>
          <Text>沒有更多數據了...</Text>
        </View>
      )
    }
    default: return null
  }
}

ListFooter.defaultProps = {
  loadingStatus: 0
}
ListFooter.propTypes = {
  loadingStatus:PropTypes.number,
  errorToDo:PropTypes.func
}

export default ListFooter
