# goforeat （新版本更名为有得食）
有得食 外卖软件 （react native架构）
<p align="center">
  <img width="128" src="./display/goforeat.png">
</p>

### 文档结构
```
app  
├── actions  
│   └── index.js   
├── asset  
├── cache        
│   └── appStorage.js            
├── components
│   ├── AdvertiseView.js
│   ├── BackAndroidHandler.js
│   ├── BlankPage.js
│   ├── BottomIntroduce.js
│   ├── BottomOrderConfirm.js
│   ├── carouselSwiper.js
│   ├── CommonBottomBtn.js
│   ├── CommonHeader.js
│   ├── CommonItem.js
│   ├── Divider.js
│   ├── ErrorPage.js
│   ├── HomePageHOC.js
│   ├── ImageGellery.js
│   ├── ListFooter.js
│   ├── Loading.js
│   ├── LoadingModal.js
│   ├── PlacePickerModel.js
│   ├── SliderEntry.js
│   ├── SlideUpPanel.js
│   ├── Swiper.js
│   ├── Tabbar.js
│   ├── UnScalingText.js
│   └── WarningTips.js
├── language
│   ├── en.js
│   ├── i18n.js
│   └── zh.js
├── reducers
│   └── appReducer.js
├── store
│   └── index.js
├── styles
│   ├── common.style.js
│   ├── confirmorder.style.js
│   ├── content.style.js
│   ├── coupon.style.js
│   ├── creditcard.style.js
│   ├── homepage.style.js
│   ├── index.style.js
│   ├── login.style.js
│   ├── mainview.style.js
│   ├── managecreditcard.style.js
│   ├── myorder.style.js
│   ├── paysetting.style.js
│   ├── SliderEntry.style.js
│   └── userinfo.style.js
├── utils
│   ├── animations.js
│   ├── CodePushUtils.js
│   ├── Colors.js
│   ├── DeviceInfo.js
│   ├── FormatCardInfo.js
│   ├── global_params.js
│   ├── JSONUtils.js
│   ├── LinkingUtils.js
│   ├── TextUtils.js
│   ├── ToastUtil.js
│   └── ViewStatus.js
├── views
│   ├── ConfirmOrderView.js
│   ├── ContentView.js
│   ├── CouponView.js
│   ├── CreditCardView.js
│   ├── FeedbackView.js
│   ├── FoodListView.js
│   ├── HomePage.js
│   ├── ManageCreditCardView.js
│   ├── MoreDetailView.js
│   ├── PaySettingView.js
│   ├── StatementView.js
│   ├── UserHelperView.js
│   └── UserInfoView.js
├── CustomLoginView.js
├── DashBoardView.js
├── MainView.js
├── MandatoryUpdateView.js
├── SettingView.js
└── SplashPageView.js

```

### android平台 [android 下载地址](https://play.google.com/store/apps/details?id=com.goforeat_app)
* 运行: 用Android studio导入android文件夹下的项目 -> run 
* 打包: 在项目文件夹下, npm run bundle-android 打包完bundle后 $ cd android && ./gradlew assembleRelease

### ios平台 [ios 下载地址](https://itunes.apple.com/cn/app/goforeat/id1343559475?mt=8)
* 运行: Xcode(打开goforeat_app.xcworkspace项目) -> run
* 打包:
    * 选择'Generic iOS Device'
    * Product->Archive

### v 1.2.0 概览 
1、全新登錄頁和訂單頁
2、支持線上信用卡支付
3、訂單詳情可添加備註留言
4、首頁添加查看詳情功能
5、支持多语言  兼容iPhone X
 <p align="left">
  <img src="./display/launch_screen.png" width="200">
  <img src="./display/v1200.png" width="200">
  <img src="./display/v1201.png" width="200">
  <img src="./display/v1202.png" width="200">
</p>
<p align="left">
  <img src="./display/v1203.png" width="200">
  <img src="./display/v1204.png" width="200">
  <img src="./display/v1205.png" width="200">
  <img src="./display/v1206.png" width="200">
</p>
<p align="left">
  <img src="./display/v1207.png" width="200">
  <img src="./display/v1208.png" width="200">
  <img src="./display/v1209.png" width="200">
  <img src="./display/v1210.png" width="200">
</p>

### 附录
ios的打包方法:
[https://www.jianshu.com/p/b1b77d804254](https://www.jianshu.com/p/b1b77d804254) <br>
android的打包方法:
[https://www.jianshu.com/p/61e27d9b02f2](https://www.jianshu.com/p/61e27d9b02f2)
