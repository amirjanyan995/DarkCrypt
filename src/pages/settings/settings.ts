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

    private language:any = 'en';
    private extension:any = 'jpg';
    private characterType:any = 'unicode';

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

    // Characters type
    public charactersType:any = [
        {
            value: 'ascii',
            name: 'ASCII'
        },{
            value: 'unicode',
            name: 'Unicode'
        }];

    constructor(
        private translate: TranslateService,
        private storage: Storage)
    {
        // set language
        this.storage.get('language').then((language) => {
            this.storage.set('language', language);
            this.language = language
            this.translate.use(language);
        });

        // set output file extension
        this.storage.get('extension').then((extension) => {
            this.storage.set('extension', extension);
            this.extension = extension
        });

        // set characters type
        this.storage.get('character_type').then((type) => {
            this.storage.set('character_type', type);
            this.characterType = type
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

    /**
     * Set characters type
     */
    selectCharacterType(){
        this.storage.set('character_type', this.characterType)
    }

}
