# goforeat（react native）
<p align="center">
  <img width="128" src="./display/goforeat.png">
</p>

### 文档结构
```
app  
├── actions                                                     actions
│   └── index.js                                                需要处理的actions别名
├── asset                                                       图标
├── cache                                                       cache
│   └── appStorage.js                                           app中的缓存
├── components                                                  组件
│   ├── AdvertiseView.js                                        广告页
│   ├── BackAndroidHandler.js                                   返回键处理
│   ├── BlankPage.js                                            空白页提示
│   ├── BottomIntroduce.js                                      底部介绍关于我们详情
│   ├── BottomOrderConfirm.js                                   底部确认bar                                         
│   ├── CommonBottomBtn.js                                      底部确认按钮
│   ├── CommonFlatList.js                                       公用flatlist
│   ├── CommonHeader.js                                         app公用navbar
│   ├── CommonItem.js                                           app公用列表item
│   ├── CommonModal.js                                          app公用modal
│   ├── Divider.js                                              间隔组件
│   ├── ErrorPage.js                                            错误页组件
│   ├── HomePageHOC.js                                          HomePage高阶组件,热更新、极光推送等功能
│   ├── ImageGellery.js                                         图片浏览
│   ├── ListFooter.js                                           列表上拉刷新显示状态组件
│   ├── Loading.js                                              整屏加载组件
│   ├── LoadingModal.js                                         加载modal
│   ├── PlacePickerModel.js                                     选择地区modal
│   ├── SliderEntry.js                                          首页图片滚动组件
│   ├── SlideUpPanel.js                                         滑动向上组件(查看详情)
│   ├── Swiper.js                                               图片轮播组件
│   ├── Tabbar.js                                               自定义tabbar
│   ├── UnScalingText.js                                        不允许系统放大字体Text
│   └── WarningTips.js                                          首页公告组件
├── language                                                    语言
│   ├── en.js                                                   英文
│   ├── i18n.js                                                 转换中(繁)英文
│   └── zh.js                                                   繁体中文
├── reducers                                                    reducers
│   └── appReducer.js                                           app中的reducers
├── store                                                       store
│   └── index.js                                                store的配置
├── styles                                                      app中的样式
│   ├── common.style.js                                         公用样式
│   ├── confirmorder.style.js                                    确认订单样式
│   ├── content.style.js                                        内容页样式
│   ├── coupon.style.js                                         优惠券样式
│   ├── creditcard.style.js                                     信用卡样式
│   ├── fooddetails.style.js                                    菜单详情页样式
│   ├── index.style.js                                          轮播样式
│   ├── login.style.js                                          登录页样式
│   ├── mainview.style.js                                       mainview样式
│   ├── managecreditcard.style.js                               管理信用卡样式
│   ├── myorder.style.js                                        我的订单样式
│   ├── paysetting.style.js                                     支付方式样式
│   ├── SliderEntry.style.js                                    轮播样式
│   └── userinfo.style.js                                       用户详情样式
├── utils                                                       工具
│   ├── animations.js                                           动画库
│   ├── CodePushUtils.js                                        codepush热更新
│   ├── Colors.js                                               颜色
│   ├── DeviceInfo.js                                           手机详细信息
│   ├── FormatCardInfo.js                                       格式化卡片
│   ├── global_params.js                                        全局配置参数
│   ├── JSONUtils.js                                            json处理工具
│   ├── LinkingUtils.js                                         打电话工具
│   ├── TextUtils.js                                            字体
│   ├── ToastUtil.js                                            toast工具
│   └── ViewStatus.js                                           页面状态
├── views                                                       页面
│   ├── ConfirmOrderView.js                                      确认订单页面
│   ├── ContentView.js                                          内容页
│   ├── CouponView.js                                           优惠券页面
│   ├── CreditCardView.js                                       信用卡页面
│   ├── FeedbackView.js                                         反馈页
│   ├── FoodListView.js                                         餐单预告页面
│   ├── FoodDetailsView.js                                      菜单详情页
│   ├── ManageCreditCardView.js                                 管理信用卡页面
│   ├── MoreDetailView.js                                       更多详情页面
│   ├── PaySettingView.js                                       支付方式页面
│   ├── StatementView.js                                        app里宣传页
│   ├── UserHelperView.js                                       用户支援页面
│   └── UserInfoView.js                                         用户详情页
├── CustomLoginView.js                                          登录页
├── DashBoardView.js                                            DashboardView(用于将redux传入screenProps)
├── MainView.js                                                 MainView(整个app的路由配置)
├── MandatoryUpdateView.js                                      热更新下载进度页
└── SettingView.js                                              系统设置页                                                

```

### android平台 [android 下载地址](https://play.google.com/store/apps/details?id=com.goforeat_app)
* 运行: 用Android studio导入android文件夹下的项目 -> run 
* 打包: 在项目文件夹下, npm run bundle-android 打包完bundle后 $ cd android && ./gradlew assembleRelease

### ios平台 [ios 下载地址](https://itunes.apple.com/cn/app/goforeat/id1343559475?mt=8)
* 运行: Xcode(打开goforeat_app.xcworkspace项目) -> run
* 打包:
    * 选择'Generic iOS Device'
    * Product->Archive

### v 1.2.2 概览
 <p align="left">
  <img src="./display/launch_screen.png" width="200">
  <img src="./display/v1200.png" width="200">
  <img src="./display/v1221.png" width="200">
  <img src="./display/v1222.png" width="200">
</p>
<p align="left">
  <img src="./display/v1223.png" width="200">
  <img src="./display/v1224.png" width="200">
  <img src="./display/v1225.png" width="200">
  <img src="./display/v1226.png" width="200">
</p>
<p align="left">
  <img src="./display/v1228.png" width="200">
  <img src="./display/v1229.png" width="200">
  <img src="./display/v1206.png" width="200">
  <img src="./display/v12210.png" width="200">
</p>

### 附录
ios的打包方法:
[https://www.jianshu.com/p/b1b77d804254](https://www.jianshu.com/p/b1b77d804254) <br>
android的打包方法:
[https://www.jianshu.com/p/61e27d9b02f2](https://www.jianshu.com/p/61e27d9b02f2)
