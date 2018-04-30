import { Component } from '@angular/core';
import { Nav,NavController } from 'ionic-angular';

import { EncodePage} from "../encode/encode";
import { DecodePage} from "../decode/decode";
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    encodePage:any = EncodePage;
    decodePage:any = DecodePage;

    splash = true;
    tabBarElement: any;

    constructor(public navCtrl: NavController, public nav: Nav, private translate: TranslateService) {
        this.tabBarElement = document.querySelector('.tabbar');
    }

    openPage(page) {
        this.nav.setRoot(page);
    }
}
