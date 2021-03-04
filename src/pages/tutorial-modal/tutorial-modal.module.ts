import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TutorialModalPage } from './tutorial-modal';

@NgModule({
  declarations: [
    TutorialModalPage,
  ],
  imports: [
    IonicPageModule.forChild(TutorialModalPage),
  ],
})
export class TutorialModalPageModule {}
