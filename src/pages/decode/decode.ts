import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
// inner pages
import { DecodePhotoPage } from "./decode-photo/decode-photo";
import { DecodeTextPage } from "./decode-text/decode-text";

import { SuperTabsController } from "ionic2-super-tabs";
import {DecodeServiceProvider} from "../../providers/decode-service/decode-service";
import {ScreenOrientation} from "@ionic-native/screen-orientation";

@IonicPage()
@Component({
    selector: 'page-decode',
    templateUrl: 'decode.html',
})
export class DecodePage {

    public decodePhoto:any = DecodePhotoPage;
    public decodeText:any = DecodeTextPage;

    constructor(
        public decodeService:DecodeServiceProvider,
        private superTabsCtrl: SuperTabsController,
        private screen: ScreenOrientation)
    {
        this.screen.onChange().subscribe(() => {
            console.log('ddd')
            this.superTabsCtrl.showToolbar(!this.screen.type.startsWith('landscape'))
        });
        this.superTabsCtrl.showToolbar(!this.screen.type.startsWith('landscape'));
    }

    ionViewDidEnter(){
        this.decodeService.update();
        this.superTabsCtrl.showToolbar(!this.screen.type.startsWith('landscape'));
    }
}
