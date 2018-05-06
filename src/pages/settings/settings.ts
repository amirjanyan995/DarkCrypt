import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { List } from "ionic-angular";

import { Storage } from '@ionic/storage';
import { TranslateService } from "@ngx-translate/core";
import * as Const from '../../util/constants';

@IonicPage()
@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html',
})

export class SettingsPage {
    @ViewChild(List) list: List;

    private language:string;
    private extension:string;
    private characterType:string;

    // Project languages
    private languages: Array<{value: string, name: string}>;

    // Output file extensions
    private extensions: Array<{value: string, name: string}>;

    // Characters type
    private charactersType: Array<{value: string, name: string}>;

    constructor(
        private translate: TranslateService,
        private storage: Storage)
    {
        this.languages = [
            {
                value: Const.EN,
                name: Const.EN_NAME
            },{
                value: Const.RU,
                name: Const.RU_NAME
            },{
                value: Const.AM,
                name: Const.AM_NAME
            }];

        this.extensions = [
            {
                value: Const.JPG,
                name: Const.JPG_NAME
            },{
                value: Const.PNG,
                name: Const.PNG_NAME
            }];

        this.charactersType = [
            {
                value: Const.ASCII,
                name: Const.ASCII_NAME
            },{
                value: Const.UNICODE,
                name: Const.UNICODE_NAME
            }];

        this.initOptions();
    }

    /**
     *  Set Settings current options
     */
    private initOptions(){
        // set language
        this.storage.get( Const.LANGUAGE ).then((language) => {
            this.storage.set( Const.LANGUAGE, language);
            this.language = language
            this.translate.use(language);
        });

        // set output file extension
        this.storage.get( Const.EXTENSION ).then((extension) => {
            this.storage.set( Const.EXTENSION, extension);
            this.extension = extension
        });

        // set characters type
        this.storage.get(Const.CHARACTER_TYPE).then((type) => {
            this.storage.set(Const.CHARACTER_TYPE, type);
            this.characterType = type
        });
    }

    /**
     *  Select Language
     */
    private selectLanguage(){
        this.storage.set(Const.LANGUAGE, this.language);
        this.translate.use(this.language);

    }

    /**
     * Select output file extension
     */
    selectExtension(){
        this.storage.set(Const.EXTENSION, this.extension);
    }

    /**
     * Set characters type
     */
    selectCharacterType(){
        this.storage.set(Const.CHARACTER_TYPE, this.characterType)
    }

}
