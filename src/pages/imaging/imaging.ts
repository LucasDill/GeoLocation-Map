import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MapPage } from '../map/map';
import { TreatmentPage } from '../treatment/treatment';
import { RoutingProvider } from '../../providers/routing';
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

  constructor(public navCtrl: NavController, public navParams: NavParams,public Routes: RoutingProvider) {
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
