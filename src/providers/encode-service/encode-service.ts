import { Injectable } from '@angular/core';
import { Camera } from "@ionic-native/camera";
import { PhotoServiceProvider } from "../photo-service/photo-service";
import { FileServiceProvider } from "../file-service/file-service";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import * as Const from '../../util/constants';
import { ToastController} from "ionic-angular";

@Injectable()
export class EncodeServiceProvider {

    private lastImage:any = null;
    private lastPath:any = null;

    constructor(
        private camera:Camera,
        public toastCtrl: ToastController,
        private photoViewer: PhotoViewer,
        private photoService:PhotoServiceProvider,
        private fileService:FileServiceProvider)
    {

    }

    /**
     * Take Photo
     *
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
     *  Show selected image into modal
     */
    public showImg(){
        if (this.lastPath != null && this.lastImage != null) {
            this.photoViewer.show(this.lastPath + this.lastImage);
        }
    }

    public showInformation(){
        if (this.lastPath === null || this.lastImage === null) return;
        this.fileService.getImgFile(this.lastPath,this.lastImage).then(data => {
            this.photoService.showInformation(data)
        }).catch(err => {
            console.log(err)
        });
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

    /**
     * Show Message
     * @param text
     */
    private presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }
}
