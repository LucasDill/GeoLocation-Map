import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AdvancedImagingPage } from '../advanced-imaging/advanced-imaging';
import { TreatmentPage } from '../treatment/treatment';
import { MapPage } from '../map/map';

@Component({
  selector: 'page-telestroke-site',
  templateUrl: 'telestroke-site.html'
})
export class TelestrokeSitePage {

  constructor(public navCtrl: NavController) {
  }
  goToAdvancedImaging(params){
    if (!params) params = {};
    this.navCtrl.push(AdvancedImagingPage);
  }goToTreatment(params){
    if (!params) params = {};
    this.navCtrl.push(TreatmentPage);
  }goToMap(params){
    if (!params) params = {};
    this.navCtrl.push(MapPage);
  }
}
