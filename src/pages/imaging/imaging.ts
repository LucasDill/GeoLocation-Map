import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MapPage } from '../map/map';
import { TreatmentPage } from '../treatment/treatment';
<<<<<<< HEAD
import { DataServiceProvider } from '../../providers/data-service';


=======
import { RoutingProvider } from '../../providers/routing';
>>>>>>> 0fa4a9a18769f6310b81da7964cba54b3d70d1d4
/**
 * Generated class for the ImagingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-imaging',
  templateUrl: 'imaging.html',
})
export class ImagingPage {

<<<<<<< HEAD
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public Data: DataServiceProvider) {
=======
  constructor(public navCtrl: NavController, public navParams: NavParams,public Routes: RoutingProvider) {
>>>>>>> 0fa4a9a18769f6310b81da7964cba54b3d70d1d4
  }

  goToMap(params){
    if (!params) params = {};
    this.navCtrl.push(MapPage);
this.Routes.nearestLocations("Landing Sites");
  }
  GoToMore(params){
    if (!params) params={};
    this.navCtrl.push(TreatmentPage);

  }
  
}
