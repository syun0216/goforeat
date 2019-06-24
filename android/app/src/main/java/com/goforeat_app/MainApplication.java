package com.goforeat_app;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
//import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.theweflex.react.WeChatPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.reactnativepayments.ReactNativePaymentsPackage;
import cn.jpush.reactnativejpush.JPushPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.imagepicker.ImagePickerPackage;
import com.reactnativepayments.ReactNativePaymentsPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.beefe.picker.PickerViewPackage;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import com.BV.LinearGradient.LinearGradientPackage;
import com.microsoft.codepush.react.CodePush;

import cl.json.RNSharePackage;

import com.imagepicker.ImagePickerPackage;
import com.microsoft.appcenter.reactnative.push.AppCenterReactNativePushPackage;
import com.wix.interactable.Interactable;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;
import androidx.multidex.MultiDex;

import com.agontuk.RNFusedLocation.RNFusedLocationPackage;


import cn.jpush.reactnativejpush.JPushPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
    //jpush

    private boolean SHUTDOWN_TOAST = true;
    private boolean SHUTDOWN_LOG = true;


    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }




    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
//      String deploymentKey = BuildConfig.DEBUG ? "fMXsr1oL8ExCRlmMZD2nLEWHY0-rd261912e-873f-4270-b887-25c360664c8c" : "tbisaS3TKf-Bo3vwCkzIC-TJPf4cd261912e-873f-4270-b887-25c360664c8c";
            String deploymentKey = "fMXsr1oL8ExCRlmMZD2nLEWHY0-rd261912e-873f-4270-b887-25c360664c8c";
            return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new ReactNativeRestartPackage(),
            new AsyncStoragePackage(),
//            new RNCWebViewPackage(),
            new RNFusedLocationPackage(),
            new VectorIconsPackage(),
            new FastImageViewPackage(),
            new WeChatPackage(),
            new LottiePackage(),
            new ReactNativePaymentsPackage(),
            new JPushPackage(!BuildConfig.DEBUG, !BuildConfig.DEBUG),
            new RNDeviceInfo(),
            new PickerViewPackage(),
            new SplashScreenReactPackage(),
            new LinearGradientPackage(),
            new CodePush(deploymentKey, getApplicationContext(), BuildConfig.RELEASE),
            new RNSharePackage(),
            new ImagePickerPackage(),
            new AppCenterReactNativePushPackage(MainApplication.this),
            new Interactable(),
            new FBSDKPackage(mCallbackManager),
            new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG)
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        MultiDex.install(this);
//        AppEventsLogger.activateApp(this);
        SoLoader.init(this, /* native exopackage */ false);
    }
}
