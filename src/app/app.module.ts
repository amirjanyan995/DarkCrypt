import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { SettingsPage } from "../pages/settings/settings";

// encode page
import { EncodePage} from "../pages/encode/encode";
import { EncodePhotoPage } from "../pages/encode/encode-photo/encode-photo";
import { EncodeTextPage } from "../pages/encode/encode-text/encode-text";
import { EncodeReviewPage } from "../pages/encode/encode-review/encode-review";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
// page decode
import { DecodePage} from "../pages/decode/decode";
import { DecodePhotoPage } from "../pages/decode/decode-photo/decode-photo";
import { DecodeTextPage } from "../pages/decode/decode-text/decode-text";

import { StatusBar } from '@ionic-native/status-bar';
import { ImagePicker } from '@ionic-native/image-picker';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Clipboard } from "@ionic-native/clipboard";

import { Base64ToGallery } from "@ionic-native/base64-to-gallery";
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { PhotoViewer } from '@ionic-native/photo-viewer';

import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { SuperTabsModule } from 'ionic2-super-tabs';
/**
 *  Custom Components
 */
import { NavbarComponent } from "../components/navbar/navbar";
import { IonicStorageModule } from "@ionic/storage";
/**
 * Providers
 */
import { EncodeProvider } from '../providers/encode/encode';
import { DatabaseProvider } from '../providers/database/database';
import { FileServiceProvider } from '../providers/file-service/file-service';
import { DecodeServiceProvider } from '../providers/decode-service/decode-service';
import { EncodeServiceProvider } from '../providers/encode-service/encode-service';
import { PhotoServiceProvider } from '../providers/photo-service/photo-service';
import { CanvasServiceProvider } from '../providers/canvas-service/canvas-service';

@NgModule({
    declarations: [
        NavbarComponent,
        MyApp,
        HomePage,
        SettingsPage,

        // Encode Page
        EncodePage,
        EncodePhotoPage,
        EncodeTextPage,
        EncodeReviewPage,

        // Decode Page
        DecodePage,
        DecodePhotoPage,
        DecodeTextPage
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient]
            }
        }),
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot(),
        SuperTabsModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        NavbarComponent,
        MyApp,
        HomePage,
        SettingsPage,

        // Encode Page
        EncodePage,
        EncodePhotoPage,
        EncodeTextPage,
        EncodeReviewPage,

        // Decode Page
        DecodePage,
        DecodePhotoPage,
        DecodeTextPage
    ],
    providers: [
        Camera,
        PhotoViewer,
        Base64ToGallery,
        File,
        FilePath,
        Transfer,
        ImagePicker,
        Clipboard,
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        DatabaseProvider,
        ScreenOrientation,
        // custom providers
        EncodeProvider,
        FileServiceProvider,
        DecodeServiceProvider,
        EncodeServiceProvider,
        PhotoServiceProvider,
    CanvasServiceProvider
    ]
})

export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}