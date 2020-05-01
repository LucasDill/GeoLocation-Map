import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms"
import * as moment from 'moment';
import { DataServiceProvider } from '../../providers/data-service';
import { PatientLocationPage } from '../patient-location/patient-location';

@Component({
  selector: 'page-last-known-well',
  templateUrl: 'last-known-well.html'
})
export class LastKnownWellPage {

myDate=moment().format("HH:mm");//sets the current time option for the last known well based on the time of the machine 
timeForm =new FormGroup({//creates a new form with the last known well 
  time1: new FormControl('',Validators.required),//set the form time with valdators required so they need to be entered in order to continue 
});
  constructor(public navCtrl: NavController, public formBuilder: FormBuilder,public Data: DataServiceProvider) {
   //console.log(this.myDate);//Use of the current machine time for the initial timer value 
  }
  
SubmitTime(params){//once the button is clicked to go to the next page it will push to the PatientLocationPage
  if (!params) params = {};//set the parameters to null if there are none 
    this.navCtrl.push(PatientLocationPage);//go to the next page 
    this.Data.time=this.timeForm.value.time1;//set the time on the data page which will start the tier 
    if(this.Data.LastKnownWellTime!=this.timeForm.value.time1)//only stop if a new a new time is provided 
    {
      clearInterval(this.Data.intervalID);//stops the previous interval from running 
      this.Data.StartTime(this.timeForm.value.time1);// send the new time 
    }
}
  
}