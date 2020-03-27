import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { MapPage } from '../map/map';
import { DataServiceProvider } from '../../providers/data-service';
import { RoutingProvider } from '../../providers/routing';


@Component({
  selector: 'page-treatment',
  templateUrl: 'treatment.html'
})
export class TreatmentPage {
cards: any;
EvtCards: any;
tpaSpinner: Boolean=true;
tpashow: Boolean=false;
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
 var dat=await this.tPASetup();//For the tPA capable hsopitals 
 this.cards=dat;
 var evt=await this.EVTsetup();//for the EVT capable hospitals
 if(evt.length==0)
    {
      this.evtEmpty=true;
      this.message="You appear to already be at an EVT Capable Hospital \nPlease Consult Hospital Regulations for further instructions";
    }
    else{
      this.EvtCards=evt;
    }
 
}



async tPASetup()
{
  var imgroutes;
  await this.Routes.getRoutes("bTelestroke").then(data =>{
   imgroutes=data;
 });
 
 await this.Routes.nearestLocations();
 var totalCard;
  await this.Routes.getFlights(imgroutes).then(distances =>{
totalCard=distances;
 });
 
 imgroutes=this.Routes.addRoutes(imgroutes,totalCard);//add the elements of the flights to the end 
 
 imgroutes=this.Routes.masterSort(imgroutes);

 this.tpaSpinner=false;
 this.tpashow=true;
 imgroutes= this.Routes.SetColour(imgroutes);
 
 
 return imgroutes;
}

async EVTsetup(){//EVT at the moment is just Thunder Bay which is the only bRegionalStrokeCenter
  var evtRoutes;
  await this.Routes.getRoutes("bRegionalStrokeCentre").then(data =>{
    evtRoutes=data;
  });
  //await this.Routes.nearestLocations(); only needed if it is the first to go
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
  GoToMore(params){
    if (!params) params={};
    this.navCtrl.push(TreatmentPage);

  }
  
  
}

