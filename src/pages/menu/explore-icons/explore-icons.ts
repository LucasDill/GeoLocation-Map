import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ExploreIconsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-explore-icons',
  templateUrl: 'explore-icons.html',
})
export class ExploreIconsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private view: ViewController) {
  }

  CloseInfo(){
    this.view.dismiss();
    }
}
