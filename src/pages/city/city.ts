import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service';
import { MapExplorePage } from '../map-explore/map-explore';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

/**
 * Generated class for the CityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-city',
  templateUrl: 'city.html',
})
export class CityPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public Data: DataServiceProvider, private inAppBrowser: InAppBrowser) {
  }

  ionViewDidLoad() {
    
  }

  ionViewWillEnter()
{
  document.getElementById("Destination").innerHTML="<h1><b>"+this.Data.StartLoc.city;
  document.getElementById("Plan").innerHTML=this.Data.Plans[6].HTML;
}


GoToMap(){
  this.Data.CityMap=true;
  this.navCtrl.push(MapExplorePage);
}

GoToBestPractice(){
  var url="https://www.strokebestpractices.ca/recommendations/acute-stroke-management/emergency-department-evaluation-and-management";
  const browser=this.inAppBrowser.create(url,'_self');
  //this.ComingSoonPop();
}

}
