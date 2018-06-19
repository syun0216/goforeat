import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Animated,
  Easing,
  ListView,
  RefreshControl
} from "react-native";
import {
  Container,
  Header,
  ListItem,
  Left,
  Body,
  Right,
  Button,
  Text,
  Icon
} from "native-base";
import Image from 'react-native-image-progress';
//api
import api from "../api";
import source from "../api/CancelToken";
//components
import GoodsSwiper from "../components/Swiper";
import Loading from "../components/Loading";
import ErrorPage from "../components/ErrorPage";
import Divider from "../components/Divider";
import Rating from "../components/Rating";
import ScrollTop from "../components/ScrollTop";
import Tags from "../components/Tags";
import DropdownModal from "../components/DropdownModal";
//utils
import GLOBAL_PARAMS from "../utils/global_params";
import Colors from "../utils/Colors";
import ToastUtil from "../utils/ToastUtil";
import ListFooter from "../components/ListFooter";
import _ from "lodash";
import i18n from "../language/i18n";
import filterData from '../utils/filterData';

let requestParams = {
  status: {
    LOADING: 0,
    LOAD_SUCCESS: 1,
    LOAD_FAILED: 2,
    NO_MORE_DATA: 3
  },
  currentPage: 1,
  isFirstTime: false //判断是不是第一次触发sectionlist的onendreach方法
};

let list_data = [];

const diffplatform = {
  preventViewTop: Platform.select({ ios: 62, android: 0 })
};

export default class GoodsListPageView extends Component {
  _isMounted = false; // 監測組件是否加載完畢
  sectionList = null;
  canteenDetail = [];

