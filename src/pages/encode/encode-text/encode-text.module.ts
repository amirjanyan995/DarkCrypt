import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EncodeTextPage } from './encode-text';

@NgModule({
  declarations: [
    EncodeTextPage,
  ],
  imports: [
    IonicPageModule.forChild(EncodeTextPage),
  ],
})
export class EncodeTextPageModule {}
