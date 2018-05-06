import { Injectable } from '@angular/core';
import { File } from "@ionic-native/file";
import { ModalController, ToastController} from "ionic-angular";
import { ImagePicker } from "@ionic-native/image-picker";
import { Camera } from "@ionic-native/camera";
import { PhotoViewer } from '@ionic-native/photo-viewer';
import {Clipboard} from "@ionic-native/clipboard";
import { ImageInformationModalPage } from "../../pages/image-information-modal/image-information-modal";
import * as Const from '../../util/constants';
import {FileServiceProvider} from "../file-service/file-service";

declare var cordova: any;

@Injectable()
export class EncodeProvider {

    public lastImage:any = null;
    public message:string;

    private name:string;
    private path:string;

    constructor(
        private file: File,
        private photoViewer: PhotoViewer,
        public toastCtrl: ToastController,
        private imagePicker: ImagePicker,
        public camera: Camera,
        private clipboard: Clipboard,
        public modalCtrl: ModalController,
        private fileService: FileServiceProvider
    ) {
    }

    public showImg(){
        if (this.lastImage) {
            this.photoViewer.show(this.pathForCacheImage(this.lastImage));
        }
    }
    public showInformation() {
        let path = this.pathForCacheImage(this.lastImage);
        let imgInfoModal = this.modalCtrl.create(ImageInformationModalPage, {imgPath: path});
        imgInfoModal.present();
    }

    // Take new photo from camera or gallery
    public takePhoto(sourceType) {
        // if (sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        //     this.imagePicker.getPictures({
        //         maximumImagesCount: 1,
        //         quality: 100
        //     }).then( imagePath => {
        //         if(imagePath.length) {
        //             imagePath = imagePath[0];
        //             let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        //             let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        //             this.name = currentName;
        //             this.path = correctPath;
        //             this.copyFileToDir(correctPath,currentName, cordova.file.dataDirectory , this.createTempFileName());
        //         }
        //     });
        // } else {
        //     // Create options for the Camera Dialog
        //     var options = {
        //         quality: 100,
        //         sourceType: sourceType,
        //         saveToPhotoAlbum: false,
        //         correctOrientation: true
        //     };
        //     // Get the data of an image
        //     this.camera.getPicture(options).then((imagePath) => {
        //         let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        //         let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        //         this.copyFileToDir(correctPath,currentName, cordova.file.dataDirectory , this.createTempFileName());
        //     });
        // }
    }

// check directory if not exist then create it
    private checkAndCreateDir(namePath,folderName){
        let self = this;
        let promise = new Promise(function(resolve, reject)  {
            self.file.checkDir(namePath, folderName).then(exist => {
                resolve("Success");
            }).catch(err => {
                self.file.createDir(namePath, folderName, false)
                    .then(success => {
                        resolve("Success");
                    }).catch(err => {
                    reject("Error");
                })
            })
        });
        return promise;
    }

// Copy the image to a project gallery folder
    private copyFileToDir(namePath, currentName, newPathName, newFileName) {
        this.file.copyFile(namePath, currentName, newPathName , newFileName).then(success => {
            this.lastImage = newFileName;
            return true;
        }).catch(err => {
            this.presentToast('Error copy file');
        });
    }

// show toast message
    private presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }

// Create a new name for the image
    private createTempFileName() {
        var d = new Date(),
            n = d.getTime(),
            newFileName =  n + ".jpg";

        return newFileName;
    }

// Always get the accurate path to your project created folder
    public pathForProjectImage(img) {
        return img === null ? 'assets/imgs/misc/img-icon.png' : this.file.externalRootDirectory + Const.FOLDER_NAME + '/' + img;
    }

// Always get the accurate path to your apps folder
    public pathForCacheImage(img) {
        // return 'assets/imgs/misc/aaa.jpg'
        // return 'assets/imgs/misc/img-icon.png'
        return img === null ? 'assets/imgs/misc/img-icon.png' : this.file.dataDirectory + '/' + img;
    }



    ///////////////////
    cache(){
        this.fileService.copyFileToAppCacheDir(this.path,this.name, 'aaa.jpg').then( success => {
            console.log(success)
        }).catch( err => {
            console.log(err);
        })
    }

    project() {
        this.fileService.copyFileToProjectDir(this.path, this.name, 'bbb.jpg').then( success => {
            console.log(success)
        }).catch( err => {
            console.log(err);
        })
    }
    check(){
        this.fileService.checkAndCreateDir(this.file.externalRootDirectory, Const.FOLDER_NAME).then( (success) => {
            console.log(success)
        }).catch( err => {
            console.log(err);
        })
    }
}
