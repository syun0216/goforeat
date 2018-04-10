const ViewStatus = {

    //空白状态
    VIEW_STATUS_INITIAL: 0,

    //网络导致请求失败
    VIEW_STATUS_REQUEST_NETWORK_ERROR: 1,

    //返回数据非正常状态
    VIEW_STATUS_DATA_REQUEST_INVALID: 2,

    //正确数据状态
    VIEW_STATUS_DATA: 3,
}

module.exports = ViewStatus;
