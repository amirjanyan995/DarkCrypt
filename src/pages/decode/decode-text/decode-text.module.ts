import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DecodeTextPage } from './decode-text';

@NgModule({
  declarations: [
    DecodeTextPage,
  ],
  imports: [
    IonicPageModule.forChild(DecodeTextPage),
  ],
})
export class DecodeTextPageModule {}
