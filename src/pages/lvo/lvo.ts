import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PatientLocationPage } from '../patient-location/patient-location';
import { DataServiceProvider } from '../../providers/providers/data-service';
import { LamsPage } from '../lams/lams';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,public Data: DataServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LvoPage');
  }
  goToLAMS(){
    this.navCtrl.push(LamsPage);
    this.Data.LvoUsed=false;
  } 
  goToLocation(params){
    if (!params) params = {};
    this.Data.LvoUsed=true;
    this.navCtrl.push(PatientLocationPage);
  }

}
