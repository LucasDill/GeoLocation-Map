import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Config, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LastKnownWellPage } from '../pages/last-known-well/last-known-well';
import { DataServiceProvider } from '../providers/data-service';
import { MapExplorePage } from '../pages/menu/map-explore/map-explore';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { WelcomePage } from '../pages/welcome/welcome';
import { Storage } from '@ionic/storage';
import { DatabaseAccessProvider } from '../providers/database-access';
//import { ExploreIconsPage } from '../pages/explore-icons/explore-icons';
//import { WaysToUsePage } from '../pages/ways-to-use/ways-to-use';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

    @ViewChild(Nav) navCtrl: Nav;
    splash = false;
    rootPage:any;

  constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen,
     private config: Config, private Data: DataServiceProvider,
     private inAppBrowser: InAppBrowser, private storage: Storage, private DataBase: DatabaseAccessProvider,private modal: ModalController) {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.ionViewDidLoad();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
     


      //!UNDO THIS BEFORE LAUNCHING THE APP SO IT WILL SHOW UP ON FIRST TIME STARTUP
      this.storage.get('first_time').then((val)=>{
        if(val!==null){
         /* storage.get("LastUsed").then((last)=>{//When I was switching the emulated device it was not working for some reason so this should resolve it
            //?Maybe remove this when ready for production 
            if(last!==null)
            {
            this.DataBase.getLastMem();
            }
            else{
            console.log("Weird Storage Chrome Thing")
            this.DataBase.setAllData();
            }
          })*/
          this.DataBase.getLastMem();
        }else{
          console.log("First time use");
          this.goToTutorial();
          storage.set('first_time','done');
          this.DataBase.setAllData(); 
        }
      })

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
  }

  goToMap(){
    this.Data.CityMap=false;
    this.navCtrl.push(MapExplorePage);// starts the map page for exploration 
  }

goToTutorial(){
  //console.log("Tutorial");
  //this.navCtrl.push(TutorialPage);
  const TutorialModal= this.modal.create('TutorialModalPage');

  TutorialModal.present();
}

FAQ(){
  const FAQModal=this.modal.create('FaqPage');

  FAQModal.present();
}

ExploreIcons(){
  //console.log("NOTHING BUILT YET");
  //this.navCtrl.push(ExploreIconsPage);//!This will go to a page instead but will need to be added to the app.module.ts in order to use 
  //!Undo if you would rather have the modal
  const ExploreIconsModal= this.modal.create('ExploreIconsPage');

  ExploreIconsModal.present();
}

WaysToUse(){
  //console.log("NOTHING BUILT YET");
  //this.navCtrl.push(WaysToUsePage);//!UNDO if you would rather have it go to a page

  const WaysToUseModal= this.modal.create('WaysToUsePage');

  WaysToUseModal.present();
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
    //this.navCtrl.push(ContactPage);//!To get the contacts to display as a page the app.module.ts needs to be modified so the imports are included the reverse is true 
    const ContactModal= this.modal.create('ContactPage');

    ContactModal.present();
  }

  goToBestPractice(){
    var url="https://www.strokebestpractices.ca/recommendations/acute-stroke-management";
    const browser=this.inAppBrowser.create(url,'_self');
    browser//get rid of the warning 
  }
  ionViewDidLoad(){// once the view loads set the root page after three seconds so the animation can play and variables can be set up 
    //setTimeout(()=> {
      this.splash = false;
      this.rootPage = WelcomePage;// set the root page to start the app off with to be the Last known well page 
//}, 3000);
  }

}