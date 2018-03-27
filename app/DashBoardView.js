import React, { PureComponent } from 'react';
import {View} from 'react-native'
import {withNavigationFocus} from 'react-navigation'
import MainView from './MainView'
import {connect} from 'react-redux'
import Loading from './components/Loading'
class DashBoardView extends PureComponent {
  componentDidMount() {
    console.log('dash',this.props);
  }
  render() {
    return (
        <MainView 
        // navigation={addNavigationHelpers({
        //   dispatch: this.props.dispatch,
        //   state: this.props.nav,
        //   // addListener,
        // })} 
        screenProps={{...this['props']}}
        />
        // {this.props.loading? <Loading message="玩命加載中..."/> : null}
    )
  }
}
const dashboardStateToProps = (state) => ({
  nav: state.nav,
  theme: state.theme.theme,
  user: state.auth.username,
  filterSort: state.filterSort,
  refresh: state.refresh.refreshParams,
  shopList: state.stockShop,
  articleList: state.stockArticle,
  loading: state.loading
})

const dashboardmapDispatchToProps = dispatch => ({
  saveFilter: (data) => dispatch({type:'SAVE_FILTER_PARAMS',data:data}),
  resetFilter: () => dispatch({type:'RESET_FILTER_PARAMS'}),
  userLogin: (username) => dispatch({type:'LOGIN',username:username}),
  userLogout: () => dispatch({type:'LOGOUT'}),
  refreshReset: () => dispatch({type:'REFRESH',refresh:false}),
  stockShop: (item) => dispatch({type:'STOCK_SHOP',data:item}),
  deleteShop: (id) => dispatch({type:'DELETE_SHOP',id:id}),
  stockArticle: (item) => dispatch({type:'STOCK_ARTICLE',data:item}),
  deleteArticle: (id) => dispatch({type:'DELETE_ARTICLE',id:id}),
  changeTheme: (theme) => dispatch({type:'CHANGE_THEME',theme:theme}),
  showLoading: () => dispatch({type:'IS_LOADING'}),
  hideLoading: () => dispatch({type:'IS_NOT_LOADING'}),
  dispatch: dispatch
})

export default connect(dashboardStateToProps,dashboardmapDispatchToProps)(DashBoardView)