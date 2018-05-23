import { Injectable} from '@angular/core';
import { Camera } from "@ionic-native/camera";
import { PhotoServiceProvider } from "../photo-service/photo-service";
import { FileServiceProvider } from "../file-service/file-service";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import * as Const from '../../util/constants';
import {AlertController, LoadingController, ToastController} from "ionic-angular";
import { Clipboard } from "@ionic-native/clipboard";
import {SuperTabsController} from "ionic2-super-tabs";
import {TranslateService} from "@ngx-translate/core";
import {CanvasServiceProvider} from "../canvas-service/canvas-service";
import {Storage} from "@ionic/storage";

@Injectable()
export class EncodeServiceProvider {

    private lastImage:any = null;
    private lastPath:any = null;
    public message:string;
    public outputFileName:string;
    public password:string;

    private tr = [];

    constructor(
        public alertCtrl:AlertController,
        public translate: TranslateService,
        private superTabsCtrl: SuperTabsController,
        public toastCtrl: ToastController,
        public clipboard: Clipboard,
        private camera:Camera,
        private photoViewer: PhotoViewer,
        private photoService:PhotoServiceProvider,
        private fileService:FileServiceProvider,
        private canvasService:CanvasServiceProvider,
        private storage:Storage,
        private loadCtrl:LoadingController)
    {
    }

    /**
     * Take Photo
     * @param sourceType = {
     *    Camera == 1,
     *    PhotoLibrary = 0
     * }
     */
    public takePhoto(sourceType){
        if(sourceType === this.camera.PictureSourceType.CAMERA) {
            this.photoService.takePhotoFromCamera().then( data => {
                this.lastImage = data[0].name
                this.lastPath = data[0].path
                this.canvasService.drawImg(this.lastPath + this.lastImage);
            }).catch( err => {
                console.log(err)
                this.presentToast('Something went wrong.');
            });
        } else {
            this.photoService.takePhotoFromGallery().then( data => {
                this.lastImage = data[0].name
                this.lastPath = data[0].path
                this.canvasService.drawImg(this.lastPath + this.lastImage);
            }).catch(err => {
                this.presentToast('Something went wrong.');
            })
        }
    }

    /**
     * Remove Selected Photo
     */
    public removePhoto(){
        this.fileService.removeFile(this.lastPath,this.lastImage).catch(err => {
            this.presentToast('The image couldn\'t be deleted')
        })
        this.canvasService.clearCanvas();
        this.lastImage = null;
        this.lastPath = null;
    }
    /**
     * Convert integer to binary
     */
    private decToBin(dec:number):string {
        return (dec >>> 0).toString(2);
    }
    /**
     * Convert binary to integer
     */
    private binToDec(bin:string):number {
        return parseInt(bin, 2);
    }

    private fillToStart(bin:string){
        let length = bin.length > 8 ? bin.length + (8 - (bin.length%8)) : 8;
        for(let i=bin.length; i<length; i++){
            bin = '0' + bin;
        }
        return bin;
    }

    private textToArray(text:string, blockLength:number = 2, endBits:boolean = true){
        let arr = [];
        for(let i=0; i<text.length; i++){
            let code = this.fillToStart(this.decToBin(text.charCodeAt(i)));
            for(let j=0; j<code.length;j+=blockLength){
                arr.push(code.slice(j,j+blockLength));
            }
        }
        if(endBits) {
            for(let i=0; i< 16; i++){arr.push('00')}
        }
        return arr;
    }
    /**
     * Encode Image
     */
    public encode(){
        let loading = this.loadCtrl.create({
            content: 'Encoding text...'
        });

        if(!this.message) {
            this.translate.get('encode_text_message').subscribe(value => {
                this.presentToast(value, 'bottom')
            });
            this.superTabsCtrl.slideTo('encodeTextTab');
            return;
        }
        if(!this.outputFileName){
            this.translate.get('file_name_message').subscribe(value => {
                this.presentToast(value, 'bottom')
            });
            return;
        }
        loading.present();
        this.canvasService.encode(this.message, this.password).then(data => {
            let base64code = data[0].data
            this.fileService.saveImage(base64code,this.outputFileName).then(url => {
                loading.dismiss();
                this.presentConfirm(url);
            })
        });
    }

    /**
     * After encoding present confirmation message with context Start over OR Cancel;
     * @param path
     */
    private presentConfirm(path:any) {
        this.translate.get(['photo_save_message','start_over','cancel']).subscribe(value => {
            let alert = this.alertCtrl.create({
                message: value['photo_save_message'] + path,
                buttons: [
                    {
                        text: value['start_over'],
                        handler: () => {
                            this.update();
                            this.superTabsCtrl.slideTo('encodePhotoTab');
                        }
                    },
                    {
                        text: value['cancel'],
                        role: 'cancel'
                    }
                ]
            });
            alert.present();
        });
    }

    /**
     *  Show selected image into modal
     */
    public showImg(){
        if (this.lastPath != null && this.lastImage != null) {
            this.photoViewer.show(this.lastPath + this.lastImage);
        }
    }

    /**
     * Show information modal
     */
    public showInformation(){
        if (this.lastPath === null || this.lastImage === null) return;
        this.fileService.getImgFile(this.lastPath,this.lastImage).then(data => {
            this.photoService.showInformation(data)
        }).catch(err => {
            console.log(err)
        });
    }

    /**
     * Past copied text to message textArea
     */
    public past(){
        this.clipboard.paste().then(
            (resolve: string) => {
                if(!this.message)
                    this.message = resolve
                else
                    this.message += resolve;
            }
        );
    }

    /**
     * Show Message
     * @param text
     */
    private presentToast(text, position:string = 'top') {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: position
        });
        toast.present();
    }

    /**
     * Update existing data
     */
    public update(){
        this.message = '';
        this.outputFileName = this.fileService.createTempFileName(false);
        this.password = '';

        // update data received form storage.
        this.fileService.updateStorage();
        this.canvasService.clearCanvas();
        // remove selected image
        if(this.lastPath != null && this.lastImage != null) {
            this.removePhoto();
        }
    }

    /**
     * Path to selected image
     * @returns {string}
     */
    get pathToImage(){
        if(this.lastPath != null && this.lastImage != null) {
            return this.lastPath + this.lastImage;
        } else {
            return Const.DEFAULT_IMG;
        }
    }

}