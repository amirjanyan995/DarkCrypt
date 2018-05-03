import {Component, ViewChild} from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { EncodeProvider } from "../../../providers/encode/encode";
import {ElementRef} from '@angular/core';
import { NavController } from "ionic-angular";
import {Clipboard} from "@ionic-native/clipboard";

@IonicPage()
@Component({
    selector: 'page-encode-text',
    templateUrl: 'encode-text.html',
})
export class EncodeTextPage {
    @ViewChild('message') message: ElementRef;

    constructor(
        public encode:EncodeProvider,
        public nav: NavController,
        public clipboard: Clipboard
    ) {

    }
    // Past copyed text
    public past() {
        this.clipboard.paste().then(
            (resolve: string) => {
                this.encode.message += resolve;
            },
            (reject: string) => {}
        );
    }
}
