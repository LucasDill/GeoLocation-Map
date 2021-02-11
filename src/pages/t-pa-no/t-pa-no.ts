import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AnyTxtRecord } from 'dns';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service';
import { EvtOptionsPage } from '../evt-options/evt-options';
import { MapExplorePage } from '../map-explore/map-explore';
import { TreatmentPage } from '../treatment/treatment';

/**
 * Generated class for the TPaNoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-t-pa-no',
  templateUrl: 't-pa-no.html',
})
export class TPaNoPage {

  TelePlan:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public Data: DataServiceProvider,private inAppBrowser: InAppBrowser) {
  }
ionViewWillEnter()
{
  const SpecialLoc=["MED_DRYDEN","MED_SIOUXLOOKOUT","MED_RIVERSIDE","MED_LOTW"];//Used for the under 6 hours for the 4 special sites
  this.Data.HadImg=true;
  if(this.Data.SinceTimeForm<12){
    this.TelePlan="2";
  }
  else{
    this.TelePlan="1";
  }
  
}

  ExploreMap(){
    this.Data.Analytics.OtherExplore=true;
    this.Data.CityMap=true;
    this.navCtrl.push(MapExplorePage);
  }
  
  
  
  GoToBestPractice(){
    var url="https://www.strokebestpractices.ca/recommendations/acute-stroke-management/emergency-department-evaluation-and-management";
    const browser=this.inAppBrowser.create(url,'_self');
    //this.ComingSoonPop();
  }

  Treatment(){
      this.Data.Analytics.tPAReceived="No";
      this.Data.HadImg=false;
      if(this.Data.SinceTimeForm>=4.5){
        this.navCtrl.push(EvtOptionsPage)
      }
      else{
        this.navCtrl.push(TreatmentPage);//?Used to go to treatment 
      }
   
     //this.navCtrl.push(TPaNoPage);//?now goes to temporary page 
      this.Data.hadtPA=false;
  }
}
