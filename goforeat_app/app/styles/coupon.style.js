import {Platform, StyleSheet} from 'react-native';
import {em,} from '../utils/global_params';

export default StyleSheet.create({
  CouponContainer: {
    backgroundColor: '#efefef',
    padding: em(20),
    paddingLeft: em(12),
    paddingRight: em(12)
  },
  CouponItemView: {
    height: em(120),
    borderRadius: em(8),
    backgroundColor: '#fff',
    margin: em(10)
  },
  ItemTop: {
    backgroundColor: '#ef7333',
    height: em(80),
    borderTopLeftRadius: em(8),
    borderTopRightRadius: em(8),
    position:'relative',
    paddingLeft: em(12),
    paddingRight: em(12),
    flexDirection: 'row',
    zIndex: 10
  },
  PriceContainer: {
    flexDirection: 'row',
    height: em(80),
    alignItems: 'center',
  },
  Unit: {
    color: '#fff',
    fontSize: em(20),
    marginBottom: em(-20),
  },
  Price: {
    color: '#fff',
    fontSize: em(60),
    fontWeight: '800',
  },
  Content: {
    height: em(80),
    justifyContent:'center',
    marginLeft: em(20),
    position: 'absolute',
    left: em(92)
  },
  ContentTop: {
    fontSize: em(14),
    color: '#fff',
    marginBottom: em(5)
  },
  ContentBottom: {
    fontSize: em(24),
    color: '#fff'
  },
  CouponBorder: {
    width: "100%",
    marginTop: -5,
  },
  ItemBottom: {
    backgroundColor: '#fff',
    height: em(40),
    borderBottomLeftRadius: em(8),
    borderBottomRightRadius: em(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: em(12),
    paddingRight: em(12)
  },
  ItemBottomLeft: {
    color: '#ef7333',
    fontSize: em(14),
    marginTop: em(-5)
  },
  ItemBottomRight: {
    color: '#999',
    fontSize: em(14),
    marginTop: em(-5)
  },
  Status: {
    height: em(80),
    justifyContent: 'center',
    alignItems:'center',
    position: 'absolute',
    right: em(12),
    zIndex: 10
  },
  UseBtn: {
    width: em(152/2),
    height: em(28),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: em(14)
  },
  BtnText: {
    fontSize: em(14),
    color: '#ef7333'
  },
  StatusImg: {
    width: em(70),
    height: em(70),
    marginTop: em(32),
    marginRight: em(8),
    zIndex: 10
  },
  isUsed: {
    backgroundColor: '#c7c7c7'
  },
  isUsedColor: {
    color: '#c7c7c7'
  }
});