import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EncodePage } from './encode';

@NgModule({
  declarations: [
    EncodePage,
  ],
  imports: [
    IonicPageModule.forChild(EncodePage),
  ],
})
export class EncodePageModule {}
