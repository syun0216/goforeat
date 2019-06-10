#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
  #   public *;
  #}

# wechat
-keep class com.tencent.mm.sdk.** {
  *;
}

-ignorewarnings

-keep class * {
    public private *;
}
