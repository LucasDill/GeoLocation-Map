import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HelpPage } from '../pages/help/help';
import { PatientLocationPage } from '../pages/patient-location/patient-location';
var splash;


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

    @ViewChild(Nav) navCtrl: Nav;
    rootPage:any = PatientLocationPage;
    splash = true;

  constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.ionViewDidLoad();
    });
  }

  goToPatientLocation(params){
    if (!params) params = {};
    this.navCtrl.setRoot(PatientLocationPage);
  }
  goToHelp(params){
    if (!params) params = {};
    this.navCtrl.setRoot(HelpPage);
  }

  ionViewDidLoad(){
    setTimeout(()=> {
      this.splash = false;
    }, 3000);
  }

}