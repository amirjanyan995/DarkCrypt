import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { EncodeServiceProvider } from "../../../providers/encode-service/encode-service";
import { Camera } from "@ionic-native/camera";

@IonicPage()
@Component({
    selector: 'page-encode-photo',
    templateUrl: 'encode-photo.html',
})
export class EncodePhotoPage {

    constructor(
        public encodeService: EncodeServiceProvider,
        private camera: Camera
    ) {
    }
}
