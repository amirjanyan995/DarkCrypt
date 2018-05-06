import { Injectable } from '@angular/core';
import {Camera} from "@ionic-native/camera";
import {PhotoServiceProvider} from "../photo-service/photo-service";
import {FileServiceProvider} from "../file-service/file-service";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import * as Const from '../../util/constants';

@Injectable()
export class EncodeServiceProvider {

    private lastImage:any = null;
    private lastPath:any = null;
    private data:any;

    constructor(
        private camera:Camera,
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
                this.data = data;
                this.lastImage = this.data.name
                this.lastPath = this.data.pathName
            }).catch( err => {
                console.log(err)
            });
        } else {
            this.photoService.takePhotoFromGallery().then( data => {
                this.data = data;
                this.lastImage = this.data.name
                this.lastPath = this.data.pathName
            }).catch(err => {
                console.log(err);
            })
        }
    }

    private subName(imagePath) {
        this.lastImage = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        this.lastPath= imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
    }

    /**
     * Remove Selected Photo
     */
    public removePhoto(){
        this.fileService.removeFile(this.lastPath,this.lastImage).catch(err => {
            console.log(err)
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
