import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TreatmentPage } from '../treatment/treatment';
import { DataServiceProvider } from '../../providers/data-service';
import { RoutingProvider } from '../../providers/routing';
import { NextStepsPage } from '../next-steps/next-steps';

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
items:any=[];
cards: any;//the cards are the data type that is displayed on the html page 
Spinner: Boolean=true;//Set the spinner to be true and shown until the content has finished loading 
show: Boolean=false;//Have the div be hidden until the data has loaded and the spinner disappears 
results: Boolean=false;//a Boolean showing if there are no results returned from the calculations 
display: String="There are no routes available from your location please call local health services for more information";//The message to display if there are no results 
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public Data: DataServiceProvider,//set constructor so the page can access the routing and data provider 
    public Routes: RoutingProvider) {
  }
 async ionViewWillLoad(){// part of the ionic lifecycle that will start before the page is about to load 
 var dat=await this.pageSetup();// wait for the calls to the routing provider to perform its actions and return the data 

 if(dat.length==0)//If there are no results returned it will set the results to true and display the message 
 {
this.results=true;
 }
 else{//if there are results set the cards to be displayed as the data returned by the setup function 
   this.cards=dat;
   this.Spinner=false;//disable the spinner so it stops 
   this.show=true;//enable the content div to be shown with the results once loaded 
  }
 
}

expandItem(event,item): void {///This function will expand the card when it is clicked 
 // console.log("ClickWorks")
  //console.log(item);
  if (item.expanded) {
    item.expanded = false;
  } else {///////This is currently unused and it is what will eventually make the cards only expand one at a time 
    item.expanded=true;
    this.items.map(listItem => {
      if (item == listItem) {
        listItem.expanded = !listItem.expanded;
      } else {
        listItem.expanded = false;
      }
      return listItem;
    });
  }
  event.stopPropagation();//stop the upper click event from taking place 
  return item;/// this passes by the else and might need to be removed if the closing is added in 
}

async pageSetup()
{
  var DrivingRoutes;//set a variable to be filled with the data 
  await this.Routes.getRoutes("bTelestroke").then(data =>{//Search for all driving routes to telestroke centers which at the moment are the only places to get imaging 
   DrivingRoutes=data;//set the imageroutes to be the data returned by the function 
 });
 
 await this.Routes.nearestLocations();//wait for a function that gets the closest airport and helipad to the start and end locations 
 var FlightRoutes;//assign another variable for the total collection of card information 
  await this.Routes.getFlights(DrivingRoutes).then(distances =>{//get the information on the flights from the routing provider 
FlightRoutes=distances;//set the totalcard variable with the information from the flights 
 });
 var imgroutes=this.Routes.addRoutes(DrivingRoutes,FlightRoutes);//combines the flight information and the driving information into one list 
 imgroutes=this.Routes.masterSort(imgroutes);//Sort the combined list of flight and driving information to have the shortest amount of time first
 
 var testroutes=this.Routes.CombineAll(imgroutes);
 
 testroutes=this.Routes.SetColour(testroutes)

 //imgroutes= this.Routes.SetColour(imgroutes);//Set the colour of each of the options for arrival green if able to make it for tPA yellow if able to make it for EVT and red if not able to make it in usual recovery time 

 return testroutes;//return the final list of sorted information ready to be displayed 
}

  goToRoute(DriveDat){//if the route is a simple driving one
    this.Routes.FindPlan(DriveDat);
    this.Data.ComplexRoute=false;//set complexroute to false so it will do a driving route 
    this.Data.Destination=DriveDat;//set the destination with the card information passed in 
    this.navCtrl.push(NextStepsPage);//go to the map page to show the route 
  }


  ComplexRoute(FlightDat)// if the route selected is a more complex flying route with driving sections to get to the airports or helipads 
  {
    this.Routes.FindPlan(FlightDat);
    this.Data.ComplexRoute=true;//set complexroute to be true so the mapping page knows to do a route with flying and driving 
    this.Data.Destination=FlightDat;//set the destination to be the card that has been selected 
    this.navCtrl.push(NextStepsPage);//go to the map page to show the results 
  }


  GoToTreatment(){// if the user selects to view the treatment options they will click the button and call this function 
    this.navCtrl.push(TreatmentPage);//go to the treatment options page 
  }
  
  
}
