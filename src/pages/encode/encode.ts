import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Slides } from 'ionic-angular';
import { ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { ImagePicker } from "@ionic-native/image-picker";
import { ElementRef } from "@angular/core";
import { Clipboard } from '@ionic-native/clipboard';

import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions} from "@ionic-native/camera";

declare var cordova: any;

@IonicPage()
@Component({
    selector: 'page-encode',
    templateUrl: 'encode.html',
})
export class EncodePage {
    @ViewChild('SwipedTabsSlider') SwipedTabsSlider: Slides ;
    @ViewChild('myInput') myInput: ElementRef;
    SwipedTabsIndicator :any= null;
    tabs:any=[];

    private photo:any;
    private lastImage:any;
    private message:string;
    private folderName = 'DarkCrypt';

    constructor(
        public navCtrl: NavController,
        private camera: Camera,
        private transfer: Transfer,
        private file: File,
        private filePath: FilePath,
        public actionSheetCtrl: ActionSheetController,
        public toastCtrl: ToastController,
        public platform: Platform,
        public loadingCtrl: LoadingController,
        private imagePicker: ImagePicker,
        private clipboard: Clipboard,)
    {
        this.tabs=["Photo","Text","Review"];
    }

    presentActionSheet() {

        const actionsheet = this.actionSheetCtrl.create({
            title: 'Select picture',
            buttons: [
                {
                    text: 'camera',
                    icon: !this.platform.is('ios') ? 'camera' : null,
                    handler: () => {
                        this.takePhoto(this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: !this.platform.is('ios') ? 'gallery' : 'camera roll',
                    icon: !this.platform.is('ios') ? 'image' : null,
                    handler: () => {
                        this.takePhoto(this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                },
                {
                    text: 'cancel',
                    icon: !this.platform.is('ios') ? 'close' : null,
                    role: 'destructive',
                    handler: () => {

                    }
                }
            ]
        });
        return actionsheet.present();
    }
    // slider
    ionViewDidEnter() {
        this.SwipedTabsIndicator = document.getElementById("indicator");
    }

    selectTab(index) {
        this.SwipedTabsIndicator.style.webkitTransform = 'translate3d('+(100*index)+'%,0,0)';
        this.SwipedTabsSlider.slideTo(index, 500);
    }

    updateIndicatorPosition() {
        // this condition is to avoid passing to incorrect index
        if( this.SwipedTabsSlider.length()> this.SwipedTabsSlider.getActiveIndex())
        {
            this.SwipedTabsIndicator.style.webkitTransform = 'translate3d('+(this.SwipedTabsSlider.getActiveIndex() * 100)+'%,0,0)';
        }
    }

    animateIndicator($event) {
        if(this.SwipedTabsIndicator)
            this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' + (($event.progress* (this.SwipedTabsSlider.length()-1))*100) + '%,0,0)';
    }
    // slider - end

    /**
     *  Text area resize
     */
    resize() {
        this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
    }

    past() {
        this.clipboard.paste().then(
            (resolve: string) => {
                this.message += resolve;
            },
            (reject: string) => {}
        );
    }

    /**
     *  Open camera and take a photo
     */
    takePhoto(sourceType) {
        if (sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
            this.imagePicker.getPictures({
                maximumImagesCount: 1,
                quality: 100
            }).then( imagePath => {
                if(imagePath.length) {
                    imagePath = imagePath[0];
                    let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                    let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);

                    this.checkProjectDir(cordova.file.externalRootDirectory, this.folderName).then(success => {
                        this.copyFileToProjectDir(correctPath,currentName, this.folderName, this.createTempFileName());
                    }).catch(err => {
                        this.presentToast('Something went wrong.');
                    })
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

                this.checkProjectDir(cordova.file.externalRootDirectory, this.folderName).then(success => {
                    this.copyFileToProjectDir(correctPath,currentName, this.folderName, this.createTempFileName());
                }).catch(err => {
                    this.presentToast('Something went wrong.');
                })
            });
        }
    }

    // Create a new name for the image
    private createTempFileName() {
        var d = new Date(),
            n = d.getTime(),
            newFileName =  n + ".jpg";

        return newFileName;
    }

    // Check if project gallery directory is not exist then create
    private checkProjectDir(namePath,folderName){
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

    /**
     * Copy the image to a project gallery folder
     */
    private copyFileToProjectDir(namePath, currentName, newPathName, newFileName) {
        let newDirName = cordova.file.externalRootDirectory + newPathName + '/';

        this.file.copyFile(namePath, currentName, newDirName , newFileName).then(success => {
            this.lastImage = newFileName;
        }).catch(error => {
            this.presentToast('Error copy file');
        });
    }

    private presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }

    // Always get the accurate path to your apps folder
    public pathForImage(img) {
        if (img === null) {
            return '';
        } else {
            return cordova.file.externalRootDirectory + this.folderName + '/' + img;
        }
    }

}
