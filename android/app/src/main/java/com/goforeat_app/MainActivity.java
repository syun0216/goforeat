package com.goforeat_app;


import android.os.Bundle;
import android.util.Log;
import com.facebook.react.ReactActivity;
import android.content.Intent;

import cn.jpush.android.api.JPushInterface;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this, true);
        super.onCreate(savedInstanceState);
        JPushInterface.init(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        JPushInterface.onPause(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        JPushInterface.onResume(this);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "goforeat_app";
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }
}
