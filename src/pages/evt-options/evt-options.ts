import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MapPage } from '../map/map';

/**
 * Generated class for the EvtOptionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-evt-options',
  templateUrl: 'evt-options.html',
})
export class EvtOptionsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EvtOptionsPage');
  }
  goToMap(params){
    if (!params) params = {};
    this.navCtrl.push(MapPage);
  }
}
