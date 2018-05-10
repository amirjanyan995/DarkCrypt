import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { DecodeServiceProvider } from "../../../providers/decode-service/decode-service";
import { CanvasServiceProvider } from "../../../providers/canvas-service/canvas-service";

declare var cordova: any;

@IonicPage()
@Component({
    selector: 'page-decode-photo',
    templateUrl: 'decode-photo.html',
})
export class DecodePhotoPage {
    @ViewChild('canvas') canvasEl : ElementRef;

    constructor(
        public decodeService: DecodeServiceProvider,
        public canvasService: CanvasServiceProvider)
    {

    }

    ionViewDidLoad()
    {
        this.canvasService.initialiseCanvas(this.canvasEl);
    }
}
