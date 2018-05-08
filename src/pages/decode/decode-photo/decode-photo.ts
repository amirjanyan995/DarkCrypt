import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { EncodeProvider } from "../../../providers/encode/encode";
import { Base64ToGallery } from "@ionic-native/base64-to-gallery";
import {File} from "@ionic-native/file";
import {Storage} from "@ionic/storage";

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
    private img:string = 'assets/imgs/misc/img-icon.png';
    private text:string = '';
    private  extension:any;
    // Reference the context for the Canvas element
    private _CONTEXT : any;


    constructor(
        private file: File,
        public encode: EncodeProvider,
        public navCtrl: NavController,
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
        var myBaseString = this.img;

        // Split the base64 string in data and contentType
        var block = myBaseString.split(";");

        // Get the content type
        var dataType = block[0].split(":")[1];

        // get the real base64 content of the file
        var realData = block[1].split(",")[1];

        // The path where the file will be created
        var folderpath = this.file.externalRootDirectory + 'DarkCrypt/';

        // The name of your file, note that you need to know if is .png,.jpeg etc
        var filename = 'img_'+ this.random() +'.' + this.extension;

        this.savebase64AsImageFile(folderpath,filename,realData,dataType);
    }

    /**
     * Convert a base64 string in a Blob according to the data and contentType.
     *
     * @param b64Data {String} Pure base64 string without contentType
     * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
     * @param sliceSize {Int} SliceSize to process the byteCharacters
     * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
     * @return Blob
     */
    b64toBlob(b64Data, contentType = '', sliceSize = 512) {

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    /**
     * Create a Image file according to its database64 content only.
     *
     * @param folderpath {String} The folder where the file will be created
     * @param filename {String} The name of the file that will be created
     * @param content {Base64 String} Important : The content can't contain the following string (data:image/png[or any other format];base64,). Only the base64 string is expected.
     */
    savebase64AsImageFile(folderpath,filename,content,contentType){

        // Convert the base64 string in a Blob
        var DataBlob = this.b64toBlob(content,contentType);

        let self = this;
        this.file.resolveDirectoryUrl(folderpath).then((path)=>{
            self.file.getFile(path,filename,{create:true}).then(file => {
                file.createWriter(function(fileWriter) {
                    fileWriter.write(DataBlob);
                }, function(){
                    alert('Unable to save file in path '+ folderpath);
                });
            })
        });
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
