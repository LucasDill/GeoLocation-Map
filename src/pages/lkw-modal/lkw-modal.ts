import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the LkwModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lkw-modal',
  templateUrl: 'lkw-modal.html',
})
export class LkwModalPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private view: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LkwModalPage');
  }

CloseInfo(){
this.view.dismiss();
}

}
