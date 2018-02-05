import {bindActionCreators} from 'redux';


export const loginStateAndDispatch = {
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
}

export const registerStateAndDispatch = {
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
}

export const personStateAndDispatch = {
  mapStateToProps: state => {
    return {
      user: state.auth.username,
      refresh: state.refresh.refreshParams
    };
  },
  mapDispatchToProps: dispatch => {
    return {
      userLogin: (username) => dispatch({type:'LOGIN',username:username}),
      userLogout: () => dispatch({type:'LOGOUT'}),
      refreshReset: () => dispatch({type:'REFRESH',refresh:false})
    }
  }
}

export const goodsListStateAndDispatch = {
  mapStateToProps: state => {
    return {
      filterSort: state.filterSort,
      refresh: state.refresh.refreshParams
    };
  },
  mapDispatchToProps: dispatch => {
    return {
      saveFilter: (data) => dispatch({type:'SAVE_FILTER_PARAMS',data:data}),
      resetFilter: () => dispatch({type:'RESET_FILTER_PARAMS'})
    }
  }
}

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
