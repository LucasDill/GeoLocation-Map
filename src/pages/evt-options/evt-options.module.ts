import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EvtOptionsPage } from './evt-options';

@NgModule({
  declarations: [
    EvtOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(EvtOptionsPage),
  ],
})
export class EvtOptionsPageModule {}
