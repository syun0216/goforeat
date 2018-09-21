import {StyleSheet,Platform} from 'react-native';
import {em} from '../utils/global_params';

export default StyleSheet.create({
  UserInfoContent: {
    backgroundColor: '#efefef',
  },
  FinishBtn: {
    paddingRight: 10
  },
  FinishText: {
    color: '#fff'
  },
  AvatarView: {
    padding: em(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  AvatarImg: {
    width: em(60),
    height: em(60),
    borderRadius: em(30),
    marginBottom: 10,
  },
  AccountDisable: {
    color: '#ccc'
  },
  ChangeBtn: {
    color: '#333',
    padding: em(10)
  },
  Segment: {
    backgroundColor: 'transparent'
  },
  SegmentActiveBtn: {
    backgroundColor: '#ff630f',
    borderColor: '#ff630f'
  },
  SegmentDefaultBtn: {
    backgroundColor: '#fff',
    borderColor: '#ff630f'
  },
  SegmentActiveText: {
    color: '#fff'
  },
  SegmentDefaultText: {
    color: '#333'
  }

})
