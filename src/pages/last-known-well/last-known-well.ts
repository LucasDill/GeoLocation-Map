import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ImagingRequiredPage } from '../imaging-required/imaging-required';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms"
import { formControlBinding } from '@angular/forms/src/directives/ng_model';
import { DataServiceProvider } from '../../providers/data-service/data-service';
@Component({
  selector: 'page-last-known-well',
  templateUrl: 'last-known-well.html'
})
export class LastKnownWellPage {
 
timeForm =new FormGroup({
  time1: new FormControl('',Validators.required),
});
  constructor(public navCtrl: NavController, public formBuilder: FormBuilder,public Data: DataServiceProvider) {
   
  }
  
  goToImagingRequired(params){
  if (!params) params = {};
    this.navCtrl.push(ImagingRequiredPage);
}
SubmitTime(params){
  console.warn(this.timeForm.value);
  if (!params) params = {};
    this.navCtrl.push(ImagingRequiredPage,this.timeForm.value);
    this.Data.time=this.timeForm.value.time1;
    console.log(this.Data.intervalID);
    if(this.Data.LastKnownWellTime!=this.timeForm.value.time1)//only stop if a new a new time is provided 
    {
      clearInterval(this.Data.intervalID);//stops the previous interval from running 
      this.Data.StartTime(this.timeForm.value.time1);// send the new time 
    }
}
  
}