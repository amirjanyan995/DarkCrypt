import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
// inner pages
import { DecodePhotoPage } from "./decode-photo/decode-photo";
import { DecodeTextPage } from "./decode-text/decode-text";

import { SuperTabsController } from "ionic2-super-tabs";
import {DecodeServiceProvider} from "../../providers/decode-service/decode-service";

@IonicPage()
@Component({
    selector: 'page-decode',
    templateUrl: 'decode.html',
})
export class DecodePage {

    public decodePhoto:any = DecodePhotoPage;
    public decodeText:any = DecodeTextPage;

    constructor(public decodeService:DecodeServiceProvider)
    {   }

    ionViewDidEnter(){
        this.decodeService.update();
    }
}
