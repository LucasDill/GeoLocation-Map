import { Component, ElementRef, ViewChild, } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MapPage } from '../map/map';
import { TreatmentPage } from '../treatment/treatment';
import { DataServiceProvider } from '../../providers/data-service';
import { RoutingProvider } from '../../providers/routing';

/**
 * Generated class for the ImagingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 
@IonicPage()
@Component({
  selector: 'page-imaging',
  templateUrl: 'imaging.html',
})
export class ImagingPage {
cards: any;
Spinner: Boolean=true;
show: Boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public Data: DataServiceProvider,
    public Routes: RoutingProvider) {
   //   console.log(this.Routes.ImgRoutes);
  }
 async ionViewWillLoad(){
 var imgroutes;
   await this.Routes.getImaging().then(data =>{
    this.cards=data;
    imgroutes=data;
  });
  console.log(imgroutes);
  var flightloc;
  await this.Routes.nearestLocations();
  console.log(flightloc);
  var totalCard;
   await this.Routes.getFlights(imgroutes).then(distances =>{
totalCard=distances;
this.Spinner=false;
  });
  console.log(totalCard);
  console.log(this.cards);
  setInterval(()=>{
    this.Spinner=false;

    this.show=true;
  },500);
  this.Routes.nearestLocations();
  
}

 /*SpinnerThing()
{
  if (this.cards. == true) {
    // Here is your next action
}
}

setTimeout(checkVariable, 1000);
  this.Spinner=false;
  this.show=true;
  
  
}*/
  @ViewChild('treatment-heading6') myInput: ElementRef;
  @ViewChild('weather') myInput2: ElementRef;

  resize() {
      this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
      this.myInput2.nativeElement.style.height = this.myInput2.nativeElement.scrollHeight + 'px';
  }

  goToRoute(params){
    if (!params) params = {};
    console.log(params);
    this.Data.Destination=params;
    this.navCtrl.push(MapPage);
//this.Routes.nearestLocations("Landing Sites");

  }
  GoToMore(params){
    if (!params) params={};
    this.navCtrl.push(TreatmentPage);

  }
  
  
}
