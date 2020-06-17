import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number/ngx';

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

message:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private view: ViewController, private callNumber: CallNumber) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LkwModalPage');
  }

CloseInfo(){
this.view.dismiss();
}

CallNumber(){
  this.callNumber.callNumber('14039092432',true).then(res=>{this.message="Sucess"+res}).catch(err=>{this.message="Error "+err});

}

}
