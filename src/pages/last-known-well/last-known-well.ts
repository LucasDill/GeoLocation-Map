import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ImagingRequiredPage } from '../imaging-required/imaging-required';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms"
import { formControlBinding } from '@angular/forms/src/directives/ng_model';

@Component({
  selector: 'page-last-known-well',
  templateUrl: 'last-known-well.html'
})
export class LastKnownWellPage {
timeForm =new FormGroup({
  time1: new FormControl('',Validators.required),
  timeHTML: new FormControl('',Validators.required),
  Hours: new FormControl('',Validators.required),
  Mins: new FormControl('',[Validators.required,Validators.pattern("^[0-9]*$"),Validators.min(0),Validators.max(60)]),
});
  constructor(public navCtrl: NavController, public formBuilder: FormBuilder) {
  }
  goToImagingRequired(params){
  if (!params) params = {};
    this.navCtrl.push(ImagingRequiredPage);
}
SubmitTime(){
  console.warn(this.timeForm.value);
  this.navCtrl.push(ImagingRequiredPage);
}
  
}
