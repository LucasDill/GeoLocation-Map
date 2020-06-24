import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapExplorePage } from './map-explore';

@NgModule({
  declarations: [
    MapExplorePage,
  ],
  imports: [
    IonicPageModule.forChild(MapExplorePage),
  ],
})
export class MapExplorePageModule {}
