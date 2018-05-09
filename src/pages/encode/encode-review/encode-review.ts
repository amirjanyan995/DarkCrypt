import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import {EncodeServiceProvider} from "../../../providers/encode-service/encode-service";

@IonicPage()
@Component({
  selector: 'page-encode-review',
  templateUrl: 'encode-review.html',
})
export class EncodeReviewPage {

  constructor(public encodeService:EncodeServiceProvider) {

  }
}
