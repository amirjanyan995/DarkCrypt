import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { List } from "ionic-angular";

import { Storage } from '@ionic/storage';

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
            value: 'english',
            name:'English'
        },{
            value:'russian',
            name:'Русский'
        },{
            value:'armenian',
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

    constructor(private storage: Storage) {
        // set language
        this.storage.get('language').then((language) => {
            this.language = ( language == null ) ? 'english' : language;
        });

        // set output file extension
        this.storage.get('extension').then((extension) => {
            this.extension = ( extension == null ) ? 'jpg' : extension;
        });
    }

    /**
     *  Select Language
     */
    selectLanguage(){
        this.storage.set('language', this.language);
    }

    /**
     * Select output file extension
     */
    selectExtension(){
        this.storage.set('extension', this.extension);
    }

}
