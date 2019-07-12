import React, { PureComponent } from 'react';
import MainView from './MainView';
import {connect} from 'react-redux';
import NavigationService from './utils/NavigationService';
import {
  LOGIN,
  LOGOUT,
  CHANGE_LANGUAGE,
  SET_PAY_TYPE,
  SAVE_ACTIVITY,
  RESET_ACTIVITY
} from "./actions";

class DashBoardView extends PureComponent {
  render() {
    return (
        <MainView 
          ref={navigationRef => NavigationService.setTopLevelNavigator(navigationRef)}
        // navigation={addNavigationHelpers({
        //   dispatch: this.props.dispatch,
        //   state: this.props.nav,
        //   // addListener,
        // })} 
        // screenProps={{...this.props}}
        />
        // {this.props.loading? <Loading message="玩命加載中..."/> : null}
    )
  }
}
const dashboardStateToProps = (state) => {
  return({
  nav: state.nav,
  user: state.auth.username,
  showLogin: state.login.showLogin,
  toPage: state.login.toPage,
  userInfo: state.auth,
  sid: state.auth.sid,
  language: state.language.language,
  paytype: state.payType.payType,
  activityInfo: state.activityInfo
})}

const dashboardmapDispatchToProps = dispatch => ({
  userLogin: (user) => dispatch({type:LOGIN,...user}),
  userLogout: () => dispatch({type:LOGOUT}),
  toggleLogin: (status) => dispatch({type:'CHANGE_LOGIN_STATUS', showLogin: status}),
  setToPageParams: (toPage) => dispatch({type:'SET_LOGIN_TO_PAGE', toPage}),
  changeLanguage: (language) => dispatch({type: CHANGE_LANGUAGE,language}),
  setPayType: (paytype,callback) => dispatch({type: SET_PAY_TYPE,paytype,callback}),
  dispatch: dispatch
})

// export default connect(dashboardStateToProps,dashboardmapDispatchToProps)(DashBoardView)
export default DashBoardView