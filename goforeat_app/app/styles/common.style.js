import GLOBAL_PARAMS from '../utils/global_params';
const common = {
  btn: {
    height: GLOBAL_PARAMS.em(45),
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
    marginTop: GLOBAL_PARAMS.em(18),
    marginBottom: GLOBAL_PARAMS.em(18),
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
    fontSize: GLOBAL_PARAMS.em(14),
  },
  common_title_text: {
    color: '#111111',
    fontSize: GLOBAL_PARAMS.em(18)
  },
  common_important_text: {
    color: '#ff3348',
    fontSize: GLOBAL_PARAMS.em(18)
  },
  common_icon_back: {
    fontSize: GLOBAL_PARAMS.em(25),
    paddingLeft: 10,
    paddingRight: 20
  },
  //_renderBottomView
  BottomView: {
    width: GLOBAL_PARAMS._winWidth,
    height: GLOBAL_PARAMS._winHeight*0.15
  },
  BottomViewInner: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'center',
    height: GLOBAL_PARAMS._winHeight*0.11
  },
  BottomViewInnerImage: {
    width: GLOBAL_PARAMS.widthAuto(40),
    height: GLOBAL_PARAMS.widthAuto(40),
    marginLeft: GLOBAL_PARAMS.widthAuto(30),
    marginRight: GLOBAL_PARAMS.widthAuto(30)
  },
  //renderDividerView
  DividerView: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-around',
  },
  Divider:{
    width: GLOBAL_PARAMS._winWidth*0.3,
    marginLeft: GLOBAL_PARAMS.em(10),
    marginRight: GLOBAL_PARAMS.em(10),
    height:1,
    backgroundColor: '#EBEBEB'
  },
  DividerText: {
    fontSize: GLOBAL_PARAMS.em(16),
    color: '#666666',
    flex: 1,
    textAlign: 'center',
  },
}

export default common;