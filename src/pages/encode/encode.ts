import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { Camera, CameraOptions} from "@ionic-native/camera";
import {ImagePicker} from "@ionic-native/image-picker";
import { ElementRef } from "@angular/core";
import { Clipboard } from '@ionic-native/clipboard';

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
        public navParams: NavParams,
        private camera:Camera,
        private imagePicker: ImagePicker,
        private clipboard: Clipboard)
    {
        this.clipboard.copy('Hello world');
        this.tabs=["Photo","Text","Review"];
    }
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

    /**
     *  text area resize
     */
    resize() {
        this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
        console.log(this.myInput.nativeElement);
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
     *  remove message
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
