import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public Data: DataServiceProvider) {
  }

  ionViewDidLoad() {
    
  }

  ionViewWillEnter()
{
  document.getElementById("Destination").innerHTML="<h1><b>"+this.Data.StartLoc.city;
  document.getElementById("Plan").innerHTML=this.Data.Plans[6].HTML;
}


}
