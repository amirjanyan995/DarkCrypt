import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { EncodeProvider } from "../../../providers/encode/encode";

@IonicPage()
@Component({
  selector: 'page-encode-photo',
  templateUrl: 'encode-photo.html',
})
export class EncodePhotoPage {

  constructor(public encode: EncodeProvider) {

  }

}
