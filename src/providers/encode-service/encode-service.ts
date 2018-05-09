import { Injectable} from '@angular/core';
import { Camera } from "@ionic-native/camera";
import { PhotoServiceProvider } from "../photo-service/photo-service";
import { FileServiceProvider } from "../file-service/file-service";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import * as Const from '../../util/constants';
import { ToastController } from "ionic-angular";
import { Clipboard } from "@ionic-native/clipboard";
import {SuperTabsController} from "ionic2-super-tabs";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class EncodeServiceProvider {
    private lastImage:any = null;
    private lastPath:any = null;
    public message:string;
    public outputFileName:string;
    public password:string;

    constructor(
        public translate: TranslateService,
        private superTabsCtrl: SuperTabsController,
        public toastCtrl: ToastController,
        public clipboard: Clipboard,
        private camera:Camera,
        private photoViewer: PhotoViewer,
        private photoService:PhotoServiceProvider,
        private fileService:FileServiceProvider)
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
                // this.data = data;
                this.lastImage = data[0].name
                this.lastPath = data[0].path
            }).catch( err => {
                console.log(err)
                this.presentToast('Something went wrong.');
            });
        } else {
            this.photoService.takePhotoFromGallery().then( data => {
                this.lastImage = data[0].name
                this.lastPath = data[0].path
            }).catch(err => {
                console.log(err);
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
        this.lastImage = null;
        this.lastPath = null;
    }

    /**
     * Encode Image
     */
    public encode(){
        console.log(this.message);
        console.log(this.outputFileName);

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
        this.fileService.copyFileToProjectDir(this.lastPath,this.lastImage, this.outputFileName)
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
        this.outputFileName = '';
        this.password = '';

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
