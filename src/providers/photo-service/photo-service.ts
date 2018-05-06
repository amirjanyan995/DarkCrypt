import { Injectable } from '@angular/core';
import {ImagePicker} from "@ionic-native/image-picker";
import {Camera} from "@ionic-native/camera";

@Injectable()
export class PhotoServiceProvider {

    constructor(
        private imagePicker: ImagePicker,
        private camera:Camera
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
                    resolve({
                        name: imagePath.substr(imagePath.lastIndexOf('/') + 1),
                        pathName: imagePath.substr(0, imagePath.lastIndexOf('/') + 1)
                    })
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
                resolve({
                    name: imagePath.substr(imagePath.lastIndexOf('/') + 1),
                    pathName: imagePath.substr(0, imagePath.lastIndexOf('/') + 1)
                })
            }).catch( err => {
                reject(err);
            });
        })
        return promise;
    }

}
