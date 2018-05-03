import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DecodePhotoPage } from './decode-photo';

@NgModule({
  declarations: [
    DecodePhotoPage,
  ],
  imports: [
    IonicPageModule.forChild(DecodePhotoPage),
  ],
})
export class DecodePhotoPageModule {}
