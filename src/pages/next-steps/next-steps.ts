import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service';
import { MapPage } from '../map/map';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,public Data: DataServiceProvider) {
  }

  ionViewDidLoad() {
    document.getElementById("Destination").innerHTML="<h1><b>"+this.Data.StartLoc.city+" to "+this.Data.Destination.city+"</b></h1>";
  }

ionViewWillEnter()
{
  document.getElementById("Plan").innerHTML=this.Data.Plans[10].HTML;
}

GoToMap(){
  this.navCtrl.push(MapPage);
}

GoToBestPractice(){
  console.log("No Page yet");
}

}
