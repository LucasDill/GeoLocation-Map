import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms"
import { DataServiceProvider } from '../../providers/providers/data-service';
import {PatientLocationPage } from '../patient-location/patient-location';
/**
 * Generated class for the LamsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lams',
  templateUrl: 'lams.html',
})
export class LamsPage {

  LamsForm =new FormGroup({
    Lamsscore: new FormControl('',Validators.required),
  });
    constructor(public navCtrl: NavController, public formBuilder: FormBuilder,public Data: DataServiceProvider) {
     
    }
    
  
  SubmitLams(params){
    console.warn(this.LamsForm.value);
    if (!params) params = {};
      this.navCtrl.push(PatientLocationPage);
      this.Data.LAMS=this.LamsForm.value.Lamsscore;
      if(this.Data.LAMS!=this.LamsForm.value.Lamsscore)//only stop if a new a new time is provided 
      {
        this.Data.LAMS=this.LamsForm.value.Lamsscore;
      }
  }
    
  }


