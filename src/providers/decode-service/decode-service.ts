import { Injectable } from '@angular/core';
import {Camera} from "@ionic-native/camera";
import {PhotoServiceProvider} from "../photo-service/photo-service";
import {LoadingController, ToastController} from "ionic-angular";
import {Clipboard} from "@ionic-native/clipboard";
import {SuperTabsController} from "ionic2-super-tabs";
import {TranslateService} from "@ngx-translate/core";
import {FileServiceProvider} from "../file-service/file-service";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import * as Const from "../../util/constants";

@Injectable()
export class DecodeServiceProvider {

    private lastImage:any = null;
    private lastPath:any = null;
    public message:string;

    private pleaseWait:string;

    constructor(
        public toastCtrl: ToastController,
        private camera:Camera,
        private photoService: PhotoServiceProvider,
        public translate: TranslateService,
        private superTabsCtrl: SuperTabsController,
        public clipboard: Clipboard,
        private photoViewer: PhotoViewer,
        private fileService:FileServiceProvider,
        private loadCtrl:LoadingController
    ) {
        this.translate.get('please_wait').subscribe(value => {
            this.pleaseWait = value;
        })
    }
    /**
     * Take Photo
     * @param sourceType = {
     *    Camera == 1,
     *    PhotoLibrary = 0
     * }
     */
    public takePhoto(){
        this.photoService.takePhotoFromGallery().then( data => {
            this.lastImage = data[0].name
            this.lastPath = data[0].path
        }).catch(err => {
            console.log(err);
            this.presentToast('Something went wrong.');
        })
    }

    /**
     * Remove Selected Photo
     */
    public removePhoto(){
        this.fileService.removeFile(this.lastPath,this.lastImage).catch(err => {
            this.presentToast('The image couldn\'t be deleted')
        })
        this.lastImage = null;
        this.lastPath = null;
    }

    /**
     * Decode Image
     */
    public decode(base64:string = null){
        let loading = this.loadCtrl.create({
            content: 'Decoding text...'
        });

        loading.present();

        setTimeout(() => {
            loading.dismiss();
        },3000);


        if(base64 != null) {
            this.fileService.saveImage(base64)
        }
        // this.fileService.copyFileToProjectDir(this.lastPath,this.lastImage, this.outputFileName)
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
     * Copy decoded text
     */
    public copy(){
        this.clipboard.copy(this.message);
        this.translate.get('copy_message').subscribe(value => {
            this.presentToast(value, 'bottom')
        });
    }

    /**
     * Save decoded text
     */
    public saveDecodedText(){
        let loading = this.loadCtrl.create({
            content: this.pleaseWait
        });

        loading.present();

        let name = this.lastImage.split('.')[0];
        let self = this;
        this.fileService.saveAsTxt(this.message,name).then(dir => {
            loading.dismiss();
            self.translate.get('save_message').subscribe(value => {
                self.presentToast(value + '  ' + dir, 'bottom')
            });
        }).catch(err => {
            this.presentToast('Something went wrong.');
        });
    }
    /**
     * Update existing data
     */
    public update(){
        this.message = '';

        // update data received form storage.
        this.fileService.updateStorage();

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
