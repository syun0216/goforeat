export const user = {
  mapStateToProps: state => {
    return {
      user: state.auth.user_name
    };
  },
  mapDispatchToProps: dispatch => {
    return {
      userLogin: (username) => dispatch({type:'LOGIN',username:username})
    }
  }
};
