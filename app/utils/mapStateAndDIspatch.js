import {bindActionCreators} from 'redux';

export const searchStateAndDispatch = {
  mapStateToProps: state => {
    return {
      theme: state.theme.theme
    };
  }
}

export const settingsStateAndDispatch = {
  mapStateToProps: state => {
    return {
      theme: state.theme.theme
    };
  },
  mapDispatchToProps: dispatch => {
    return {
      changeTheme: (theme) => dispatch({type:'CHANGE_THEME',theme:theme})
    }
  }
}

export const myFavoriteStateAndDispatch = {
  mapStateToProps: state => {
    return {
      shopList: state.stockShop,
      theme:state.theme.theme,
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
      user: state.auth.username,
      theme:state.theme.theme,
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

export const settingStateAndDispatch = {
  mapStateToProps: state => {
    return {
      shopList: state.stockShop.shopList,
      theme:state.theme.theme,
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
      user: state.auth.username,
      theme:state.theme.theme,
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
      user: state.auth.username,
      theme:state.theme.theme
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
      theme:state.theme.theme,
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
      theme:state.theme.theme,
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
      filterSort: state.filterSort,
      theme:state.theme.theme,
    }
  },
  mapDispatchToProps: dispatch => {
    return {
      saveFilter: (data) => dispatch({type:'SAVE_FILTER_PARAMS',data:data}),
      resetFilter: () => dispatch({type:'RESET_FILTER_PARAMS'})
    }
  }
}
