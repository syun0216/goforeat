import {bindActionCreators} from 'redux';
import * as actionCreator from '../actions/index'
export const userStateAndDispatch = {
  mapStateToProps: state => {
    console.log(state)
    return {
      user: state.auth.username
    };
  },
  mapDispatchToProps: dispatch => {
    return {
      userLogin: (username) => dispatch({type:'LOGIN',username:username}),
      userLogout: () => dispatch({type:'LOGOUT'})
    }
  }
  // mapDispatchToProps: dispatch => bindActionCreators(actionCreator,dispatch)
};
