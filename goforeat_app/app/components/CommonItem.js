import React from 'react'
import PropTypes from 'prop-types'
import {View, Text, TouchableWithoutFeedback} from 'react-native'

const CommonItem = ({navigation,rowData,theme}) => (<View>
  {
    rowData.map((item, idx) => {
      return <TouchableWithoutFeedback key={`${idx}`} transparent="transparent" style={{
          height: 70,
          flex: 1,
          padding: 10,
          justifyContent: 'center'
        }} onPress={() => navigation.navigate('Content', {
          data:item,
          kind:'canteen'
        })}>
        <View style={{
            backgroundColor: 'white',
            marginBottom: 10,
            marginLeft: 10,
            marginRight: 10,
            padding: 10,
            flex: 1,
            flexDirection: 'row',
            borderRadius: 10,
            shadowColor: '#5b7392',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.15,
            shadowRadius: 2,
            elevation: 1
          }}>
          <View style={{
              width: 60
            }}><Image style={{
          width: 50,
          height: 50
        }} source={{
          uri: item.image
        }}/></View>
          <View style={{
              flex: 1,
              justifyContent: 'center'
            }}>
            <Text style={{
                color: Colors.fontBlack,
                lineHeight: 20,
                fontSize: 14
              }}>{item.name}</Text>
              <Text>地址:{item.address}</Text>
              <Text>评分:{item.rate}</Text>
              <Text style={{color:theme,fontSize:14}}></Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    })
  }
</View>)

CommonItem.defaultProps = {
  rowData: []
}

CommonItem.propsType = {
  rowData: PropTypes.array
}

export default CommonItem
