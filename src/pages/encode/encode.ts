import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ActionSheetController, ToastController, Platform, LoadingController } from 'ionic-angular';
import { ImagePicker } from "@ionic-native/image-picker";
import { Clipboard } from '@ionic-native/clipboard';

// inner pages
import { EncodePhotoPage } from "./encode-photo/encode-photo";
import { EncodeTextPage } from "./encode-text/encode-text";
import { EncodeReviewPage } from "./encode-review/encode-review";

import { SuperTabsController } from "ionic2-super-tabs";

import { EncodeProvider } from "../../providers/encode/encode";

import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from "@ionic-native/camera";
import { Content } from "ionic-angular";
import { ElementRef } from "@angular/core";
import { Storage } from "@ionic/storage";

declare var cordova: any;

@IonicPage()
@Component({
    selector: 'page-encode',
    templateUrl: 'encode.html',
})
export class EncodePage {
    @ViewChild( Content ) content: Content;
    @ViewChild('myInput') myInput: ElementRef;

    public encodePhoto:any = EncodePhotoPage;
    public encodeText:any = EncodeTextPage;
    public encodeReview:any = EncodeReviewPage;

    private lastImage:any = null;
    private message:string;
    private outputFileName: string;
    private password: string;

    constructor(
        public navCtrl: NavController,
        private superTabsCtrl: SuperTabsController,
        public encode: EncodeProvider,
        private camera: Camera,
        private transfer: Transfer,
        private file: File,
        private filePath: FilePath,
        public actionSheetCtrl: ActionSheetController,
        public toastCtrl: ToastController,
        public platform: Platform,
        private imagePicker: ImagePicker,
        private clipboard: Clipboard,
        private storage: Storage,)
    {

    }

    resize() {
        this.myInput.nativeElement.style.height = (this.content.contentHeight - (this.content.contentHeight * 0.2178)) + 'px';
    }

    // Past copyed text
    public past() {
        this.clipboard.paste().then(
            (resolve: string) => {
                this.message += resolve;
            },
            (reject: string) => {}
        );
    }

    // Take new photo from camera or gallery
    private takePhoto(sourceType) {
        if (sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
            this.imagePicker.getPictures({
                maximumImagesCount: 1,
                quality: 100
            }).then( imagePath => {
                if(imagePath.length) {
                    imagePath = imagePath[0];
                    let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                    let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                    this.copyFileToDir(correctPath,currentName, cordova.file.dataDirectory , this.createTempFileName());

                    /*this.checkAndCreateDir(cordova.file.externalRootDirectory, this.folderName).then(success => {
                        // let newDirName = cordova.file.externalRootDirectory + this.folderName + '/';
                        // TODO copy
                    }).catch(err => {
                        this.presentToast('Something went wrong.');
                    })*/
                }
            });
        } else {
            // Create options for the Camera Dialog
            var options = {
                quality: 100,
                sourceType: sourceType,
                saveToPhotoAlbum: false,
                correctOrientation: true
            };
            // Get the data of an image
            this.camera.getPicture(options).then((imagePath) => {
                let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                this.copyFileToDir(correctPath,currentName, cordova.file.dataDirectory , this.createTempFileName());

                /*this.checkAndCreateDir(cordova.file.externalRootDirectory, this.folderName).then(success => {
                    let newDirName = cordova.file.externalRootDirectory + this.folderName + '/';
                    // TODO copy
                }).catch(err => {
                    this.presentToast('Something went wrong.');
                })*/
            });
        }
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

    // Create a new name for the image
    private createTempFileName() {
        var d = new Date(),
            n = d.getTime(),
            newFileName =  n + ".jpg";

        return newFileName;
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

    // // Always get the accurate path to your project created folder
    // public pathForProjectImage(img) {
    //     return img === null ? 'assets/imgs/misc/img-icon.png' : this.file.externalRootDirectory + this.folderName + '/' + img;
    // }
    //
    // // Always get the accurate path to your apps folder
    // public pathForCacheImage(img) {
    //     return img === null ? 'assets/imgs/misc/img-icon.png' : this.file.dataDirectory + '/' + img;
    // }

    // /**
    //  *  Encode
    //  */
    // public encode() {
    //     this.checkAndCreateDir(cordova.file.externalRootDirectory, this.folderName).then(success => {
    //         let newDirName = cordova.file.externalRootDirectory + this.folderName + '/';
    //         if( this.copyFileToDir(this.file.dataDirectory,this.lastImage, newDirName , this.outputFileName + '.jpg')) {
    //             this.presentToast('Encoding successfully done.');
    //         }
    //     }).catch(err => {
    //         this.presentToast('Something went wrong.');
    //     })
    // }
}
