import React,{ Component } from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback, Platform, TextInput, Text } from 'react-native';
import { Footer } from 'native-base';
import PropTypes from 'prop-types';
import CommonModal from './CommonModal';
import Share from 'react-native-share';
import FastImage from 'react-native-fast-image';
//api
import { popupComment, addComment } from '../api/request';
//utils
import GLOBAL_PARAMS, {em, _winWidth, _winHeight} from '../utils/global_params';
import ToastUtils from '../utils/ToastUtil';
import Color from '../utils/Colors';
//components
import CommonBottomBtn from '../components/CommonBottomBtn';
import LoadingModal from '../components/LoadingModal';

const shareOptions = { //分享優惠券信息
  url: 'https://m.goforeat.hk/#',
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
    flexDirection: 'row'
  },
  topTitleText: {
    color: '#ef3f15',
    fontSize: em(22),
    marginTop: em(10),
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
    height: em(180),
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
    marginTop: em(5),
    padding: em(10),
    color: '#9d9d9d',
    fontSize: em(13),
    height: em(80),
    backgroundColor: '#ece8f4',
    borderRadius: 5,
    // height: Platform.OS == 'ios' ? em(30) : 40 * (_winHeight / 592),
    width: _winWidth * 0.85,
    textAlignVertical: "top"
    // marginBottom: Platform.OS == "android"?0:em(10),
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagView: {
    padding: 10,
    marginRight: 5,
    marginBottom: 5,
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
      commentTags: ["文字評價"]
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
    let {commentTags} = this.state;
    this.commentText && (commentTags.push(this.commentText),commentTags.splice(commentTags.indexOf('文字評價'),1));
    commentTags = commentTags.join(',');
    let {currentComment: {orderId}, currentStar} = this.state;
    addComment(orderId, currentStar, commentTags).then(data => {
      if(data.ro.ok) {
        this.isCommentSubmit = true;
        this.setState({
          modalVisible: false
        });
      } else {
        ToastUtils.showWithMessage(data.ro.respMsg);
      }
    });
  }

  _addComment() {
    this._addCommentApi();
  }

  _share() {
    setTimeout(() => {
      Share.shareSingle(Object.assign(shareOptions, {
        "social": "whatsapp"
      }))
      .then(info => {
        this.setState({
          modalVisible: false
        });
      })
      .catch((err) => { 
        alert(`WhatsApp:${err && err.error && err.error.message}`)
        this.setState({
          modalVisible: false
        });
        return;
      });
    },300);
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
    let commentArr = [];
    switch(currentStar) {
      case 1: {
        commentArr = ['服務差','味道差','菜品差'];
      };break;
      case 2: {
        commentArr = ['服務一般','味道一般','溫度不夠'];
      };break;
      case 3: case 4: case 5: {
        commentArr = ['味道贊','服務好','菜品健康','準時','溫度夠']
      };break;
    }
    commentArr.push('文字評價');
    const tag = (item, key) => (
      <TouchableWithoutFeedback onPress={() => {
        const {commentTags} = this.state;
        if(commentTags.indexOf(item) > -1) {
          commentTags.splice(commentTags.indexOf(item), 1);
        } else {
          commentTags.push(item);
        }
        console.log('commentTags :', commentTags);
        this.setState({
          commentTags: commentTags
        })
      }} key={key}>
        <View style={[styles.tagView,this.state.commentTags.indexOf(item)>-1?styles.tagViewActive: null]}>
          <Text style={[styles.tagViewText,this.state.commentTags.indexOf(item)>-1?styles.tagViewTextActive: null]}>{item}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
    return (
      <View style={styles.tagContainer}>
        {
          commentArr.map((item,idx) => tag(item, idx))
        }
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
    console.log(this.state.commentTags);
    return (
      <View>
        {/*<Image style={styles.topImg} reasizeMode="contain" source={require('../asset/commentTop.png')}/>*/}
        <View style={styles.topTitle}>
          <Text style={[styles.topTitleText, styles.foodNameText]} numberOfLines={1}>{orderName || '有得食'}</Text>
        </View>
        <View style={styles.content}>
          <FastImage style={styles.contentImg} source={{uri: picture || defaultImg}} resizeMode={FastImage.resizeMode.cover}/>
          <View style={styles.emojiContainer}>
            {
              emoji_arr.map(v => this._renderEmojiBtn(v))
            }
            </View> 
          {/*<Text style={[styles.commentText,{color: currentStar < 3 ? '#ccc' : currentStar<= 4 ? '#f7ba2a' : '#ff630f'}]}>{commentKeyWord[currentStar]}</Text>*/}
          {this._renderTagView()}
          {this.state.commentTags.indexOf('文字評價')> -1 ?<TextInput numberOfLines={4} multiline allowFontScaling={false} style={styles.Input} underlineColorAndroid="transparent" placeholderTextColor="#9d9d9d" 
          placeholder="您的評價" clearButtonMode="while-editing" onChangeText={(val) => this._getComment(val)}/> : null}
          <View style={{flexDirection: 'row',justifyContent: 'space-around',}}>
            <CommonBottomBtn style={{width: GLOBAL_PARAMS._winWidth * .2}} clickFunc={() => this._share()}>分享</CommonBottomBtn>
            <CommonBottomBtn style={{width: GLOBAL_PARAMS._winWidth * .7}} clickFunc={() => this._addComment()}>填寫評論即可領取優惠券</CommonBottomBtn>
          </View>
        </View>
      </View>
    )
  }


  render() {
    const { modalVisible, currentComment } = this.state;
    return (
      <CommonModal modalVisible={modalVisible} title="用戶評論頁" closeFunc={() => this._closeModal()}>
        {currentComment && this._renderCommentView()}
      </CommonModal>
    )
  }
}


CommonComment.propsType = {
  modalVisible: PropTypes.bool
}

export default CommonComment;

