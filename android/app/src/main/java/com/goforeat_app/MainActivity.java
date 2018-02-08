package com.goforeat_app;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

    //    @Override
    protected void onCreated(Bundle saveInstanceState) {
        SplashScreen.show(this);
        super.onCreate(saveInstanceState);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "goforeat_app";
    }
}
