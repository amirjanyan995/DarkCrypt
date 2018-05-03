import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// inner pages
import { DecodePhotoPage } from "./decode-photo/decode-photo";
import { DecodeTextPage } from "./decode-text/decode-text";

import { SuperTabsController } from "ionic2-super-tabs";

@IonicPage()
@Component({
    selector: 'page-decode',
    templateUrl: 'decode.html',
})
export class DecodePage {

    public decodePhoto:any = DecodePhotoPage;
    public decodeText:any = DecodeTextPage;

    constructor(
        public navCtrl: NavController,
        private superTabsCtrl: SuperTabsController)
    {   }
    
    onTabSelect(ev: any) {
        console.log('Tab selected', 'Index: ' + ev.index, 'Unique ID: ' + ev.id);
    }

}
