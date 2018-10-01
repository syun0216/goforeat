import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FlatList,RefreshControl,Text,View} from 'react-native';
//utils
import GLOBAL_PARAMS from '../utils/global_params';
import ToastUtil from '../utils/ToastUtil';
//components
import Loading from '../components/Loading';
import ListFooter from '../components/ListFooter';
import ErrorPage from '../components/ErrorPage';
import BlankPage from '../components/BlankPage';
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
    console.log(this.props);
    this.state = {
      listData: [],
      loadingStatus: {
        first: LOADING,
        next: LOADING
      },
      refreshing:false,
      i18n: I18n[props.screenProps.language],
    }
  }

  componentDidMount() {
    this._requestFirstPage();
  }

  init() {
    requestParams.currentOffset = 0;
    requestParams.nextOffset = 0;
  }

  getData(offset, successCallback, failCallback) {
    const { extraParams } = this.props;
    let _requestParams = {
      offset
    };
    if(Object.keys(extraParams).length > 0) {
      _requestParams = Object.assign(_requestParams, extraParams);
    }
    this.props.requestFunc(_requestParams).then(data => {
      if(data.ro.ok) {
        successCallback(data.data.list);
      }else{
        if(data.ro.respCode == "10006" || data.ro.respCode == "10007") {
          this.props.screenProps.userLogout();
          this.props.navigation.goBack();
        }
        ToastUtil.showWithMessage(data.ro.respMsg);
        failCallback && failCallback()
      }
    }, () => {
      ToastUtil.showWithMessage(i18n.common_tips.network_err);
    });
  }

  _requestFirstPage() {
    this.getData(requestParams.nextOffset, (data) => {
      console.log(data);
      if(data.length == 0) {
        this.setState({
          loadingStatus: {
            first: NO_DATA
          }
        });
        return;
      }
      this.setState({
        listData: data,
        loadingStatus: {
          first: LOAD_SUCCESS
        },
        refreshing: false
      });
    },() => {
      this.setState({
        loadingStatus: {
          first: LOAD_FAILED
        }
      });
    });
  }

  _requestNextPage() {
    this.getData(requestParams.nextOffset, data => {
      if(data.length == 0) {
        requestParams.nextOffset = requestParams.currentOffset;
        let _temp = Object.assign({next: NO_MORE_DATA}, this.state.loadingStatus);
        this.setState({
          loadingStatus: _temp,
          listData: this.state.listData.concat(data),
        });
        return;
      }
      this.setState({
        listData: this.state.listData.concat(data),
        loadStatus: {
          next: LOADING
        }
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
      loadingStatus: {
        first: LOADING
      }
    }, () => {
      this.init();
      this._requestFirstPage();
    });
  }

  _onErrorToRequestNextPage() {
    this.setState({
      loadingStatus:{
        next:LOADING
      }
    })
    requestParams.nextOffset += this.props.offset;
    this._requestNextPage();
  }

  _onEndReach() {
    requestParams.nextOffset += this.props.offset;
    if(this.state.loadingStatus.next == NO_MORE_DATA) return;
    this._requestNextPage();
  }

  _renderCommonListView() {
    const { loadingStatus: {next}, refreshing } = this.state;
    const { isRefreshControlShow } = this.props;
    const CustomRefresh = () => (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={() => this._onRefreshToRequestFirstPageData()}
      />
    )
    return (
      <FlatList 
        data={this.state.listData}
        renderItem={({item, index}) => this._renderCommonListItemView(item, index)}
        keyExtractor={(item,index) => index}
        onEndReachedThreshold={0.01}
        onEndReached={() => this._onEndReach()}
        ListFooterComponent={() =>(
          <ListFooter loadingStatus={next} errorToDo={() => this._onErrorToRequestNextPage()} {...this.props}/>
        )}
        refreshControl={
          isRefreshControlShow ? <CustomRefresh /> : null
        }
      />
    )
  }

  _renderCommonListItemView(item, index) {
    console.log(999);
    if(this.props.renderItem) {
      return this.props.renderItem(item, index);
    }
    return (
      <Text>{index}</Text>
    ) 
  }

  render() {
    const { loadingStatus: {first}, i18n } = this.state;
    const Error = () => (
      <ErrorPage errorTips={i18n.common_tips.network_err} errorToDo={this._onErrorRequestFirstPage}/>
    )
    const Blank = () => (
      <BlankPage message={i18n.common_tips.no_data}/>
    )
    return (
      <View>
        { first == LOADING ? <Loading /> : null }
        { first == LOAD_FAILED ?  <Error /> : null }
        { first == NO_DATA ?  <Blank /> : null}
        { first == LOAD_SUCCESS ? this._renderCommonListView() : null }
      </View>
    )
  }
}

CommonFlatList.propsType = {
  requestFunc: PropTypes.func,
  renderItem: PropTypes.func,
  isRefreshControlShow: PropTypes.bool,
  offset: PropTypes.number,
  extraParams: PropTypes.object
};

CommonFlatList.defaultProps = {
  isRefreshControlShow: true,
  offset: 5,
  extraParams: {}
}