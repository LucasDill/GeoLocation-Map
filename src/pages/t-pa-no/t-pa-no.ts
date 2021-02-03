import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public Data: DataServiceProvider,private inAppBrowser: InAppBrowser) {
  }
ionViewWillEnter()
{
  this.Data.HadImg=true;
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
