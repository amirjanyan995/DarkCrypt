import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import {DecodeServiceProvider} from "../../../providers/decode-service/decode-service";

@IonicPage()
@Component({
  selector: 'page-decode-text',
  templateUrl: 'decode-text.html',
})
export class DecodeTextPage {

  constructor(public decodeService:DecodeServiceProvider) {
  }

}
