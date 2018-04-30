import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { List } from "ionic-angular";

import { Storage } from '@ionic/storage';
import { TranslateService } from "@ngx-translate/core";
/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html',
})

export class SettingsPage {
    @ViewChild(List) list: List;

    private language:string;
    private extension:string;

    // Project languages
    public languages:any = [
        {
            value: 'en',
            name:'English'
        },{
            value:'ru',
            name:'Русский'
        },{
            value:'am',
            name:'Հայերեն'
        }];

    // Output file extensions
    public extensions:any = [
        {
            value: 'jpg',
            name: 'JPG'
        },{
            value: 'png',
            name: 'PNG'
        }];

    constructor(
        private translate: TranslateService,
        private storage: Storage)
    {
        // set language
        this.storage.get('language').then((language) => {
            if( language == null ) {
                this.storage.set('language', 'en');
                this.language = 'en'
            } else {
                this.language = language
            }
            this.translate.use(this.language);
        });

        // set output file extension
        this.storage.get('extension').then((extension) => {
            if ( extension == null ) {
                this.storage.set('extension', 'jpg');
                this.extension =  'jpg'
            } else {
                this.extension = extension
            }
        });
    }

    /**
     *  Select Language
     */
    selectLanguage(){
        this.storage.set('language', this.language);
        this.translate.use(this.language);

    }

    /**
     * Select output file extension
     */
    selectExtension(){
        this.storage.set('extension', this.extension);
    }

}
