import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service';
import { MapExplorePage } from '../map-explore/map-explore';

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
}
