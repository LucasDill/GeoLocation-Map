import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { ImagingPage } from '../imaging/imaging';
import { from } from 'rxjs';
import { DataServiceProvider } from '../../providers/data-service';
import { TPaQuestionPage } from '../t-pa-question/t-pa-question';
import { RoutingProvider } from '../../providers/routing';

@Component({
  selector: 'page-imaging-required',
  templateUrl: 'imaging-required.html'
})
export class ImagingRequiredPage {

  constructor(public navCtrl: NavController, public navParams:NavParams,public Data: DataServiceProvider,public Routes:RoutingProvider) {
    
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
    this.Routes.getImaging();
    this.navCtrl.push(ImagingPage);
    this.Data.NeedImaging=true;
  }
   
 
}