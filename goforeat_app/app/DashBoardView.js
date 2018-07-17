import React, { PureComponent } from 'react';
import MainView from './MainView';
import {connect} from 'react-redux';
import {
  LOGIN,
  LOGOUT,
  STOCK_ARTICLE,
  STOCK_SHOP,
  DELETE_ARTICLE,
  DELETE_SHOP,
  IS_LOADING,
  IS_NOT_LOADING,
  CHANGE_LANGUAGE,
  STOCK_PLACE,
  DELETE_PLACE,
  REFRESH,
  CHANGE_THEME,
  SET_PAY_TYPE
} from "./actions";

class DashBoardView extends PureComponent {
  componentDidMount() {
    // console.log('dash',this.props);
  }
  render() {
    return (
        <MainView 
        // navigation={addNavigationHelpers({
        //   dispatch: this.props.dispatch,
        //   state: this.props.nav,
        //   // addListener,
        // })} 
        screenProps={{...this.props}}
        />
        // {this.props.loading? <Loading message="玩命加載中..."/> : null}
    )
  }
}
const dashboardStateToProps = (state) => {
  return({
  nav: state.nav,
  theme: state.theme.theme,
  user: state.auth.username,
  sid: state.auth.sid,
  filterSort: state.filterSort,
  refresh: state.refresh.refreshParams,
  shopList: state.stockShop,
  articleList: state.stockArticle,
  loading: state.loading,
  language: state.language.language,
  place: state.placeSetting.place,
  paytype: state.payType.payType
})}

const dashboardmapDispatchToProps = dispatch => ({
  userLogin: (username,sid) => dispatch({type:LOGIN,username:username,sid:sid}),
  userLogout: () => dispatch({type:LOGOUT}),
  refreshReset: (val) => dispatch({type:REFRESH,refresh:val}),
  stockShop: (item) => dispatch({type:STOCK_SHOP,data:item}),
  deleteShop: (id) => dispatch({type:DELETE_SHOP,id:id}),
  stockArticle: (item) => dispatch({type:STOCK_ARTICLE,data:item}),
  deleteArticle: (id) => dispatch({type:DELETE_ARTICLE,id:id}),
  changeTheme: (theme) => dispatch({type:CHANGE_THEME,theme:theme}),
  showLoading: () => dispatch({type:IS_LOADING}),
  hideLoading: () => dispatch({type:IS_NOT_LOADING}),
  changeLanguage: (language) => dispatch({type: CHANGE_LANGUAGE,language}),
  stockPlace: (place) => dispatch({type: STOCK_PLACE,place}),
  deletePlace: () => dispatch({type: DELETE_PLACE}),
  setPayType: (paytype) => dispatch({type: SET_PAY_TYPE,paytype}),
  dispatch: dispatch
})

export default connect(dashboardStateToProps,dashboardmapDispatchToProps)(DashBoardView)