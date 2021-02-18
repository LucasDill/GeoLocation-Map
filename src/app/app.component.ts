import { Component, ViewChild, HostListener } from '@angular/core';
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
import { TutorialPage } from '../pages/tutorial/tutorial';
import { Storage } from '@ionic/storage';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

    @ViewChild(Nav) navCtrl: Nav;
    splash = false;
    rootPage:any;

  constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen,
     private config: Config, private Data: DataServiceProvider,
     private inAppBrowser: InAppBrowser, private storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.ionViewDidLoad();
      statusBar.styleDefault();
      splashScreen.hide();
      /*//!UNDO THIS BEFORE LAUNCHING THE APP SO IT WILL SHOW UP ON FIRST TIME STARTUP
      storage.get('first_time').then((val)=>{
        console.log(val);
        if(val!==null){
          console.log("Not first time");
        }else{
          console.log("First time use");
          this.navCtrl.push(TutorialPage);
          storage.set('first_time','done');
        }
      })*/

    });
    
  ////////////////////////////////////////////////USE FOR WEB COMMIT WHEN SWITCHING TO MOBILE //////////////////////////////////////
    window.addEventListener('beforeunload',()=>{//?this is how it works on desktop 
      this.Data.Analytics.ReloadType="Web Unload"
      this.Data.SendAnalytics();
      //console.log("Sent data from reload");
    });



    platform.pause.subscribe(e=>{
      this.Data.Analytics.ReloadType="Mobile Pause";
      this.Data.SendAnalytics();
    })
  
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

goToTutorial(){
  console.log("Tutorial");
  this.navCtrl.push(TutorialPage);
}

  StartOver(){
//this.splashScreen.show();// show the loading screen if any 
//window.location.reload();//reload the start of the application  
this.Data.Analytics.ReloadType="Start Over Button"
this.Data.HadImg=true;
this.Data.SendAnalytics();
  this.navCtrl.push(LastKnownWellPage);// starts the application over from the start page 
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