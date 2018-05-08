import { Injectable } from '@angular/core';
import { ImagePicker } from "@ionic-native/image-picker";
import { Camera } from "@ionic-native/camera";
import {AlertController, ModalController} from "ionic-angular";

@Injectable()
export class PhotoServiceProvider {

    constructor(
        private imagePicker: ImagePicker,
        private camera:Camera,
        public modalCtrl: ModalController,
        public alertCtrl: AlertController
    ){
    }

    /**
     * Take Photo From Gallery
     * resolve({
     *    name: - File Name,
     *    pathName: - File Current Path
     * })
     * @returns {Promise<any>}
     */
    public takePhotoFromGallery(){
        let self = this;
        let promise = new Promise((resolve, reject) => {
            self.imagePicker.getPictures({
                maximumImagesCount: 1,
                quality: 100
            }).then( imagePath => {
                if(imagePath.length) {
                    imagePath = imagePath[0];;
                    let data:Array<{name:string, path:string}> = [
                        {
                            name: imagePath.substr(imagePath.lastIndexOf('/') + 1),
                            path: imagePath.substr(0, imagePath.lastIndexOf('/') + 1)
                        }];
                    resolve(data)
                }
            }).catch(err => {
                reject(err);
            });
        });
        return promise;
    }

    /**
     * Take Photo From Camera
     * resolve({
     *    name: - File Name,
     *    pathName: - File Current Path
     * })
     * @returns {Promise<any>}
     */
    public takePhotoFromCamera(){
        var options = {
            quality: 100,
            sourceType: this.camera.PictureSourceType.CAMERA,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };

        let self = this;
        let promise = new Promise((resolve, reject) => {
            self.camera.getPicture(options).then(imagePath => {
                let data:Array<{name:string, path:string}> = [
                    {
                        name: imagePath.substr(imagePath.lastIndexOf('/') + 1),
                        path: imagePath.substr(0, imagePath.lastIndexOf('/') + 1)
                    }];
                resolve(data)
            }).catch( err => {
                reject(err);
            });
        })
        return promise;
    }


    public showInformation(data:any){
        let img = new Image();
        img.src = data.path;
        let alert = this.alertCtrl.create({
            title: 'Details',
            message:
            '<p>Name: ' + data.name + '</p>' +
            '<p>Width: ' + img.width + 'px </p>' +
            '<p>Height: ' + img.height + 'px </p>' +
            '<p>Size: ' + data.size + ' </p>' +
            '<p>Date: ' + data.date + ' </p>' +
            '<p>Path: ' + data.path + ' </p>',
            cssClass: 'img-information'
        });
        alert.present();
    }
}
