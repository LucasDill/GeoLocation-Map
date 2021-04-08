import { Component } from '@angular/core';
import { AlertController, MenuController, NavController, NavParams } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service';
import { LastKnownWellPage } from '../last-known-well/last-known-well';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertController: AlertController, private menu:MenuController, public Data: DataServiceProvider, public storage: Storage) {
    
  }
Height:any;
Width:any;
ionViewDidLoad(){
  this.Data.starttime=new Date();
}

  ionViewWillEnter()
  {
    this.menu.swipeEnable(false);
    this.Height="10px";
    this.Width="10px";
  }
  ionViewWillLeave(){
    this.menu.swipeEnable(true);
  }

  async goToLKW(){

    let alert=this.alertController.create({
      title:"NWO Navigate Disclaimer",
    //  cssClass: "popup",/////////////////comment this out to put in the center.ion class is found in the app.scss
      message: "<h5>This app is not intended to replace the clinical judgment of a health care professional or replace any medical advice to make a clinical diagnosis or treatment decision regarding an individual patient.</h5>",
      buttons: [
        {
          text: "I Accept",
          handler: () => {
            this.navCtrl.push(LastKnownWellPage);
          }
        }
      ]
    });
    await alert.present();
  }
  }

