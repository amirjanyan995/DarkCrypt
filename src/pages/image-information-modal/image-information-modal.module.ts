import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageInformationModalPage } from './image-information-modal';

@NgModule({
  declarations: [
    ImageInformationModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ImageInformationModalPage),
  ],
})
export class ImageInformationModalPageModule {}
