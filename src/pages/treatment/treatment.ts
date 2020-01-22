import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MapPage } from '../map/map';

@Component({
  selector: 'page-treatment',
  templateUrl: 'treatment.html'
})
export class TreatmentPage {

  constructor(public navCtrl: NavController) {
  }
  goToMap(params){
    if (!params) params = {};
    this.navCtrl.push(MapPage);
  }
}
