import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { ImagingPage } from '../imaging/imaging';
import { from } from 'rxjs';
import { DataServiceProvider } from '../../providers/providers/data-service';
import { TPaQuestionPage } from '../t-pa-question/t-pa-question';

@Component({
  selector: 'page-imaging-required',
  templateUrl: 'imaging-required.html'
})
export class ImagingRequiredPage {

  constructor(public navCtrl: NavController, public navParams:NavParams,public Data: DataServiceProvider) {
    
  }
  ionViewDidLoad()
  {
    
  }
  goToTpaQuestion(params){
    if (!params) params = {};
    this.navCtrl.push(TPaQuestionPage);
    this.Data.NeedImaging=false;
  }
  goToImagingRoutes(params){
    if (!params) params = {};
    this.navCtrl.push(ImagingPage);
    this.Data.NeedImaging=true;
  }
   
 
}