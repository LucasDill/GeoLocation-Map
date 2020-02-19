import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HelpPage } from '../pages/help/help';
import { LastKnownWellPage } from '../pages/last-known-well/last-known-well';
var splash;


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

    @ViewChild(Nav) navCtrl: Nav;
    splash = true;
    rootPage:any;

  constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.ionViewDidLoad();
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  goToHelp(params){
    if (!params) params = {};
    this.navCtrl.setRoot(HelpPage);
  }

  ionViewDidLoad(){
    setTimeout(()=> {
      this.splash = false;
      this.rootPage = LastKnownWellPage;
    }, 3000);
  }

  goToLastKnownWell(params){
    if (!params) params = {};
    this.navCtrl.setRoot(LastKnownWellPage);
  }
}