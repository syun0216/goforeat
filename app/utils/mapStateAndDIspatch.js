import {bindActionCreators} from 'redux';

export const myFavoriteStateAndDispatch = {
  mapStateToProps: state => {
    console.log(state)
    return {
      shopList: state.stockShop
    };
  },
  mapDispatchToProps: dispatch => {
    return {
      stockShop: (item) => dispatch({type:'STOCK_SHOP',data:item}),
      deleteShop: (id) => dispatch({type:'DELETE_SHOP',id:id})
    }
  }
}

export const contentStateAndDispatch = {
  mapStateToProps:state => {
    return {
      user: state.auth.username
    };
  },
  mapDispatchToProps: dispatch => {
    return {
      stockShop: (item) => dispatch({type:'STOCK_SHOP',data:item}),
      deleteShop: (id) => dispatch({type:'DELETE_SHOP',id:id})
    }
  }
}

export const settingStateAndDispatch = {
  mapStateToProps: state => {
    return {
      shopList: state.stockShop.shopList
    };
  },
  mapDispatchToProps: dispatch => {
    return {
      userLogin: (username) => dispatch({type:'LOGIN',username:username}),
      userLogout: () => dispatch({type:'LOGOUT'})
    }
  }
}

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
