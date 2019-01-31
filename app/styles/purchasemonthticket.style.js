import { StyleSheet } from "react-native";
import GLOBAL_PARAMS, { em } from "../utils/global_params";

export default StyleSheet.create({
  topTitleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: GLOBAL_PARAMS._winWidth*.03,
    paddingRight: GLOBAL_PARAMS._winWidth*.025,
    marginBottom: em(20)
  },
  topTitle: {
    fontSize: em(35),
    fontWeight: '700',
    marginBottom: em(20)
  },
  subTitle: {
    color: '#959595',
    fontSize: em(18),
    marginLeft:em(5)
  },
  img: {
    width: em(100),
    height: em(100)
  },
  ticketItem: {
    width: GLOBAL_PARAMS._winWidth*.95,
    height: em(100),
    marginLeft: GLOBAL_PARAMS._winWidth*.025,
    borderWidth: 3,
    borderColor: '#e8e9ed',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: em(8),
    marginBottom: em(10),
    padding: em(20)
  },
  activeItem: {
    borderColor: '#fe4908'
  },
  amount:{
    fontSize: em(18),
    color: '#333',
    marginBottom: em(10)
  },
  price: {
    fontSize: em(25),
    color: '#666',
    marginBottom: em(5)
  },
  oriPrice:{
    textDecorationLine:'line-through',
    color: '#959595',
    fontSize: em(14),
    textAlign: 'right'
  },
  date:{
    color: '#666',
    fontSize: em(16),
  },
  footer: {
    backgroundColor: '#fff',
    paddingLeft: GLOBAL_PARAMS._winWidth*.025,
    paddingRight: GLOBAL_PARAMS._winWidth*.025,
    height: em(80)
  },
  unit: {
    fontSize: em(14),
    color: '#333',
    marginTop: em(10),
    marginRight: em(10),
  },
  total: {
    fontSize: em(30),
    color: '#333',
    fontWeight: '700'
  },
  submitBtn: {
    width: em(130),
    height: em(50),
    borderRadius: em(50),
    backgroundColor: '#000',
    justifyContent:'center',
    alignItems:'center'
  },
  submitBtnText: {
    color: '#fff',
    fontSize:em(17)
  }
});