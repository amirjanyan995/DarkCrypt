import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { EncodeProvider } from "../../../providers/encode/encode";

@IonicPage()
@Component({
  selector: 'page-encode-review',
  templateUrl: 'encode-review.html',
})
export class EncodeReviewPage {

  constructor(public encode:EncodeProvider) {

  }

}
