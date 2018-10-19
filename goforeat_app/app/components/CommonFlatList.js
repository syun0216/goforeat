import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FlatList,RefreshControl,Text,View} from 'react-native';
//utils
import GLOBAL_PARAMS, {isEmpty} from '../utils/global_params';
import ToastUtil from '../utils/ToastUtil';
//components
import Loading from '../components/Loading';
import ListFooter from '../components/ListFooter';
import ErrorPage from '../components/ErrorPage';
import BlankPage from '../components/BlankPage';
import Divider from '../components/Divider';
//i18n
import I18n from '../language/i18n';

let requestParams = {
  nextOffset: 0,
  currentOffset: 0
};

const { httpStatus: {LOADING, LOAD_SUCCESS, LOAD_FAILED, NO_DATA, NO_MORE_DATA} } = GLOBAL_PARAMS;

export default class CommonFlatList extends Component{
  constructor(props) {
    super(props);
    this._timer = null;
    this.state = {
      listData: [],
      firstPageLoading: LOADING,
      nextPageLoading: LOADING,
      loadingStatus: {
        first: LOADING,
        next: LOADING
      },
      refreshing:false,
      i18n: I18n[props.screenProps.language],
    }
  }

  componentDidMount() {
    this.init();
    this._timer = setTimeout(() => {
      this._requestFirstPage();
      clearTimeout(this._timer);
    },300);
  }

  componentWillUnmount() {
    this.init();
    clearTimeout(this._timer);
  }

  init() {
    requestParams.currentOffset = 0;
    requestParams.nextOffset = 0;
  }

  getData(offset, successCallback, failCallback) {
    const { extraParams } = this.props;
    const { i18n } = this.state;
    let _requestParams = {
      offset
    };
    if(Object.keys(extraParams).length > 0) {
      _requestParams = Object.assign(_requestParams, extraParams);
    }
    this.props.requestFunc(_requestParams).then(data => {
      if(data.ro.ok) {
        successCallback(data.data.list);
        this.getFlatListCount();
      }else{
        if(data.ro.respCode == "10006" || data.ro.respCode == "10007") {
          this.props.screenProps.userLogout();
          this.props.navigation.goBack();
        }
        ToastUtil.showWithMessage(data.ro.respMsg);
      }
    }, () => {
      if(typeof failCallback != undefined) {
        failCallback();
      }
      ToastUtil.showWithMessage(i18n.common_tips.network_err);
    });
  }

  // public 
  outSideRefresh() {
    this.init();
    this.setState({
      firstPageLoading: LOADING
    }, () => {
      this._requestFirstPage();
    });
  }

  getFlatListCount() {
    if(typeof this.props.getCount == 'undefined') return;
    this.props.getCount(this.state.listData.length);
  }

  //private
  _requestFirstPage() {
    this.getData(requestParams.nextOffset, (data) => {
      if(data.length == 0) {
        this.setState({
          listData: data,
          firstPageLoading: NO_DATA,
          refreshing: false
        });
        return;
      }
      this.setState({
        listData: data,
        firstPageLoading: LOAD_SUCCESS,
        refreshing: false
      });
    },() => {
      this.setState({
        firstPageLoading: LOAD_FAILED
      });
    })
  }

  _requestNextPage() {
    this.getData(requestParams.nextOffset, data => {
      if(data.length == 0) {
        requestParams.nextOffset = requestParams.currentOffset;
        this.setState({
          nextPageLoading: NO_MORE_DATA,
          listData: this.state.listData.concat(data),
        });
        return;
      }
      this.setState({
        listData: this.state.listData.concat(data),
        nextPageLoading: LOADING
      });
      requestParams.currentOffset = requestParams.nextOffset;
    });
  }

  _onRefreshToRequestFirstPageData() {
    this.setState({
      refreshing: true
    }, () => {
      this.init();
      this._requestFirstPage();
    });
  }

  _onErrorRequestFirstPage() {
    this.setState({
      firstPageLoading: LOADING
    }, () => {
      this.init();
      this._requestFirstPage();
    });
  }

  _onErrorToRequestNextPage() {
    this.setState({
      nextPageLoading: LOADING
    })
    requestParams.nextOffset += this.props.offset;
    this._requestNextPage();
  }

  _onEndReach() {
    requestParams.nextOffset += this.props.offset;
    if(this.state.nextPageLoading == NO_MORE_DATA) return;
    this._requestNextPage();
  }

  _renderCommonListView() {
    const { nextPageLoading, refreshing } = this.state;
    return (
      <FlatList 
        data={this.state.listData}
        renderItem={({item, index}) => this._renderCommonListItemView(item, index)}
        keyExtractor={(item,index) => index}
        onEndReachedThreshold={0.01}
        onEndReached={() => this._onEndReach()}
        ItemSeparatorComponent={() => this._renderItemDivider()}
        ListHeaderComponent={() => this._renderHeader()}
        ListFooterComponent={() =>(
          <ListFooter loadingStatus={nextPageLoading} errorToDo={() => this._onErrorToRequestNextPage()}/>
        )}        
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => this._onRefreshToRequestFirstPageData()}
          />
        }
      />
    )
  }

  _renderHeader() {
    const { renderHeader } = this.props;
    if(isEmpty(renderHeader)) {
      return null;
    }
    return renderHeader();
  }

  _renderItemDivider() {
    const { isItemSeparatorShow } = this.props;
    if(!isItemSeparatorShow) return null;
    return (
      <Divider bgColor="#efefef" height={10}/>
    )
  }

  _renderCommonListItemView(item, index) {
    if(this.props.renderItem) {
      return this.props.renderItem(item, index);
    }
    return (
      <Text>{index}</Text>
    ) 
  }

  render() {
    const { firstPageLoading, i18n } = this.state;
    const { isBlankInfoBtnShow, blankBtnMessage, blankBtnFunc, style } = this.props
    const Error = () => (
      <ErrorPage errorTips={i18n.common_tips.network_err} errorToDo={() => this._onErrorRequestFirstPage()}/>
    )
    const Blank = () => (
      <BlankPage message={blankBtnMessage} hasBottomBtn={isBlankInfoBtnShow} clickFunc={blankBtnFunc} />
    )
    return (
      <View style={[{flex: 1}, style]}>
        { firstPageLoading == LOADING ? <Loading /> : null }
        { firstPageLoading == LOAD_FAILED ?  <Error /> : null }
        { firstPageLoading == NO_DATA ?  <Blank /> : null}
        { firstPageLoading == LOAD_SUCCESS ? this._renderCommonListView() : null }
      </View>
    )
  }
}

CommonFlatList.propsType = {
  requestFunc: PropTypes.func,
  renderItem: PropTypes.func,
  renderHeader: PropTypes.func,
  isRefreshControlShow: PropTypes.bool,
  isBlankInfoBtnShow: PropTypes.bool,
  isItemSeparatorShow: PropTypes.bool,
  blankBtnMessage: PropTypes.string,
  blankBtnFunc: PropTypes.func,
  offset: PropTypes.number,
  extraParams: PropTypes.object,
  getCount: PropTypes.func,
  style: PropTypes.object
};

CommonFlatList.defaultProps = {
  isRefreshControlShow: true,
  isItemSeparatorShow: false,
  offset: 5,
  extraParams: {},
  isBlankInfoBtnShow: false,
  blankBtnFunc: () => {},
  blankBtnMessage: '馬上有得食',
  style: {}
}