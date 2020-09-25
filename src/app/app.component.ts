import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Config } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LastKnownWellPage } from '../pages/last-known-well/last-known-well';
import { MapPage } from '../pages/map/map';
import { DataServiceProvider } from '../providers/data-service';
import { MapExplorePage } from '../pages/map-explore/map-explore';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { WelcomePage } from '../pages/welcome/welcome';
import { ContactPage } from '../pages/contact/contact';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {

    @ViewChild(Nav) navCtrl: Nav;
    splash = false;
    rootPage:any;

  constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen, private config: Config, private Data: DataServiceProvider,private inAppBrowser: InAppBrowser) {
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

  this.Data.getPlans();// calls to get and store the plans and centers every time the app is reloaded 
  this.Data.getCenters();
  }

  goToMap(){
    this.Data.CityMap=false;
    this.navCtrl.push(MapExplorePage);// starts the map page for exploration 
  }

  StartOver(){
this.splashScreen.show();// show the loading screen if any 
window.location.reload();//reload the start of the application  
  //this.navCtrl.push(WelcomePage);// starts the application over from the start page 
  }

  goToContact(){// simply push to the contact page of the application
    this.navCtrl.push(ContactPage);
  }

  goToBestPractice(){
    var url="https://www.strokebestpractices.ca/recommendations/acute-stroke-management";
    const browser=this.inAppBrowser.create(url,'_self');
  }
  ionViewDidLoad(){// once the view loads set the root page after three seconds so the animation can play and variables can be set up 
    //setTimeout(()=> {
      this.splash = false;
      this.rootPage = WelcomePage;// set the root page to start the app off with to be the Last known well page 
//}, 3000);
  }

}