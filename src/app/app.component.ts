import {Component, ViewChild} from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage} from "../pages/home/home";
import { EncodePage} from "../pages/encode/encode";
import { DecodePage} from "../pages/decode/decode";
import { LanguagePage} from "../pages/language/language";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage:any = HomePage;
    encodePage:any = EncodePage;
    decodePage:any = DecodePage;

    pages: Array<{title: string, component: any, icon: string}>;

    constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
        this.initializeApp();

        this.pages = [
            { title: 'Home', component: HomePage, icon: 'ios-home' },
            { title: 'Encode text', component: EncodePage, icon: 'md-key' },
            { title: 'Decode text', component: DecodePage, icon: 'md-unlock' },
            { title: 'Language', component: LanguagePage, icon: 'md-globe' }
        ];
    }

    /**
     *  Init App
     */
    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            // this.splashScreen.hide();
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
