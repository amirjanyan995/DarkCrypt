import {Component, ViewChild} from '@angular/core';
import { Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import { HomePage} from "../pages/home/home";
import { EncodePage} from "../pages/encode/encode";
import { DecodePage} from "../pages/decode/decode";
import { SettingsPage } from "../pages/settings/settings";

import { TranslateService } from '@ngx-translate/core';
import { Storage } from "@ionic/storage";
import * as Const from '../util/constants';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage:any = HomePage;
    encodePage:any = EncodePage;
    decodePage:any = DecodePage;

    private pages: Array<{title: string, component: any, icon: string}>;

    constructor(
        public platform: Platform,
        public statusBar: StatusBar,
        public translate: TranslateService,
        private storage: Storage) {

        this.pages = [
            { title: 'home', component: HomePage, icon: 'ios-home' },
            { title: 'encode_text', component: EncodePage, icon: 'md-key' },
            { title: 'decode_text', component: DecodePage, icon: 'md-unlock' },
            { title: 'settings', component: SettingsPage, icon: 'md-settings' }
        ];

        this.initializeApp();

        // Set the default language for translation strings, and the current language.
        this.translate.setDefaultLang('en');
    }

    /**
     *  Init App
     */
    private initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            // this.splashScreen.hide();
        });

        // language
        this.storage.get(Const.LANGUAGE).then((language) => {
            this.translate.use(language != null ? language : Const.EN);
            if(language == null) {
                this.storage.set(Const.LANGUAGE, Const.EN);
            }
        });

        // extension
        this.storage.get(Const.EXTENSION).then((extension) => {
            if(extension == null) {
                this.storage.set(Const.EXTENSION, Const.JPG);
            }
        });

        //character type
        this.storage.get(Const.CHARACTER_TYPE).then((type) => {
            if(type == null ){
                this.storage.set(Const.CHARACTER_TYPE, Const.UNICODE);
            }
        });

    }

    /**
     *  Open New Page
     * @param page
     */
    private openPage(page) {
        this.nav.setRoot(page.component);
    }

    /**
     *  Exit project
     */
    private exitApp(){
        this.platform.exitApp();
    }

}
