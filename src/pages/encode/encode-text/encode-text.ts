import { Component, ViewChild} from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ElementRef } from '@angular/core';
import { EncodeServiceProvider } from "../../../providers/encode-service/encode-service";

@IonicPage()
@Component({
    selector: 'page-encode-text',
    templateUrl: 'encode-text.html',
})
export class EncodeTextPage {
    @ViewChild('message') message: ElementRef;

    constructor(
        public encodeService:EncodeServiceProvider
    ) {
    }
}
