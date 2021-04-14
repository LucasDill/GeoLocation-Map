import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the WaysToUsePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ways-to-use',
  templateUrl: 'ways-to-use.html',
})
export class WaysToUsePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private view: ViewController) {
  }
  CloseInfo(){
    this.view.dismiss();
    }

}
