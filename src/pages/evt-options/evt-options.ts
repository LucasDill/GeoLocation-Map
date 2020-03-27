import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MapPage } from '../map/map';
import { DataServiceProvider } from '../../providers/data-service';
import { RoutingProvider } from '../../providers/routing';


/**
 * Generated class for the EvtOptionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-evt-options',
  templateUrl: 'evt-options.html',
})
export class EvtOptionsPage {
  cards: any;
  evtSpinner: Boolean=true;
  evtshow: Boolean=false;
  evtEmpty:Boolean=false;
  message:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public Data: DataServiceProvider,
    public Routes: RoutingProvider) {
   //   console.log(this.Routes.ImgRoutes);
  }
  async ionViewWillLoad(){
    var evt=await this.EVTsetup();//for the EVT capable hospitals
    console.log(evt);
    if(evt.length==0)
    {
      this.evtEmpty=true;
      this.message="You appear to already be at an EVT Capable Hospital \nPlease Consult Hospital Regulations for further instructions";
    }
    else{
      this.cards=evt;
    }
    
   }

   async EVTsetup(){//EVT at the moment is just Thunder Bay which is the only bRegionalStrokeCenter
    var evtRoutes;
    await this.Routes.getRoutes("bRegionalStrokeCentre").then(data =>{
      evtRoutes=data;
    });
    await this.Routes.nearestLocations(); 
    var flightcards;
    await this.Routes.getFlights(evtRoutes).then(distances =>{
      flightcards=distances;
       });
       evtRoutes=this.Routes.addRoutes(evtRoutes,flightcards);//add the elements of the flights to the end 
       evtRoutes=this.Routes.masterSort(evtRoutes);
       evtRoutes=this.Routes.SetColour(evtRoutes);
       this.evtSpinner=false;
       this.evtshow=true;
       return evtRoutes;
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
    this.Data.ComplexRoute=false;
    this.Data.Destination=params;
    this.navCtrl.push(MapPage);
//this.Routes.nearestLocations("Landing Sites");

  }
  ComplexRoute(cardDat)
  {
    if(!cardDat) cardDat={};
    console.log(cardDat);
    this.Data.ComplexRoute=true;
    this.Data.Destination=cardDat;
    this.navCtrl.push(MapPage);
  } 
}

