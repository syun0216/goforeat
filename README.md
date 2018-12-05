# goforeat（有得食開源app前端部分代碼-僅供參考）
<p align="center">
  <img width="128" src="./display/goforeat.png">
</p>


### android平台 [android 下載地址](https://play.google.com/store/apps/details?id=com.goforeat_app)

### ios平台 [ios 下載地址](https://itunes.apple.com/cn/app/goforeat/id1343559475?mt=8)

### 文檔結構
```
app  
├── actions                                                     actions
│   └── index.js                                                需要處理的actions別名
├── asset                                                       圖標
├── cache                                                       cache
│   └── appStorage.js                                           app中的緩存
├── components                                                  組件
│   ├── AdvertiseView.js                                        廣告頁
│   ├── BlankPage.js                                            空白頁提示
│   ├── BottomIntroduce.js                                      底部介紹
│   ├── CommonBottomBtn.js                                      底部確認按鈕
│   ├── CommonFlatList.js                                       公用flatlist
│   ├── CommonHeader.js                                         app公用navbar
│   ├── CommonItem.js                                           app公用列表item
│   ├── CommonModal.js                                          app公用modal
│   ├── Divider.js                                              間隔組件
│   ├── ErrorPage.js                                            錯誤頁組件
│   ├── ImageGellery.js                                         圖片瀏覽
│   ├── ListFooter.js                                           列表上拉顯示狀態組件
│   ├── Loading.js                                              整屏加載組件
│   ├── LoadingModal.js                                         加載modal
│   ├── PlacePickerModel.js                                     選擇地區modal
│   ├── SliderEntry.js                                          首屏滾動圖片組件
│   ├── SlideUpPanel.js                                         向上滾動組件
│   ├── Swiper.js                                               圖片輪播組件
│   ├── Tabbar.js                                               自定義tabbar
│   ├── UnScalingText.js                                        不允許系統放大字體Text
│   └── WarningTips.js                                          首頁公告組件
├── hoc                                                         高階組件
│   └── CommonHOC.js                                            公共高階組件
├── language                                                    語言
│   ├── en.js                                                   英文
│   ├── i18n.js                                                 轉換(繁)英文
│   └── zh.js                                                   繁體中文
├── reducers                                                    reducers
│   └── appReducer.js                                           app中的reducers
├── store                                                       store
│   └── index.js                                                store的配置
├── styles                                                      app中的樣式
│   ├── common.style.js                                         公用樣式
│   ├── confirmorder.style.js                                    確認訂單樣式
│   ├── content.style.js                                        內容頁樣式
│   ├── coupon.style.js                                         優惠券樣式
│   ├── creditcard.style.js                                     信用卡樣式
│   ├── fooddetails.style.js                                    菜單詳情頁樣式
│   ├── index.style.js                                          輪播樣式
│   ├── login.style.js                                          登錄頁樣式
│   ├── mainview.style.js                                       mainview樣式
│   ├── managecreditcard.style.js                               管理信用卡樣式
│   ├── myorder.style.js                                        我的訂單樣式
│   ├── paysetting.style.js                                     支付方式樣式
│   ├── SliderEntry.style.js                                    輪播樣式
│   └── userinfo.style.js                                       用戶詳情樣式
├── utils                                                       工具
│   ├── animations.js                                           動畫庫
│   ├── CodePushUtils.js                                        codepush熱更新
│   ├── Colors.js                                               顏色
│   ├── DeviceInfo.js                                           手機詳細信息
│   ├── FormatCardInfo.js                                       格式化卡片
│   ├── global_params.js                                        全局配置參數
│   ├── JSONUtils.js                                            json處理工具
│   ├── LinkingUtils.js                                         打電話工具
│   ├── TextUtils.js                                            字體
│   ├── ToastUtil.js                                            toast工具
│   └── ViewStatus.js                                           頁面狀態
├── views                                                       頁面
│   ├── ConfirmOrderView.js                                      確認訂單頁面
│   ├── ContentView.js                                          內容頁
│   ├── CouponView.js                                           優惠券頁面
│   ├── CreditCardView.js                                       信用卡頁面
│   ├── FeedbackView.js                                         反饋頁
│   ├── FoodListView.js                                         餐單預告頁面
│   ├── FoodDetailsView.js                                      菜品詳情頁面
│   ├── ManageCreditCardView.js                                 管理信用卡頁面
│   ├── MoreDetailView.js                                       更多詳情頁面
│   ├── PaySettingView.js                                       支付方式頁面
│   ├── StatementView.js                                        app里宣傳頁面
│   ├── UserHelperView.js                                       用戶支援頁面
│   └── UserInfoView.js                                         用戶詳情頁
├── CustomLoginView.js                                          登錄頁
├── DashBoardView.js                                            DashboardView(用於將redux傳入screenProps)
├── MainView.js                                                 MainView(整個app的路由配置)
├── MandatoryUpdateView.js                                      熱更新下載進度頁
└── SettingView.js                                              系統設置頁                                          

```

### v 1.2.4 概覽
 <p align="left">
  <img src="./display/launch_screen.png" width="200">
  <img src="./display/v1200.png" width="200">
  <img src="./display/v1241.png" width="200">
  <img src="./display/v1242.png" width="200">
</p>
<p align="left">
  <img src="./display/v1248.png" width="200">
  <img src="./display/v1246.png" width="200">
  <img src="./display/v1243.png" width="200">
  <!-- <img src="./display/v1244.png" width="200"> -->
  <img src="./display/v1245.png" width="200">
</p>
<p align="left">
  <img src="./display/v1225.png" width="200">
  <img src="./display/v1206.png" width="200">
  <img src="./display/v12210.png" width="200">
  <img src="./display/v1247.png" width="200">
</p>

### 附錄
ios的打包方法:
[https://www.jianshu.com/p/b1b77d804254](https://www.jianshu.com/p/b1b77d804254) <br>
android的打包方法:
[https://www.jianshu.com/p/61e27d9b02f2](https://www.jianshu.com/p/61e27d9b02f2)
