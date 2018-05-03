import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EncodePhotoPage } from './encode-photo';

@NgModule({
  declarations: [
    EncodePhotoPage,
  ],
  imports: [
    IonicPageModule.forChild(EncodePhotoPage),
  ],
})
export class EncodePhotoPageModule {}
