import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImagingPage } from './imaging';

@NgModule({
  declarations: [
    ImagingPage,
  ],
  imports: [
    IonicPageModule.forChild(ImagingPage),
  ],
})
export class ImagingPageModule {}