  constructor(props) {
    super(props);
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      loading: false,
      canteenDetail: ds.cloneWithRows([]),
      adDetail: [],
      canteenOptions: null,
      showFilterList: false,
      isDropdownModalShow: false,
      httpRequest: null,
      positionTop: new Animated.Value(0),
      positionBottom: new Animated.Value(0),
      firstPageLoading: GLOBAL_PARAMS.httpStatus.LOADING,
      pullUpLoading: GLOBAL_PARAMS.httpStatus.LOADING,
      i18n: i18n[this.props.screenProps.language],
      refreshing: false
    };
  }

  componentWillMount = () => {
    this.getCanteenList();
    this.getCanteenOption();
    // console.log(GLOBAL_PARAMS._winWidth)
  };

  componentDidMount() {
    // console.log(111,this.props);
    this._isMounted = true;
    
  }

  componentWillUnmount = () => {
    this._isMounted = false;
    source.cancel();
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      i18n: i18n[nextProps.screenProps.language]
    });
  }

  //api function
  getCanteenList = filter => {
    api.getCanteenList(requestParams.currentPage, filter).then(
      data => {
        // console.log(data)
        this.getAd();
        if (this._isMounted) {
          if (data.status === 200) {
            if (this.state.refreshing) {
              ToastUtil.showWithMessage("刷新成功");
            }
            list_data = data.data.data;
            this.setState({
              canteenDetail: this.state.canteenDetail.cloneWithRows(
                data.data.data
              ),
              firstPageLoading: GLOBAL_PARAMS.httpStatus.LOAD_SUCCESS,
              refreshing: false
            });
          } else {
            this.setState({
              // canteenDetail: data.data.data,
              firstPageLoading: GLOBAL_PARAMS.httpStatus.LOAD_FAILED,
              refreshing: false
            });
          }
        }
      },
      () => {
        ToastUtil.showWithMessage("网络请求出错");
        this.setState({
          firstPageLoading: GLOBAL_PARAMS.httpStatus.LOAD_FAILED,
          refreshing: false
        });
      }
    );
  };

  // getCanteenOption = () => {
  //   api.getCanteenOptions().then(
  //     data => {
  //       if (data.status === 200) {
  //         const _newCanteenOptionsArr = [];
  //         for (let i in data.data) {
  //           data.data[i].unshift(["default", "全部"]);
  //           data.data[i] = _.chunk(data.data[i], 3);
  //           switch (i) {
  //             case "areas":
  //               _newCanteenOptionsArr.push({
  //                 name: "地區",
  //                 enName: "areas",
  //                 value: data.data[i]
  //               });
  //               break;
  //             case "categories":
  //               _newCanteenOptionsArr.push({
  //                 name: "分類",
  //                 enName: "categories",
  //                 value: data.data[i]
  //               });
  //               break;
  //             case "seats":
  //               _newCanteenOptionsArr.push({
  //                 name: "人數",
  //                 enName: "seats",
  //                 value: data.data[i]
  //               });
  //               break;
  //           }
  //         }
  //         this.setState({
  //           canteenOptions: _newCanteenOptionsArr
  //         });
  //       }
  //     },
  //     () => {
  //       ToastUtil.showWithMessage("网络请求出错");
  //     }
  //   );
  // };

  getCanteenOption = () => {
     const _newCanteenOptionsArr = [];
     let _deepFilter = JSON.parse(JSON.stringify(filterData));
          for (let i in _deepFilter) {
            _deepFilter[i].unshift(["default", "全部"]);
            _deepFilter[i] = _.chunk(_deepFilter[i], 3);
            switch (i) {
              case "areas":
                _newCanteenOptionsArr.push({
                  name: "地區",
                  enName: "areas",
                  value: _deepFilter[i]
                });
                break;
              case "categories":
                _newCanteenOptionsArr.push({
                  name: "分類",
                  enName: "categories",
                  value: _deepFilter[i]
                });
                break;
              case "seats":
                _newCanteenOptionsArr.push({
                  name: "人數",
                  enName: "seats",
                  value: _deepFilter[i]
                });
                break;
            }
          }
          this.setState({
            canteenOptions: _newCanteenOptionsArr
          });
  };

  getAd = () => {
    api.adSpace().then(data => {
      if (data.status === 200) {
        // console.log(data);
        this.setState({
          adDetail: data.data.data
        });
      }
    });
  };

  // common function

  _onRefreshToRequestFirstPageData() {
    this.setState({
      refreshing: true
    });
    requestParams.currentPage = 1;
    this.getCanteenList();
  }

  _onErrorRequestFirstPage = () => {
    this.setState({
      firstPageLoading: GLOBAL_PARAMS.httpStatus.LOADING
    });
    this._onRequestFirstPageData();
  };

  _getListViewData(sview) {
    if (sview.nativeEvent.contentOffset.y > 300) {
      Animated.spring(this.state.positionBottom, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear
      }).start();
    } else {
      Animated.timing(this.state.positionBottom, {
        toValue: 0,
        duration: 200,
        easing: Easing.linear
      }).start();
    }
  }

  _requestNextDetailList() {
    api.getCanteenList(requestParams.currentPage).then(
      data => {
        if (data.status === 200) {
          if (data.data.data.length === 0) {
            requestParams.currentPage--;
            this.setState({
              // canteenDetail:this.state.canteenDetail.concat(data.data.data),
              pullUpLoading: GLOBAL_PARAMS.httpStatus.NO_MORE_DATA
            });
            return;
          }
          list_data = list_data.concat(data.data.data);
          this.setState({
            canteenDetail: this.state.canteenDetail.cloneWithRows(list_data),
            pullUpLoading: GLOBAL_PARAMS.httpStatus.LOADING
          });
        }
      },
      () => {
        requestParams.currentPage--;
        this.setState({
          pullUpLoading: GLOBAL_PARAMS.httpStatus.LOAD_FAILED
        });
      }
    );
  }

  _onEndReached = () => {
    if (this.state.pullUpLoading === GLOBAL_PARAMS.httpStatus.NO_MORE_DATA) {
      return;
    }
    let _timer = setTimeout(() => {
      requestParams.currentPage++;
      this._requestNextDetailList();
      clearTimeout(_timer);
    }, 1000);
  };

  _onErrorToRequestNextPage() {
    this.setState({
      pullUpLoading: GLOBAL_PARAMS.httpStatus.LOADING
    });
    requestParams.currentPage++;
    this._requestNextDetailList();
  }

  _onRequestFirstPageData = () => {
    requestParams.currentPage = 1;
    this.getCanteenList();
  };

  _onFilterEmptyData = () => {
    requestParams.currentPage = 1;
    this.getCanteenList();
    this.props.screenProps.resetFilter();
  };

  _confirmToFilter = data => {
    // console.log('data',data)
    requestParams.currentPage = 1;
    this.setState({
      isDropdownModalShow: false
    });
    // this._toToggleFilterListView(0)
    let timer = setTimeout(() => {
      clearTimeout(timer);
      this.setState({ firstPageLoading: GLOBAL_PARAMS.httpStatus.LOADING });
      this.getCanteenList(data);
    }, 100);
  };

  _openFilterModal = () => {
    this.setState({
      isDropdownModalShow: true
    });
  };

  //views
  _renderDropDownModal = () => (
    <DropdownModal
      {...this["props"]}
      filterData={this.state.canteenOptions}
      modalVisible={this.state.isDropdownModalShow}
      cancleToDo={() => this.setState({ isDropdownModalShow: false })}
      confirmToDo={data => this._confirmToFilter(data)}
    />
  );

  _renderScrollTopView = () => {
    return this.state.canteenDetail !== null ? (
      <ScrollTop
        toTop={() => {
          // this.sectionList.scrollToLocation({
          //   sectionIndex: 0,
          //   itemIndex: 0,
          //   viewPosition: 0,
          //   viewOffset: 430
          // });
          this.sectionList.scrollTo({ y: 0, animated: true });
        }}
        positionBottom={this.state.positionBottom}
        {...this["props"]}
        color={this.props.screenProps.theme}
      />
    ) : null;
  };

  _renderSubHeader = () => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          height: 50,
          backgroundColor: Colors.main_white,
          borderColor: "#ccc",
          borderBottomWidth: 1
        }}
      >
        <View
          style={{
            flex: 1,
            marginTop: Platform.OS === 'android' ? 0 : 15,
            marginLeft: 10,
          }}
        >
          <Text>- {this.state.i18n.recommend_text} -</Text>
        </View>
        <TouchableOpacity
          onPress={() => this._openFilterModal()}
          style={{
            flex: 1,
            marginBottom: Platform.OS === 'android' ? 0 : 22,
            marginRight: 10,
            alignItems: "center",
            justifyContent: "flex-end",
            flexDirection: "row"
          }}
        >
          <Text style={{ color: this.props.screenProps.theme }}>
            {this.state.i18n.filter_text}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  _renderSectionList = () => {
    return (
      <ListView
        ref={_lview => (this.sectionList = _lview)}
        initialListSize={10}
        pageSize={10}
        dataSource={this.state.canteenDetail}
        renderSectionHeader={() => this._renderSubHeader()}
        renderRow={(rowData, rowId) =>
          this._renderSectionListItem(rowData, rowId)
        }
        renderHeader={() => {
          return this.state.adDetail === null &&
            this.state.canteenDetail.length > 0 ? null : (
            <GoodsSwiper {...this["props"]} adDetail={this.state.adDetail} />
          );
        }}
        renderFooter={() => (
          <ListFooter
            style={{ backgroundColor: Colors.main_white }}
            loadingStatus={this.state.pullUpLoading}
            errorToDo={() => this._onErrorToRequestNextPage()}
          />
        )}
        enableEmptySections={true}
        showsVerticalScrollIndicator
        onEndReached={() => this._onEndReached()}
        onEndReachedThreshold={10}
        scrollRenderAheadDistance={50}
        onScroll={sview => this._getListViewData(sview)}
        removeClippedSubviews={false} //修正安卓轮播图不显示问题
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => this._onRefreshToRequestFirstPageData(this.state.placeSelected.id)}
          />
        }
      />
    );
  };

  _renderSectionListItem = (rowData, rowId) => {
    let { canteenDetail } = this.state;
    let hasImage = rowData.image !== "#";
    let _imgWidth =
      GLOBAL_PARAMS._winWidth < 350 ? GLOBAL_PARAMS._winWidth * 0.2 : 80;
    return (
      <View
        key={rowId}
        // onLayout={(event)=>console.log('event',event.nativeEvent.layout)} //计算view的高度宽度
      >
        <ListItem
          style={{
            backgroundColor: Colors.main_white,
            marginLeft: 0,
            paddingLeft: 10
          }}
          avatar
          key={rowId}
          onPress={() =>
            this.props.navigation.navigate("Content", {
              data: rowData,
              kind: "canteen"
            })
          }
        >
          <Left style={{ marginLeft: 5 }}>
            <View style={{ width: _imgWidth, height: _imgWidth }}>
              <Image
              style={{ width: _imgWidth, height: _imgWidth }}
              imageStyle={{ borderRadius: _imgWidth / 2 }}
              source={{
              uri: !hasImage ? "default_image" : rowData.image,
              cache: "force-cache"
              }}
              />
              
            </View>
          </Left>
          <Body
            style={{
              height: 120,
              borderBottomWidth: 0,
              justifyContent: "center"
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ marginBottom: 10, fontSize: 20 }}
                numberOfLines={1}
              >
                {rowData.name}
              </Text>
              {rowData.takeOut === 1 ? (
                <Tags style={{ marginTop: -10 }} />
              ) : null}
              {rowData.isCooperative === 1 ? (
                <Tags
                  style={{ marginTop: -10, marginLeft: 10 }}
                  message="積"
                  color="#45b97c"
                />
              ) : null}
            </View>

            <Rating rate={rowData.rate} {...this["props"]} />
            <Text note style={{ fontSize: 13, marginBottom: 10 }}>
              {rowData.address.length > 12
                ? rowData.address.substr(0, 11) + "..."
                : rowData.address}
            </Text>
            {/*<View style={{flexDirection:'row',alignItems:'center'}}>
            <View style={{backgroundColor:'#b3b3b3',borderRadius:10,width:80,padding:5,marginRight:10}}>
              <Text style={{color:'#fff',textAlign:'center'}}>0.5公里</Text>
            </View>
            <Text>距離當前位置</Text>
          </View> */}
          </Body>
          <Right
            style={{ borderBottomWidth: 0, justifyContent: "space-around" }}
          >
            <Text
              note
              style={{
                color: Colors.fontBlack,
                fontSize: 16,
                fontWeight: "bold"
              }}
            >
              ${rowData.price}/人
            </Text>
          </Right>
        </ListItem>
        {this.state.canteenDetail.length - 1 === rowId ? null : (
          <Divider height={10} bgColor="transparent" />
        )}
      </View>
    );
  };

  render() {
    const { i18n } = this.state;
    let {
      firstPageLoading,
      showFilterList,
      canteenDetail,
      canteenOptions,
      isDropdownModalShow
    } = this.state;
    return (
      <Container style={{ backgroundColor: Colors.bgColor }}>
        {canteenOptions && isDropdownModalShow
          ? this._renderDropDownModal()
          : null}

        {/*showFilterList ? this._renderPreventClickView() : null*/}
        {/*canteenOptions&&showFilterList ? this._renderFilterView() : null*/}
        {/* {this._renderSubHeader()} */}
        <Header
          style={{
            backgroundColor: this.props.screenProps.theme,
            borderBottomWidth: 0
          }}
          iosBarStyle="light-content"
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Icon
              onPress={() => this.props.navigation.goBack()}
              name="ios-arrow-back"
              size={20}
              style={{ color: "#fff",fontSize: 25, }}
            />
          </View>
          <View
            style={{
              width: GLOBAL_PARAMS._winWidth * 0.6,
              justifyContent: "center"
            }}
          >
            <View style={styles.searchContainer}>
              <Button
                iconRight
                light
                style={styles.searchText}
                onPress={() => this.props.navigation.navigate("Search")}
              >
                <Text
                  style={{
                    color: Colors.deep_gray,
                    textAlignVertical: "center",
                    marginTop: -3
                  }}
                >
                  {i18n.search_text}
                </Text>
                <Icon name="md-search" size={20} style={styles.searchIcon} />
              </Button>
              {/*<TextInput ref={(t) => this.textInput = t} style={styles.searchText}
                onFocus={() => {this.props.navigation.navigate('Search');this.textInput.blur()}}
                placeholder="请输入商店名称" underlineColorAndroid="transparent"/>
        <Icon name="md-search" size={20} style={styles.searchIcon}/>*/}
            </View>
          </View><Right/>
        </Header>

        {firstPageLoading === GLOBAL_PARAMS.httpStatus.LOADING ? (
          <Loading message={i18n.loading_text} />
        ) : firstPageLoading === GLOBAL_PARAMS.httpStatus.LOAD_FAILED ? (
          <ErrorPage
            errorTips={i18n.load_failed}
            errorToDo={this._onErrorRequestFirstPage}
          />
        ) : null}
        {canteenDetail.length === 0 ? (
          <ErrorPage
            style={{ marginTop: -15 }}
            errorToDo={this._onFilterEmptyData}
            errorTips={i18n.nodata}
          />
        ) : null}
        <View style={{ marginBottom: GLOBAL_PARAMS.bottomDistance }}>
          {this._renderSectionList()}
        </View>
        {this._renderScrollTopView()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "rgba(247,247,247,1.0)"
  },
  searchContainer: {
    position: "relative"
  },
  searchText: {
    height: Platform.OS === "android" ? 40 : 35,
    width: GLOBAL_PARAMS._winWidth * 0.7,
    backgroundColor: Colors.main_white,
    borderRadius: 20,
    paddingLeft: 20,
    marginTop: Platform.OS === "ios" ? 0 : 3
  },
  searchIcon: {
    color: Colors.deep_gray,
    position: "absolute",
    fontSize: 18,
    top: Platform.OS === "ios" ? 6 : 11,
    right: 10
  }
});
