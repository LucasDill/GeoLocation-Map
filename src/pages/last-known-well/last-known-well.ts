import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ImagingRequiredPage } from '../imaging-required/imaging-required';
import { FormGroup, FormBuilder, Validators } from "@angular/forms"

@Component({
  selector: 'page-last-known-well',
  templateUrl: 'last-known-well.html'
})
export class LastKnownWellPage {

  constructor(public navCtrl: NavController) {
  }
  goToImagingRequired(params){
  if (!params) params = {};
    this.navCtrl.push(ImagingRequiredPage);
  }

  
}
