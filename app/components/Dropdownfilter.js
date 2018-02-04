import React,{PureComponent} from 'react'
import PropTypes from 'prop-types'
import {View,TouchableOpacity,StyleSheet} from 'react-native'
import {Container,Content,Footer,Button,Text,Badge} from 'native-base'
//utils
import Colors from '../utils/Colors'

export default class Dropdownfilter extends PureComponent{
  static defaultProps = {
    filterData: []
  }
  static propTypes = {
    filterData:PropTypes.array.isRequired,
    confirmToDo:PropTypes.func,
    cancleToDo:PropTypes.func
  }
  state = {
    currentSelect:{
      areas:'default',
      categories:'default',
      seats:'default'
    }
  }

  _selectCurrent(index) {
    this.setState({
      currentItem: index
    })
  }


  componentDidMount(){
    console.log(this.props)
  }

  _renderFilterItem = (item,idx) => (
    <View key={idx} style={styles.filterItemContainer}>
      <View style={styles.filterItemContainerLeft}>
        <Text>{item.name}</Text>
      </View>
      <View style={styles.filterItemContainerRight}>
        {item.value.map((citem,cidx) => this._renderFilterChildrenItem(citem,cidx,item.enName))}
      </View>
    </View>
  )

  _renderFilterChildrenItem = (citem,cidx,itemEnName) => (
    <View style={styles.filterItemChildren} key={cidx}>
      {citem.map((btn,btnkey) => (
        <Button onPress={() => this._filterClick(btn,itemEnName)}
           transparent key={btnkey} style={[styles.filterItemChildrenBtn,
           this.state.currentSelect[itemEnName] === btn[0] ? styles.activeBtn : null]}>
          <Text style={this.state.currentSelect[itemEnName] === btn[0] ?
            styles.activeText : null}>{btn[1]}</Text>
        </Button>
      ))}
    </View>
  )

  //common functions
  _filterClick = (btn,itemEnName) =>{
    // console.log(btn[0])
    if(btn[0] === this.state.currentSelect[itemEnName].value){
      return ;
    }
    let _obj = {
      ...this.state.currentSelect
    }
    _obj[itemEnName] = btn[0]
    this.setState({
      currentSelect:_obj
    })
    // switch(itemEnName){
    //   case 'areas': {
    //     this.setState({currentSelect:{...thiareas:btn[0]}});break
    //   }
    //   case 'categories': {
    //     this.setState({currentSelect:{categories:btn[0]}});break
    //   }
    //   case 'seats': {
    //     this.setState({currentSelect:{seats:btn[0]}});break
    //   }
    // }
    console.log(this.state.currentSelect)
  }

  render() {
    return (
      <View style={styles.filterContainer}>
        <View style={styles.mainContainer}>
          {this.props.filterData.map((item,idx) => this._renderFilterItem(item,idx))}
        </View>
        <View style={styles.footerContainer}>
          <Button transparent danger onPress={() => this.props.cancleToDo()}
            style={[styles.footerBtn,{borderRightWidth:1,borderColor:'#ccc',borderRadius:0}]}>
            <Text>取消</Text>
          </Button>
          <Button onPress={() => this.props.confirmToDo(this.state.currentSelect)}
             transparent info style={styles.footerBtn}>
            <Text>確定</Text>
          </Button>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  filterContainer:{
    height:400,
    flex:1,
  },
  mainContainer: {
    flex:1
  },
  footerContainer: {
    borderTopWidth:1,
    borderColor:'#ccc',
    height: 47,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row'
  },
  footerBtn:{
    flex:1,
    justifyContent:'center'
  },
  filterItemContainer:{
    flex:1,
    flexDirection:'row',
    borderBottomWidth:1,
    borderColor:'#ccc'
  },
  filterItemContainerLeft:{
    width:50,
    borderRightWidth:1,
    borderColor:'#ccc',
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  filterItemContainerRight:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  filterItemChildren:{
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginTop:5
  },
  filterItemChildrenBtn:{
    // flex:1,
    borderRadius:0,
    marginLeft:5,
    marginRight:5
  },
  activeBtn:{
    backgroundColor:Colors.main_orange,
  },
  activeText: {
    color:'#fff'
  }
})
