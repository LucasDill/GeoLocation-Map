import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LastKnownWellPage } from '../last-known-well/last-known-well';

@Component({
  selector: 'page-patient-location',
  templateUrl: 'patient-location.html'
})
export class PatientLocationPage {

  constructor(public navCtrl: NavController) {
  }
  goToLastKnownWell(params){
    if (!params) params = {};
    this.navCtrl.push(LastKnownWellPage);
  }
}
