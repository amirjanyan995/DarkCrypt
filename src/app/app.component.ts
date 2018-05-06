import {Component, ViewChild} from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import { HomePage} from "../pages/home/home";
import { EncodePage} from "../pages/encode/encode";
import { DecodePage} from "../pages/decode/decode";
import { SettingsPage } from "../pages/settings/settings";

import { TranslateService } from '@ngx-translate/core';
import { Storage } from "@ionic/storage";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage:any = HomePage;
    encodePage:any = EncodePage;
    decodePage:any = DecodePage;

    pages: Array<{title: string, component: any, icon: string}>;

    constructor(
        public platform: Platform,
        public statusBar: StatusBar,
        public translate: TranslateService,
        private storage: Storage) {
        this.initializeApp();

        this.pages = [
            { title: 'home', component: HomePage, icon: 'ios-home' },
            { title: 'encode_text', component: EncodePage, icon: 'md-key' },
            { title: 'decode_text', component: DecodePage, icon: 'md-unlock' },
            { title: 'settings', component: SettingsPage, icon: 'md-settings' }
        ];
        // Set the default language for translation strings, and the current language.
        this.translate.setDefaultLang('en');
    }

    /**
     *  Init App
     */
    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            // this.splashScreen.hide();
        });

        // language
        this.storage.get('language').then((language) => {
            this.translate.use(language != null ? language : 'en');
            if(language == null) {
                this.storage.set('language', 'en');
            }
        });

        // extension
        this.storage.get('extension').then((extension) => {
            if(extension == null) {
                this.storage.set('extension', 'jpg');
            }
        });

        //character type
        this.storage.get('character_type').then((type) => {
            if(type == null ){
                this.storage.set('character_type', 'unicode');
            }
        });

    }

    /**
     *  Open New Page
     * @param page
     */
    openPage(page) {
        this.nav.setRoot(page.component);
    }

    /**
     *  Exit project
     */
    exitApp(){
        this.platform.exitApp();
    }

}
