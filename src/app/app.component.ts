import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Config } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LastKnownWellPage } from '../pages/last-known-well/last-known-well';
import { MapPage } from '../pages/map/map';
import { DataServiceProvider } from '../providers/data-service';
import { MapExplorePage } from '../pages/map-explore/map-explore';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {

    @ViewChild(Nav) navCtrl: Nav;
    splash = true;
    rootPage:any;

  constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen, private config: Config, private Data: DataServiceProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.ionViewDidLoad();
      statusBar.styleDefault();
      splashScreen.hide();
    });
    
      this.config.set("scrollPadding", false);
      this.config.set("scrollAssist", false);
      this.config.set("autoFocusAssist", true);
  
      this.config.set("android", "scrollAssist", true );
      this.config.set("android", "autoFocusAssist", "delay");
  
  }

  goToMap(){
    console.log("The menu is working");
    this.Data.MapRoutes=false;
    this.navCtrl.push(MapExplorePage);
  }

  ionViewDidLoad(){// once the view loads set the root page after three seconds so the animation can play and variables can be set up 
    setTimeout(()=> {
      this.splash = false;
      this.rootPage = LastKnownWellPage;// set the root page to start the app off with to be the Last known well page 
    }, 3000);
  }

}