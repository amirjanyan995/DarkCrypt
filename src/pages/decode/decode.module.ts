import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DecodePage } from './decode';

@NgModule({
  declarations: [
    DecodePage,
  ],
  imports: [
    IonicPageModule.forChild(DecodePage),
  ],
})
export class DecodePageModule {}
