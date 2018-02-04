import {bindActionCreators} from 'redux';


export const userStateAndDispatch = {
  mapStateToProps: state => {
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

export const filterStateAndDispatch = {
  mapStateToProps : state => {
    return {
      filterSort: state.filterSort
    }
  },
  mapDispatchToProps: dispatch => {
    return {
      saveFilter: (data) => dispatch({type:'SAVE_FILTER_PARAMS',data:data}),
      resetFilter: () => dispatch({type:'RESET_FILTER_PARAMS'})
    }
  }
}
