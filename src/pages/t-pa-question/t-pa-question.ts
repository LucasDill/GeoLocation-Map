import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/providers/data-service';
import { EvtOptionsPage } from '../evt-options/evt-options';
import { TreatmentPage } from '../treatment/treatment';
/**
 * Generated class for the TPaQuestionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-t-pa-question',
  templateUrl: 't-pa-question.html',
})
export class TPaQuestionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public Data: DataServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TPaQuestionPage');
  }
  goToEVTOptions(params){
    if (!params) params = {};
    this.navCtrl.push(EvtOptionsPage);
    this.Data.NeedImaging=false;
  }
  goToTreatment(params){
    if (!params) params = {};
    this.navCtrl.push(TreatmentPage);
    this.Data.hadtPA=false;
  }

}
