import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { TreatmentPage } from '../treatment/treatment';
import { MapPage } from '../map/map';
import { TelestrokeSitePage } from '../telestroke-site/telestroke-site';
import { AdvancedImagingPage } from '../advanced-imaging/advanced-imaging';
import { LastKnownWellPage } from '../last-known-well/last-known-well';

@Component({
  selector: 'page-imaging-required',
  templateUrl: 'imaging-required.html'
})
export class ImagingRequiredPage {

  constructor(public navCtrl: NavController, public navParams:NavParams) {
    
  }
  ionViewDidLoad()
  {
    console.log(this.navParams.get('time1'));
  }
  goToTreatment(params){
    if (!params) params = {};
    this.navCtrl.push(TreatmentPage);
  }goToMap(params){
    if (!params) params = {};
    this.navCtrl.push(MapPage);
  }goToTelestrokeSite(params){
    if (!params) params = {};
    this.navCtrl.push(TelestrokeSitePage);
  }goToAdvancedImaging(params){
    if (!params) params = {};
    this.navCtrl.push(AdvancedImagingPage);
  }
   // Update the count down every 1 second
    x = setInterval(function () {

    // Get todays date and time
    let now = new Date().getTime();
    // Output the result in an element with id="demo"
    document.getElementById("demo").innerHTML = ""+now;

    // If the count down is over, write some text 
  }, 1000);
 
}
