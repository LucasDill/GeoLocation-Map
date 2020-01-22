import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TreatmentPage } from '../treatment/treatment';
import { MapPage } from '../map/map';

@Component({
  selector: 'page-advanced-imaging',
  templateUrl: 'advanced-imaging.html'
})
export class AdvancedImagingPage {

  constructor(public navCtrl: NavController) {
  }
  goToTreatment(params){
    if (!params) params = {};
    this.navCtrl.push(TreatmentPage);
  }goToMap(params){
    if (!params) params = {};
    this.navCtrl.push(MapPage);
  }
}
