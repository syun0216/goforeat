import React,{PureComponent} from 'react';
import { Modal,View,Text,TouchableOpacity,StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Button,Header,Left,Body,Right,Footer,Container,Content } from 'native-base';
//utils
import GLOBAL_PARAMS from '../utils/global_params';
import Colors from '../utils/Colors'

export default class DropdownModal extends PureComponent {
  static defaultProps = {
    filterData: []
  }
  static propTypes = {
    filterData:PropTypes.array.isRequired,
    confirmToDo:PropTypes.func,
    cancleToDo:PropTypes.func
  }
  state = {
    currentSelect:this.props.screenProps.filterSort
  }

  _selectCurrent(index) {
    this.setState({
      currentItem: index
    })
  }

  _renderFilterItem = (item,idx) => (
    <View key={idx} style={styles.filterItemContainer}>
      <View>
        <Text style={styles.filterItemContainerTitle}>{item.name}</Text>
      </View>
      <View style={styles.filterItemContainerRight}>
        {item.value.map((citem,cidx) => this._renderFilterChildrenItem(citem,cidx,item.enName))}
      </View>
    </View>
  )

  _renderFilterChildrenItem = (citem,cidx,itemEnName) => (
    <View style={styles.filterItemChildren} key={cidx}>
      {citem.map((btn,btnkey) => (
        <Button key={btnkey} onPress={() => this._filterClick(btn,itemEnName)}
           transparent key={btnkey} style={styles.filterItemChildrenBtn}>
          <Text style={[this.props.screenProps.filterSort[itemEnName] === btn[0] ?
            {color:this.props.screenProps.theme} : {color:Colors.fontBlack},{fontSize: 16}]}>{btn[1]}</Text>
        </Button>
      ))}
    </View>
  )

  //common functions
  _filterClick = (btn,itemEnName) =>{
    // console.log(btn[0])
    if(btn[0] === this.props.screenProps.filterSort[itemEnName]){
      return ;
    }
    let _obj = {
      ...this.props.screenProps.filterSort
    }
    _obj[itemEnName] = btn[0]
    this.props.screenProps.saveFilter(_obj)
  }

  render() {
    return (
      <Modal
      animationType={"slide"}
      transparent={false}
      visible={this.props.modalVisible}>
        <Container>
          <Header style={{backgroundColor: Colors.main_white}}>
            <Left />
            <Body>
              <Text style={{fontSize:16}}>篩選分類</Text>
            </Body>
            <Right>
              <TouchableOpacity onPress={this.props.cancleToDo.bind(this)}>
                <Text style={{fontSize:16}}>取消</Text>
              </TouchableOpacity>
            </Right>
          </Header>
          <Content>
            {this.props.filterData.map((item,idx) => this._renderFilterItem(item,idx))}
          </Content>
          <Footer style={{flexDirection:'row'}}>
            <TouchableOpacity style={{flex: 1,justifyContent:'center',alignItems:'center',backgroundColor: Colors.main_white}}
              onPress={this.props.screenProps.resetFilter.bind(this)}>
              <Text style={styles.bottomBtn}>重置</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1,justifyContent:'center',alignItems:'center',backgroundColor: Colors.rate_yellow}} 
              onPress={() => this.props.confirmToDo(this.props.screenProps.filterSort)}>
              <Text style={[styles.bottomBtn,{color: Colors.main_white}]}>確認</Text>
            </TouchableOpacity>
          </Footer>
        </Container>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  bottomBtn: {
    fontSize: 16,
    color: Colors.fontBlack
  },
  filterContainer:{
    flex:1,
  },
  mainContainer: {
    flex:1
  },
  filterItemContainer:{
    flex:1,
    // paddingTop:10,
    paddingBottom:10,
  },
  filterItemContainerTitle:{
    color: Colors.fontBlack,
    paddingLeft:21,
    width: GLOBAL_PARAMS._winWidth,
    backgroundColor: '#fafafa',
    paddingTop:10,
    paddingBottom: 10
  },
  filterItemContainerLeft:{
    width:50,
    borderRightWidth:1,
    borderColor:'#ddd',
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  filterItemContainerRight:{
    flex:1,
    justifyContent:'flex-start',
    alignItems:'flex-start',
    marginLeft: 11
  },
  filterItemChildren:{
    flex:1,
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    marginTop:5,
  },
  filterItemChildrenBtn:{
    // flex:1,
    borderRadius:0,
    marginLeft:10,
    marginRight:10,
    width: GLOBAL_PARAMS._winWidth*0.28
  },
  activeBtn:{
    // :Colors.main_orange,
  },
  activeText: {
    color:Colors.main_orange
  }
})
