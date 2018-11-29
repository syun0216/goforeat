import React,{ Component } from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback, Platform, TextInput, Text } from 'react-native';
import PropTypes from 'prop-types';
import CommonModal from './CommonModal';
import Share from 'react-native-share';
//api
import { popupComment, addComment } from '../api/request';
//utils
import {em, _winWidth, _winHeight} from '../utils/global_params';
import ToastUtils from '../utils/ToastUtil';
import Color from '../utils/Colors';
//components
import CommonBottomBtn from '../components/CommonBottomBtn';
import LoadingModal from '../components/LoadingModal';

const shareOptions = { //分享優惠券信息
  url: 'http://h5.goforeat.hk',
  message: '日日有得食',
  title: '分享有得食搶優惠券'
};

const commentKeyWord = {
  0: '暫不評論',
  1: '非常差',
  2: '差',
  3: '一般',
  4: '好',
  5: '非常好'
};

const styles = StyleSheet.create({
  popupDialogContainer: {
    position: 'relative',
    // borderWidth: 10,
    // borderColor: 'transparent',
    overflow:'hidden'
  },
  topImg: {
    width: '100%',
    height: em(99),
    position: 'absolute',
    top: em(-22),
    left: 0
  },
  topTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: em(40),
    flexDirection: 'row'
  },
  topTitleText: {
    color: '#ef3f15',
    fontSize: em(22),
    // marginBottom: em(10),
  },
  foodNameText: {
    marginRight: em(8),
    marginLeft: em(8),
  },
  content: {
    padding: em(16)
  },
  contentImg: {
    width: '100%',
    height: em(250),
    borderRadius: em(15),
  },
  emojiContainer:{
    flexDirection: 'row',
    marginTop: em(12),
    marginBottom: em(10),
    justifyContent: 'space-between'
  },
  emoji: {
    width: em(35),
    height: em(35)
  },
  commentText: {
    textAlign: 'center',
    marginBottom: em(10),
  },
  Input: {
    color: '#9d9d9d',
    fontSize: em(13),
    height: Platform.OS == 'ios' ? em(30) : 40 * (_winHeight / 592),
    width: _winWidth * 0.85,
    borderBottomWidth: 1,
    borderBottomColor: '#9d9d9d',
    marginBottom: Platform.OS == "android"?0:em(10),
  },
  tagView: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#9d9d9d',
    borderRadius: 5,
  },
  tagViewActive: {
    borderColor: Color.main_orange
  },
  tagViewText: {
    fontSize: 13,
    color: '#9d9d9d',
  },
  tagViewTextActive: {
    color: Color.main_orange
  }
})

class CommonComment extends Component {

  constructor(props) {
    super(props);
    this.commentText = '';
    this.isCommentSubmit = false;
    this.state = {
      currentComment: null,
      currentStar: 5,
      btnContent: '推薦好友領優惠券',
      modalVisible: false,
      commentGroup: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: []
      }
    };
  }

  componentDidMount() {
    this._commentPopup();
  }

  //api
  _commentPopup() {
    popupComment().then(data => {
      if(data.ro.respCode == '0000') {
        this.setState({
          currentComment: data.data,
          modalVisible: true
        })
      }
    });
  }

  _addCommentApi() {
    if(this.state.currentComment == null) {
      return;
    };
    let {currentComment: {orderId}, currentStar} = this.state;
    addComment(orderId, currentStar, this.commentText).then(data => {
      if(data.ro.ok) {
        this.isCommentSubmit = true;
        // this.setState({
        //   modalVisible: false
        // });
      } else {
        ToastUtils.showWithMessage(data.ro.respMsg);
      }
    });
  }

  _addComment() {
    this._addCommentApi();
    if(this.state.currentStar == 5) {
      Share.open(shareOptions)
      .then(info => {
        this.setState({
          modalVisible: false
        });
      })
      .catch((err) => { 
        console.log({err});
      });
    }
  }

  _getComment(val) {
    this.commentText = val;
  }

  _closeModal() {
    this.setState({
      currentStar: 0
    }, () => {
      this._addCommentApi()
    })
  }

  _renderEmojiBtn({defaultImage, activeImage, name, val}) {
    return (
      <TouchableWithoutFeedback key={name} onPress={() => {
        this.setState({
          currentStar: val
        },() => {
          if(this.state.currentStar == 5) {
            this.setState({
              btnContent: '推薦好友領優惠券'
            })
          } else {
            this.setState({
              btnContent: '確認提交'
            })
          }
        })
      }} style={styles.emoji}>
        <Image source={this.state.currentStar == val ? activeImage : defaultImage} style={styles.emoji}/>
      </TouchableWithoutFeedback>
    )
  }

  _renderTagView() {
    const { currentStar } = this.state;
    return (
      <View style={[styles.tagView]}>
        <Text style={[styles.tagViewText]}>{commentKeyWord[currentStar]}</Text>
      </View>
    )
  }

  _renderCommentView() {
    const emoji_arr = [
      {defaultImage: require('../asset/crazy-normal.png'), activeImage: require('../asset/crazy-press.png'), name: 'crazy', val: 1},
      {defaultImage: require('../asset/hard-normal.png'), activeImage: require('../asset/hard-press.png'), name: 'hard', val: 2},
      {defaultImage: require('../asset/allright-normal.png'), activeImage: require('../asset/allright-press.png'), name: 'allright', val: 3},
      {defaultImage: require('../asset/well-normal.png'), activeImage: require('../asset/well-press.png'), name: 'well', val: 4},
      {defaultImage: require('../asset/delicious-normal.png'), activeImage: require('../asset/delicious-press.png'), name: 'delicious', val: 5},
    ];
    const {currentStar,currentComment: {orderName, picture}} = this.state;
    const defaultImg = "https://img.xiumi.us/xmi/ua/18Wf8/i/98c314a76260a9634beecfd27c28770d-sz_80962.jpg?x-oss-process=style/xmr";

    return (
      <View>
        {/*<Image style={styles.topImg} reasizeMode="contain" source={require('../asset/commentTop.png')}/>*/}
        <View style={styles.topTitle}>
          <Text style={[styles.topTitleText, styles.foodNameText]} numberOfLines={1}>{orderName || '有得食'}</Text>
        </View>
        <View style={styles.content}>
          <Image style={styles.contentImg} source={{uri: picture || defaultImg}}/>
          <View style={styles.emojiContainer}>
            {
              emoji_arr.map(v => this._renderEmojiBtn(v))
            }
            </View>
          <Text style={[styles.commentText,{color: currentStar < 3 ? '#ccc' : currentStar<= 4 ? '#f7ba2a' : '#ff630f'}]}>{commentKeyWord[currentStar]}</Text>
          <TextInput allowFontScaling={false} style={styles.Input} underlineColorAndroid="transparent" placeholderTextColor="#9d9d9d" 
          placeholder="您的評價" clearButtonMode="while-editing" onChangeText={(val) => this._getComment(val)}/>
          <CommonBottomBtn clickFunc={() => this._addComment()}>{this.state.btnContent}</CommonBottomBtn>
        </View>
      </View>
    )
  }


  render() {
    const { modalVisible, currentComment } = this.state;
    return (
      <CommonModal modalVisible={modalVisible} title="填寫評論領優惠券" closeFunc={() => this.setState({modalVisible: false})}>
        {currentComment && this._renderCommentView()}
      </CommonModal>
    )
  }
}


CommonComment.propsType = {
  modalVisible: PropTypes.bool
}

export default CommonComment;

