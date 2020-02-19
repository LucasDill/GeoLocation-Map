import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PatientLocationPage } from '../patient-location/patient-location';

/**
 * Generated class for the LvoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lvo',
  templateUrl: 'lvo.html',
})
export class LvoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LvoPage');
  }
 /* goToLAMS(){
    this.navCtrl.push(TelestrokeSitePage);
  }*///untill the LAMS page has been made 
  goToLocation(params){
    if (!params) params = {};
    this.navCtrl.push(PatientLocationPage);
  }

}
