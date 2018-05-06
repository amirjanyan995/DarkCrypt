import { Component } from '@angular/core';
import {IonicPage, NavParams, Platform, ViewController} from 'ionic-angular';

/**
 * Generated class for the ImageInformationModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-image-information-modal',
    templateUrl: 'image-information-modal.html',
})
export class ImageInformationModalPage {

    public path:string;
    constructor(public platform: Platform, params: NavParams,public viewCtrl: ViewController) {
        this.path = params.get('imgPath');
    }

    /**
     * Close Modal
     */
    public closeModal(){
      this.viewCtrl.dismiss();
    }
}
