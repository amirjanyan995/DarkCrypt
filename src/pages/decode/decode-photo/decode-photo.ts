import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { EncodeProvider } from "../../../providers/encode/encode";
import { Base64ToGallery } from "@ionic-native/base64-to-gallery";
import { File } from "@ionic-native/file";
import { Storage } from "@ionic/storage";
import { DecodeServiceProvider } from "../../../providers/decode-service/decode-service";

declare var cordova: any;

@IonicPage()
@Component({
    selector: 'page-decode-photo',
    templateUrl: 'decode-photo.html',
})
export class DecodePhotoPage {
    // 'plug into' DOM canvas element using @ViewChild
    @ViewChild('canvas') canvasEl : ElementRef;

    //Reference Canvas object
    private _CANVAS  : any;
    // Reference the context for the Canvas element
    private _CONTEXT : any;

    private img:string = 'assets/imgs/misc/img-icon.png';
    private text:string = '';
    private extension:any;


    constructor(
        public decodeService: DecodeServiceProvider,
        private file: File,
        public encode: EncodeProvider,
        private base64ToGallery: Base64ToGallery,
        private storage: Storage)
    {
        this.storage.get('extension').then(extension => {
            this.extension = extension;
        })
    }

    ionViewDidLoad()
    {
        this._CANVAS 	    = this.canvasEl.nativeElement;
        this.initialiseCanvas();
    }

    /**
     *  Set canvas initial configuration
     */
    initialiseCanvas()
    {
        if(this._CANVAS.getContext)
        {
            this._CONTEXT = this._CANVAS.getContext('2d');
        }
    }

    /**
     * Draw Selected image
     * @param path
     */
    draw(path)
    {
        let source = new Image();
        source.crossOrigin = 'Anonymous';
        source.src = path;
        source.onload = () => {
            this._CANVAS.height = source.height;
            this._CANVAS.width = source.width;
            this._CONTEXT.drawImage(source, 0, 0);

            this._CONTEXT.font = "32px impact";
            this._CONTEXT.textAlign = 'center';
            this._CONTEXT.fillStyle = 'black';
            this._CONTEXT.fillText(this.text, this._CANVAS.width / 2, this._CANVAS.height * 0.8);
        };
        this.img = this.getDataURL();
    }

    invert() {
        for (let i=0; i<30; i++) {
            for (let j=0; j<20; j++) {
                this.setPixel(i,j)
            }
        }
        // for (var i = 0; i < data.length; i += 4) {
        //     data[i]     = 255 - data[i];     // red
        //     data[i + 1] = 255 - data[i + 1]; // green
        //     data[i + 2] = 255 - data[i + 2]; // blue
        // }
        // this._CONTEXT.putImageData(imageData, 0, 0);
        this.img = this.getDataURL();
    };

    /**
     * Get image Base64 code
     * @returns {any}
     */
    getDataURL(){
        return this._CANVAS.toDataURL(this.extension);
    }

    aaa(){
        let path = 'assets/imgs/misc/img-icon.png';
        this.draw(path)
        //
        // for (let i=0; i<this._CANVAS.height; i++) {
        //     for (let j=0; j<this._CANVAS.width; j++) {
        //         this.setPixel(i,j)
        //     }
        // }
    }

    save(){
        this.decodeService.decode(this.img)
    }

    random(): number {
        let rand = Math.floor(Math.random()*255)+1;
        return rand;
    }

    setPixel(x,y){
        var id = this._CONTEXT.createImageData(1,1);
        var d  = id.data;
        d[0]   = this.random();
        d[1]   = this.random();
        d[2]   = this.random();
        d[3]   = 255;
        this._CONTEXT.putImageData( id, x, y );
    }

    getPixel(x, y)
    {
        var p = this._CONTEXT.getImageData(x, y, 1, 1).data;
        var hex = "#" + ("000000" + this.rgbToHex(p[0], p[1], p[2])).slice(-6);
        return hex;
    }

    rgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
    }

    clearCanvas()
    {
        this.img = 'assets/imgs/misc/img-icon.png';
        this._CONTEXT.clearRect(0, 0, this._CANVAS.width, this._CANVAS.height);
    }


}
