import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { EncodePage} from "../pages/encode/encode";
import { DecodePage} from "../pages/decode/decode";
import { SettingsPage } from "../pages/settings/settings";

import { StatusBar } from '@ionic-native/status-bar';
import { ImagePicker } from '@ionic-native/image-picker';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Clipboard } from '@ionic-native/clipboard';

import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

/**
 *  Custom Components
 */
import { NavbarComponent } from "../components/navbar/navbar";
import { DatabaseProvider } from '../providers/database/database';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        EncodePage,
        DecodePage,
        SettingsPage,
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
        SettingsPage,
        NavbarComponent
    ],
    providers: [
        Camera,
        File,
        FilePath,
        Transfer,
        ImagePicker,
        Clipboard,
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider
    ]
})
export class AppModule {}
