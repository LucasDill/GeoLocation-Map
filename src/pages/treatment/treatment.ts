import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { MapPage } from '../map/map';
import { DataServiceProvider } from '../../providers/data-service';
import { RoutingProvider } from '../../providers/routing';
import { NextStepsPage } from '../next-steps/next-steps';
/*   
This page shows two results one with tpa and one with evt and as such has doubles for a lot of things 

*/

@Component({
  selector: 'page-treatment',
  templateUrl: 'treatment.html'
})
export class TreatmentPage {
cards: any;//set the variable for the cards for the tPA routes which at the moment is the same as imaging 
EvtCards: any;//set the variable for the evt routes which at the moment is just to TBRHSC
tpaSpinner: Boolean=true;//the spinner for the tpa section 
tpashow: Boolean=false;//the show for the tpa section 
evtSpinner: Boolean=true;//spinner for the evt section 
evtshow: Boolean=false;//show for the evt section 
evtEmpty:Boolean=false;// if there are no results for evt
message:any;//the message to be displayed 
results: Boolean=false;// if there are no results 
display: String="There are no routes available from your location please call local health services for more information";// the message to be displayed if there is some sort of error
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public Data: DataServiceProvider,
    public Routes: RoutingProvider) {//give access to the data and routing providers 
  
  }
 async ionViewWillLoad(){
 var dat=await this.tPASetup();//For the tPA capable hospitals 
 if(dat.length==0)//if there are no results returned 
 {
this.results=true;
 }
 else{// if there are results set the card data to be the information returned 
  this.cards=dat;
 }
 

 var evt=await this.EVTsetup();//for the EVT capable hospitals
 if(evt.length==0)//if there are no results
    {
      this.evtEmpty=true;
      this.message="There are no routes available from your location please call local health services for more information";// the message to be displayed with no results
    }
    else{// if there are results set the cards with that data 
      this.EvtCards=evt;
    }
 
}



async tPASetup()// get the results for the places that are bTelestroke which at the moment is the same for imaging
{
  var DrivingRoutes;
  await this.Routes.getRoutes("bTelestroke").then(data =>{//Get all of the driving routes to health centers which are telestroke sites 
   DrivingRoutes=data;
 });
 
 await this.Routes.nearestLocations();//Get the nearest locations of airports and helipads to the destinations 
 var FlightRoutes;
  await this.Routes.getFlights(DrivingRoutes).then(distances =>{//Get the flight information along with the amount of time it takes to drive to the sites  
FlightRoutes=distances;
 });
 
 var tPAroutes=this.Routes.addRoutes(DrivingRoutes,FlightRoutes);//add the two lists of routes for driving and flying together 
 
 tPAroutes=this.Routes.masterSort(tPAroutes);//sort the combined list so the shortest times are first 

 tPAroutes=this.Routes.CombineAll(tPAroutes)

 tPAroutes= this.Routes.SetColour(tPAroutes);//set the colour of the cards based on when they will get to their destination 
 
 this.tpaSpinner=false;//stop the spinner from spinning 
 this.tpashow=true;//enable the results to be shown
 return tPAroutes;//return the information to be displayed 
}

async EVTsetup(){//EVT at the moment is just Thunder Bay which is the only bRegionalStrokeCenter
  var evtDriveRoutes;
  await this.Routes.getRoutes("bRegionalStrokeCentre").then(data =>{//get the driving routes to health centers that are regionalStrokeCenters so far this is just TBRHSC
    evtDriveRoutes=data;
  });
  //await this.Routes.nearestLocations(); only needed if it is the first to go
  var evtFlightRoutes;
  await this.Routes.getFlights(evtDriveRoutes).then(distances =>{//Get the flight information for the air travel time between the closest helipad and airports to the destination 
    evtFlightRoutes=distances;
     });
     var evtRoutes=this.Routes.addRoutes(evtDriveRoutes,evtFlightRoutes);//Combine the lists of flight and driving routes 
     evtRoutes=this.Routes.masterSort(evtRoutes);//sort the routes to have the shortest time first 
     evtRoutes=this.Routes.CombineAll(evtRoutes);
     evtRoutes=this.Routes.SetColour(evtRoutes);//set the colour of the cards based on when the patient will arrive 
     this.evtSpinner=false;//stop the spinner and allow the div to be shown
     this.evtshow=true;
     return evtRoutes;// return the information 
}

  goToRoute(DriveDest){//if it is a simple driving route 
    this.Routes.FindPlan(DriveDest);
    this.Data.ComplexRoute=false;//set complexroute to be false 
    this.Data.Destination=DriveDest;//pass the destination in for the route display
    this.navCtrl.push(NextStepsPage);//go to the map page to show the results 
  }

  goToRouteE(DriveDest){//if it is a simple driving route 
    this.Data.isEVT=true;
    this.Routes.FindPlan(DriveDest);
    this.Data.isEVT=false;
    this.Data.ComplexRoute=false;//set complexroute to be false 
    this.Data.Destination=DriveDest;//pass the destination in for the route display
    this.navCtrl.push(NextStepsPage);//go to the map page to show the results 
  }

  expandItem(event,item): void {///This function will expand the card when it is clicked 
    // console.log("ClickWorks")
     //console.log(item);
     if (item.expanded) {
       item.expanded = false;
     } else {///////This is currently unused and it is what will eventually make the cards only expand one at a time 
       item.expanded=true;
      /* this.items.map(listItem => {
         if (item == listItem) {
           listItem.expanded = !listItem.expanded;
         } else {
           listItem.expanded = false;
         }
         return listItem;
       });*/
     }
     event.stopPropagation();//stop the upper click event from taking place 
     return item;/// this passes by the else and might need to be removed if the closing is added in 
   }

  ComplexRoute(FlightDat)// if this is a complex route with driving and flying 
  {
    this.Routes.FindPlan(FlightDat);
    this.Data.ComplexRoute=true;//set the complexroute to true 
    this.Data.Destination=FlightDat;//pass in the destination information 
    this.navCtrl.push(NextStepsPage);// go to the map page to show the results 
  }
  
  ComplexRouteE(FlightDat)// if this is a complex route with driving and flying 
  {
    this.Data.isEVT=true;
    this.Routes.FindPlan(FlightDat);
    this.Data.isEVT=false;
    this.Data.ComplexRoute=true;//set the complexroute to true 
    this.Data.Destination=FlightDat;//pass in the destination information 
    this.navCtrl.push(NextStepsPage);// go to the map page to show the results 
  }

}

