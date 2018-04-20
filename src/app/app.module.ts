import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Camera } from '@ionic-native/camera';

import { HomePage } from '../pages/home/home';
import { EncodePage} from "../pages/encode/encode";
import { DecodePage} from "../pages/decode/decode";
import { LanguagePage} from "../pages/language/language";

import { StatusBar } from '@ionic-native/status-bar';
import { ImagePicker } from '@ionic-native/image-picker';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Clipboard } from '@ionic-native/clipboard';
/**
 *  Custom Components
 */
import { NavbarComponent } from "../components/navbar/navbar";

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        EncodePage,
        DecodePage,
        LanguagePage,
        NavbarComponent
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        EncodePage,
        DecodePage,
        LanguagePage,
        NavbarComponent
    ],
    providers: [
        ImagePicker,
        Clipboard,
        Camera,
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {}
