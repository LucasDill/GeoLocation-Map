import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service';
import { EvtOptionsPage } from '../evt-options/evt-options';
import { TPaNoPage } from '../t-pa-no/t-pa-no';
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
  ionViewWillEnter(){
    this.Data.NeedtPA=true;
  }
//This is a simple question page for navigating the application 
  goToEVTOptions(){//if the user selects yes they will be brought to the EvtOptions page and the hadTpa Data will be set to true although I do not think it is being used at the moment
    this.Data.Analytics.tPAReceived="Yes";
    this.Data.NeedtPA=false; 
    this.navCtrl.push(EvtOptionsPage);
    this.Data.hadtPA=true;
  }
  goToTreatment(){//If the user Selects no They will be brought to the treatment page and hadtPA will be set to false although I do not think it is used at the moment 
    this.Data.Analytics.tPAReceived="No";
   //this.navCtrl.push(TreatmentPage);//?Used to go to treatment 
   this.navCtrl.push(TPaNoPage);//?now goes to temporary page 
    this.Data.hadtPA=false;
  }

}
