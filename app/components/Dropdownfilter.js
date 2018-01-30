import React,{PureComponent} from 'react'
import PropTypes from 'prop-types'
import {View,Text,TouchableOpacity,StyleSheet} from 'react-native'
//utils
import Colors from '../utils/Colors'

export default class Dropdownfilter extends PureComponent{
  static defaultProps = {
    filterData: []
  }
  static propTypes = {
    filterData:PropTypes.object.isRequired
  }
  state = {
    currentItem:1,
    
  }

  _selectCurrent(index) {
    this.setState({
      currentItem: index
    })
  }


  componentDidMount(){
    console.log(this.props)
  }

  render() {
    return (
      <View style={styles.filterContainer}>
        <View style={styles.leftContainer}>
          <TouchableOpacity style={styles.leftContainerItem} onPress={() => this._selectCurrent(1)}>
            <View style={this.state.currentItem===1?styles.leftActiveItem:styles.leftInActiveItem}>
              <Text style={this.state.currentItem===1?styles.leftActiveText:null}>123</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.leftContainerItem} onPress={() => this._selectCurrent(2)}>
            <View style={this.state.currentItem===2?styles.leftActiveItem:styles.leftInActiveItem}>
              <Text style={this.state.currentItem===2?styles.leftActiveText:null}>123</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.leftContainerItem} onPress={() => this._selectCurrent(3)}>
            <View style={this.state.currentItem===3?styles.leftActiveItem:styles.leftInActiveItem}>
              <Text style={this.state.currentItem===3?styles.leftActiveText:null}>123</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.rightContainer}>

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  filterContainer:{
    height:250,
    flex:1,
    flexDirection:'row'
  },
  leftContainer: {
    width: 80,
    height:250,
    display:'flex'
  },
  leftContainerItem: {
    flex:1,

  },
  leftInActiveItem: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    borderColor:'#ccc',
    borderRightWidth:1,
  },
  leftActiveItem: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    borderRightWidth:5,
    borderColor:Colors.main_orange,
  },
  leftActiveText: {
    color: Colors.main_orange
  },
  rightContainer: {
    flex:1,
    height:250
  },
})
