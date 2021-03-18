import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service';
import { RoutingProvider } from '../../providers/routing';
import { EvtOptionsPage } from '../evt-options/evt-options';
import { MapExplorePage } from '../menu/map-explore/map-explore';

/**
 * Generated class for the RegionalStrokePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-regional-stroke',
  templateUrl: 'regional-stroke.html',
})
export class RegionalStrokePage {
Button:any=true;
EVTPlan:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private Data: DataServiceProvider, private Routes: RoutingProvider,private inAppBrowser: InAppBrowser) {
  }

  ionViewWillLoad() {
    this.Button=true;
    
      if(this.Data.StartLoc.id!="MED_TBRHSC")//if they are not in Thunder Bay it is most likely Winnipeg or London and that only matters from 0-24
      {
        this.EVTPlan="14";
        this.Button=false;//to have the routes button or not 
        this.Data.Analytics.Plan="14";
      }
      else if(this.Data.SinceTimeForm<6)//this is in Thunder Bay under 6h
      {
        this.EVTPlan="15";
        this.Data.Analytics.Plan="15";
  
      }
      else if(this.Data.SinceTimeForm>=6&&this.Data.SinceTimeForm<24){//This is thunder bay not less than 6 but it is in the <24 so it is the 6-24 range 
        this.EVTPlan="16";
        this.Data.Analytics.Plan="16";
      }
      else if(this.Data.SinceTimeForm>=24&&this.Data.SinceTimeForm<48)//24 to 48 hour time frame Make it new 
      {
        this.EVTPlan="17";
        this.Button=false;
        this.Data.Analytics.Plan="17";
      }
      else if(this.Data.SinceTimeForm>=48)
      {
        this.EVTPlan="13";
        this.Button=false;
        this.Data.Analytics.Plan="13";
      }
    
   

  }

  ExploreMap(){
    this.Data.Analytics.OtherExplore=true;
    this.Data.CityMap=true;
    this.navCtrl.push(MapExplorePage);
  }
  
  
  
  GoToBestPractice(){
    var url="https://www.strokebestpractices.ca/recommendations/acute-stroke-management/emergency-department-evaluation-and-management";
    const browser=this.inAppBrowser.create(url,'_self');
    //this.ComingSoonPop();
  }

  Treatment(){
      this.navCtrl.push(EvtOptionsPage)
     //this.navCtrl.push(TPaNoPage);//?now goes to temporary page 
      this.Data.hadtPA=false;
  }



}
