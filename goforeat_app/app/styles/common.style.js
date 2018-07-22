import GLOBAL_PARAMS from '../utils/global_params';
const common = {
  btn: {
    height: 45,
    width: GLOBAL_PARAMS._winWidth*0.7,
    justifyContent:'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 5,
    shadowColor: '#FA9285',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    elevation: 3,
  },
  common_btn_container: {
    marginTop: 18,
    marginBottom: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  common_row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  common_info_text: {
    color: '#666666',
    fontSize: 14,
  },
  common_title_text: {
    color: '#111111',
    fontSize: 18
  },
  common_important_text: {
    color: '#ff3348',
    fontSize: 18
  },
  common_icon_back: {
    fontSize: 25,
    paddingLeft: 10,
    paddingRight: 20
  }
}

export default common;