package com.goforeat_app;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.microsoft.codepush.react.CodePush;
import cl.json.RNSharePackage;
import com.imagepicker.ImagePickerPackage;
import com.microsoft.appcenter.reactnative.push.AppCenterReactNativePushPackage;
import com.wix.interactable.Interactable;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

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
            new FBSDKPackage(),
            new CodePush(deploymentKey, getApplicationContext(), BuildConfig.RELEASE),
            new RNSharePackage(),
            new ImagePickerPackage(),
            new AppCenterReactNativePushPackage(MainApplication.this),
            new Interactable()
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
    SoLoader.init(this, /* native exopackage */ false);
  }
}
