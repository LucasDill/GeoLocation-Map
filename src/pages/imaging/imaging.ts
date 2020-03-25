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
 var dat=await this.pageSetup();
 this.cards=dat;
}

async pageSetup()
{
  var imgroutes;
  await this.Routes.getImaging().then(data =>{
   imgroutes=data;
 });
 console.log(imgroutes);
 await this.Routes.nearestLocations();
 var totalCard;
  await this.Routes.getFlights(imgroutes).then(distances =>{
totalCard=distances;
this.Spinner=false;
 });
 console.log(totalCard);
 this.Routes.nearestLocations();
 console.log(imgroutes);
//await this.Routes.getImaging();
 this.Spinner=false;
 this.show=true;
 imgroutes= this.Routes.SetColour(imgroutes);
 console.log(imgroutes);
 
 return imgroutes;
}

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
