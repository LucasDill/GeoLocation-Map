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

message:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private view: ViewController) {
  }

CloseInfo(){
this.view.dismiss();
}

CallNumber(){
  document.getElementById("test").innerText="Works";
  //this.callNumber.callNumber('14039092432',false).then(res=>{console.log("Success",res)}).catch(err=>{console.log("Error",err)});
  this.message="This does work";

}

}
