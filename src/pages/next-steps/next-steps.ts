import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service';
import { MapPage } from '../map/map';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import * as moment from 'moment';
/**
 * Generated class for the NextStepsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-next-steps',
  templateUrl: 'next-steps.html',
})
export class NextStepsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public Data: DataServiceProvider, public alertController: AlertController, private inAppBrowser: InAppBrowser) {
  }

ionViewWillEnter()
{
  document.getElementById("Destination").innerHTML="<h1><b>"+this.Data.StartLoc.city+" to "+this.Data.Destination.city+"</b></h1>";
  document.getElementById("Plan").innerHTML=this.Data.ChosenPlan;

  this.Data.Analytics.StartLoc=this.Data.StartLoc.name
  this.Data.Analytics.Destination=this.Data.Destination.name;
  this.Data.Analytics.RouteTime=this.Data.Destination.TimeWithMultChar;
  this.timeDiff();//get the difference in time 
  this.MethodUsed();
  this.Data.Analytics.Plan=this.Data.plan;
  console.log(this.Data.Analytics)
  this.Data.SendAnalytics();
}

MethodUsed(){
console.log(this.Data.Destination)
var method;
if(this.Data.Destination.Driving!=undefined&&this.Data.Destination.Driving==true)
{
  method="Ambulance";
}
else{
  if(this.Data.Destination.Airport==true)
  {
    method="Plane";
  }
  else{
    method="Helicopter"
  }
  this.Data.Analytics.Method=method;
}
}

timeDiff(){
  var end: any=new Date();
  var timeDiff=(end-this.Data.starttime);// get the total time spend on the application 
  // strip the ms
timeDiff /= 1000;

// get seconds (Original had 'round' which incorrectly counts 0:28, 0:29, 1:30 ... 1:59, 1:0)
var seconds = Math.round(timeDiff % 60);

// remove seconds from the date
timeDiff = Math.floor(timeDiff / 60);

// get minutes
var minutes = Math.round(timeDiff % 60);
//console.log(minutes)
//console.log(seconds)
this.Data.Analytics.TimeOnApp=(minutes.toString()+" Minutes "+seconds.toString()+" Seconds");
}

GoToMap(){
  this.navCtrl.push(MapPage);
}

GoToBestPractice(){
  var url="https://www.strokebestpractices.ca/recommendations/acute-stroke-management/emergency-department-evaluation-and-management";
  const browser=this.inAppBrowser.create(url,'_self');
  //this.ComingSoonPop();
}

async ComingSoonPop(){
  let alert=this.alertController.create({
    title:"Coming Soon",
    message: "Sorry but the application does not have that functionality yet. This functionality should be added soon.",
    buttons: [
      {
        text: "Ok",
        
         }     
    ]
  })
  await alert.present();
}

}
