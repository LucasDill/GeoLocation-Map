import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { TreatmentPage } from '../treatment/treatment';
import { MapPage } from '../map/map';
import { ImagingPage } from '../imaging/imaging';
import { TelestrokeSitePage } from '../telestroke-site/telestroke-site';
import { AdvancedImagingPage } from '../advanced-imaging/advanced-imaging';
import { LastKnownWellPage } from '../last-known-well/last-known-well';
import { from } from 'rxjs';
import { DataServiceProvider } from '../../providers/providers/data-service';

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
  goToMap(params){
    if (!params) params = {};
    this.navCtrl.push(MapPage);
    this.Data.NeedImaging=false;
  }
  goToImagingRoutes(params){
    if (!params) params = {};
    this.navCtrl.push(ImagingPage);
    this.Data.NeedImaging=true;
  }
   
 
}