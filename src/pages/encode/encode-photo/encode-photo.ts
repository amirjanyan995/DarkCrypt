import { Component, ElementRef, ViewChild} from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { EncodeServiceProvider } from "../../../providers/encode-service/encode-service";
import { Camera } from "@ionic-native/camera";
import {CanvasServiceProvider} from "../../../providers/canvas-service/canvas-service";

@IonicPage()
@Component({
    selector: 'page-encode-photo',
    templateUrl: 'encode-photo.html',
})
export class EncodePhotoPage {
    @ViewChild('canvas') canvasEl : ElementRef;

    constructor(
        public encodeService: EncodeServiceProvider,
        public canvasService: CanvasServiceProvider,
        private camera: Camera
    )
    {}


    ionViewDidLoad()
    {
        // init canvas
        this.canvasService.initialiseCanvas(this.canvasEl);
    }
}
