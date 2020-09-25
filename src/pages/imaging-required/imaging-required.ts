import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { ImagingPage } from '../imaging/imaging';
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

  ionViewWillEnter()
  {
    this.Data.TelestrokePlan=false;//every time there is a new place it will reset the variable so it does not always go to the special case 
  }

  goToTpaQuestion(){//If the user clicks no they will be brought to the tpa question page 
    this.Data.Analytics.ImagingRequired="No";
    this.navCtrl.push(TPaQuestionPage);
    this.Data.NeedImaging=false;// set the NeedImaging Option to false but I do not think this is currently in use 
  }
  goToImagingRoutes(){//If the user selects yes then they will be brought to the imaging routes page 
    this.Data.Analytics.ImagingRequired="Yes";
    this.Data.TelestrokePlan=true;
    this.navCtrl.push(ImagingPage);
    this.Data.NeedImaging=true;//The needImaging will be set to true but I still do not think this is being used by anything yet 
  }
   
 
}