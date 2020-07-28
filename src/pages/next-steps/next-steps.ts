import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service';
import { MapPage } from '../map/map';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
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
