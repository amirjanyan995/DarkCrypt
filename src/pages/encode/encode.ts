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
    private message:string;
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
        this.clipboard.copy('Hello world');
        this.tabs=["Photo","Text","Review"];
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
     *  Remove message
     */
    clearMessage() {
        this.message = '';
    }

    /**
     *  Open Gallery and choose a photo
     */
    openGallery() {
        this.imagePicker.getPictures({
                maximumImagesCount: 1,
                quality: 75
        }).then( results =>{
            if(results.length >= 1 ) {
                this.photo = results[0];
            }
        });
    }

    /**
     *  Open camera and take a photo
     */
    takePhoto() {
        const options: CameraOptions = { quality : 75,
            destinationType : this.camera.DestinationType.DATA_URL,
            sourceType : this.camera.PictureSourceType.CAMERA,
            encodingType: this.camera.EncodingType.JPEG,
            saveToPhotoAlbum: false
        };
        this.camera.getPicture(options).then((imageData) => {
            this.photo = 'data:image/jpeg;base64,' + imageData;
        }, (err) => {
        });
    }
}
