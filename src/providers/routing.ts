import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {DataServiceProvider } from '../providers/data-service';
import { AngularFireDatabase } from "@angular/fire/database";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore"; 
import { WeatherService } from '../pages/patient-location/weather';

//The routing provider is where the bulk of our calculations are done. it handles the calculation of the times to each route and formats the information into what we need for the cards

@Injectable()
export class RoutingProvider {
Database: any;
LandingSites:any;

loc:any;

  constructor(public http: HttpClient,public Data: DataServiceProvider,public DataBase: AngularFireDatabase,
    private weatherService: WeatherService) {
      this.Database = firebase.firestore();
  }

FindPlan(Dest)
{
  console.log(Dest);
  console.log(this.Data.StartLoc);
 
 
  if(this.Data.SinceTimeForm<6)// this is the long if statement that will get the final plan html for the page 
  {
    if((this.Data.StartLoc.id=="MED_NIPIGON"&&Dest.id=="MED_TBRHSC")||(this.Data.StartLoc.id=="MED_NOSH"&&Dest.id=="MED_TBRHSC")||(this.Data.StartLoc.id=="MED_AGH"&&Dest.id=="MED_TBRHSC"))
    {
      this.Data.plan="1";
    }
    else if((this.Data.StartLoc.id=="MED_REDLAKE"&&Dest.id=="MED_DRYDEN")||(this.Data.StartLoc.id=="MED_AGH"&&Dest.id=="MED_DRYDEN"))
    {
      this.Data.plan="2";
    }
    else if((this.Data.StartLoc.id=="MED_EMO"&&Dest.id=="MED_RIVERSIDE")||(this.Data.StartLoc.id=="MED_RIVERSIDERAINY"&&Dest.id=="MED_RIVERSIDE")||(this.Data.StartLoc.id=="MED_AGH"&&Dest.id=="MED_RIVERSIDE"))
    {
      this.Data.plan="3";
    }
    else if((this.Data.StartLoc.bRegionalStrokeCentre==true&&Dest.bRegionalStrokeCentre==true)||this.Data.StartLoc.bTelestroke==true&&Dest.bRegionalStrokeCentre==true)
    {
      this.Data.plan="7";
    }
    else if(this.Data.StartLoc.id=="MED_AGH"||this.Data.StartLoc.id=="MED_NIPIGON"||this.Data.StartLoc.id=="MED_NOSH"||this.Data.StartLoc.id=="MED_REDLAKE"||this.Data.StartLoc.id=="MED_EMO"||this.Data.StartLoc.id=="MED_RIVERSIDERAINY")//TODO: Change it so if it starts at any of the above locations but does not end there it will go here
    {
      if(this.Data.StartLoc.id=="MED_NIPIGON"||this.Data.StartLoc.id=="MED_NOSH")//these two locations will call a different CACC number so will be separated into 4B
      {
        this.Data.plan="4B"
      }
      else{
        this.Data.plan="4";
      }
      

    }
    else if(this.Data.StartLoc.bTelestroke==true)//!this used to be true for the first one and have the this.Data.TelestrokePlan==true
    {
      if(this.Data.HadImg==false)
      {
        this.Data.plan="4C"
      }
      else{
        this.Data.plan="4A";
      }
      
    }
    else{
      this.Data.plan="5";
    }
    
  }
  else if (this.Data.SinceTimeForm>=6&&this.Data.SinceTimeForm<24)
  {
    if(this.Data.StartLoc.id=="MED_EMO")
    {
      this.Data.plan="8";
    }
    else if(Dest.bRegionalStrokeCentre==true)
    {
      this.Data.plan="7";
    }
    else if(this.Data.StartLoc.bTelestroke==true)//used to also have if Telestrokeplan == true but that resulted in an error when going to non imaging routes
    {
      this.Data.plan="5A";
    }
    else if(this.Data.StartLoc.Plan!=undefined)
    {
      this.Data.ChosenPlan=this.Data.Plans[this.Data.StartLoc.Plan].HTML;
      this.Data.plan=this.Data.StartLoc.Plan.toString();
    }
    else{
      this.Data.plan="6";
    }
  }
  else if (this.Data.SinceTimeForm>=24&&this.Data.SinceTimeForm<48)
  {
    this.Data.plan="9";
  }
  else if(this.Data.SinceTimeForm>=48){
    this.Data.plan="10";
  }
  else{
    console.error("No Plan found Critical Error")
  }


}

    async nearestLocations(){//This function gets the list of landing sites from the database to be searched for the closest location 
      //once we figure out how to do synchronization this function can be removed 
     var Sites= this.Database.collection("/Landing Sites/")
      .get()
      .then((querySnapshot) => {
        var total=[]
        querySnapshot.forEach(function(doc) {
          
         
            var obj = JSON.parse(JSON.stringify(doc.data()));
            total.push(obj);
          
        });
        this.LandingSites=total;//set the global variable to be used later on 
        return total;
        
    });
    return Sites;// 
  }
   async getCloseLoc(lat, lng)// gets all close locations to the site for the best airport and helipad options it will return an array with the closest helipad and airports 
    {
      var all= this.LandingSites;
      var heli=[];// the array of helipads that will be shortened and combined later
      var plane=[];//The array of airports 
      var repeat=1;//The repeat variable which will not be changed until there is at least one helipad and airport 
      var radius=0.5;// the initial radius of the search to be performed 
      var closestFlightOpt=[];//The final array which the plane and heli arrays will be combined into 
      while(repeat==1)// as long as repeat is one it will search repeatedly while increasing the radius of the search 
      {
        for(var i=0;i<all.length;i++)// go through all of the landing sites 
        {
          if(Math.abs(Math.abs(all[i].lat)-Math.abs(lat))<radius&&Math.abs(Math.abs(all[i].lng)-Math.abs(lng))<radius)// if the lat and long are within the radius of the search 
          {
            if(all[i].type=="Airport")// if the location that has been found is an airport add it to the plane array 
            {
              plane.push(all[i]);
            }
            else if(all[i].type=="Helipad")// if the location found is a helipad add it to the heli array 
            {
              heli.push(all[i]);
            }
          }
        }
        if(heli.length==0||plane.length==0)// if one of the arrays does not have anything in it increase the radius of the search and go again 
        {
          radius=radius+0.2;
        }
        else// if both of the arrays have at least one thing in them stop the while loop 
        {
          repeat=0;
        }
      }
      // sort the arrays of heli and plane so the shortest distance between the facility and the site will be first in the array 
      heli.sort((a,b)=>(Math.abs(Math.abs(a.lat)-Math.abs(lat))+Math.abs(Math.abs(a.lng)-Math.abs(lng)))-(Math.abs(Math.abs(b.lat)-Math.abs(lat))+Math.abs(Math.abs(b.lng)-Math.abs(lng))));
      plane.sort((a,b)=>(Math.abs(Math.abs(a.lat)-Math.abs(lat))+Math.abs(Math.abs(a.lng)-Math.abs(lng)))-(Math.abs(Math.abs(b.lat)-Math.abs(lat))+Math.abs(Math.abs(b.lng)-Math.abs(lng))));
      closestFlightOpt[0]=heli[0];// make the closestflightoptions array have the closest helipad in the first element and the closest airport in the second element 
      closestFlightOpt[1]=plane[0];
      return closestFlightOpt;//return the closest helipad and airport
    }
    

origin_weather_multiplier: number;// set variables to be used to contain information about the weather 
origin_area_multiplier: number;
origin_total_multiplier: any;

// multipliers for weather and area
 async getOriginWeatherMultiplier(){

if(this.Data==undefined||this.Data.origin_id==undefined)//there was an error when a variable was not being filled fast enough so this is a function to wait to be sure it will be filled 
{
  setTimeout(this.getOriginWeatherMultiplier,25);// if there is nothing wait 25 milliseconds and try again 
}
else// if the variable is filled search the database for the information required 
{
  
  var area= await this.Database.collection("/Multipliers/").doc(JSON.stringify(this.Data.origin_id))
  .get()
  .then((querySnapshot) => {
      this.origin_weather_multiplier = querySnapshot.data().multi;
      return this.origin_weather_multiplier;// set the information 
  });
  return area;
}
 


}

async getOriginAreaMultiplier(){// search the database for the area multiplier for the results based on the data 
await this.Database.collection("/Multipliers Area/").doc(this.Data.origin_area)
  .get()
  .then((querySnapshot) => {
      this.origin_area_multiplier = querySnapshot.data().multi;
      return this.origin_area_multiplier;
  });

}

async totalOriginMultiplier(){//Get the total multiplier by taking the average of the area and weather multipliers 
  await this.getOriginAreaMultiplier();
  await this.getOriginWeatherMultiplier();
  this.origin_total_multiplier = (this.origin_weather_multiplier + this.origin_area_multiplier)/2;
  return this.origin_total_multiplier;

}

heli: any;// the air speed of helicopters 
plane: any;//the air speed of planes 
flight_weather_origin: any;

async getFlightSpeeds(){// get the flight speeds of planes and helicopters which may be taken out if we figure out the database synchronization 
  await this.Database.collection("/Air_Speed/").doc("heli")
  .get()
  .then((querySnapshot) => {
      this.heli = querySnapshot.data().speed;
      return this.heli;
  });

  await this.Database.collection("/Air_Speed/").doc("plane")
  .get()
  .then((querySnapshot) => {
      this.plane = querySnapshot.data().speed;
      return this.plane;
  });

  await this.Database.collection("/Multipliers/").doc(JSON.stringify(this.Data.origin_id))// get the speed multiplier based on the origin id 
  .get()
  .then((querySnapshot) => {
      this.flight_weather_origin = querySnapshot.data().multi_air;
      return this.flight_weather_origin;
  });



  let speed_vals = {//create a specific object to be returned with the speeds and weather 
    heli_speed: this.heli,
    plane_speed: this.plane,
    origin_weather: this.flight_weather_origin
  }
  return {speed_vals}
}

addRoutes(drive, air)//combine the two arrays created on the routing pages 
{
var temp=drive;// declare a temporary as creating a new variable gave some issues when it was called 
drive=[];// empty out the drive array 

  for(var i=0;i<air.length;i++)
  {
      if(air[i].Dist!=0&&air[i].name!=this.Data.StartLoc.name)// if the route does not have a distance or the name matches the location it will not display we did this because it used to give routes to where it is with a 0 distance and 1 minute travel time 
      {
        //console.log(air[i]);
        if(air[i].Helipad==true)// if the site is for a helicopter check the distance 
        {
          if(air[i].Dist<240)// if the distance is below 240 Kilometers add it to the final list 
          {
            drive.push(air[i]);
          }
          /*else{
            console.log("Helicopter over 240K",air[i].Dist)
          }*/
        }
        else{
          drive.push(air[i]);// add it to the drive array as long as it is not to the same location 
        }
        
      }
      
  }
  
  for(var n=0;n<temp.length;n++)// go through all of the elements in the temp array we created before 
  {
    if(temp[n].name!=this.Data.StartLoc.name&&temp[n].name!="London Health Sciences Centre"&&temp[n].Dist!=0)//if the location has the same name as the start location or is the London centre remove from the list 
    {
      drive.push(temp[n]);// add to the drive array if everything is as it should be 
    }
  }
  



return drive;//return the combined list with the routes to the same place taken out 
}



async getRoutes(param){//Get the routes based off the parameter specified to search by the param is what it will search the database for 
  await this.getOriginAreaMultiplier();//get the neccecery information needed for the routes 
  await this.getOriginWeatherMultiplier();
 
  var Routes=[];// create an array for all of the routes 
  
  var weatherService = this.weatherService;
 
  var w;//create a data object for the weather 

  

var ret= await this.Database.collection("/Health Centers/").where(param,"==",true)//search all of the health centers by the parameter mainly if it is telestroke or a regional health center
.get()
.then(async function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
      var distobj={//create an object with all of the data we need from the object along with ones that will be defined later on 
        name:doc.data().name,
        address:doc.data().address,
        city:doc.data().city,
        lat:doc.data().lat,
        lng:doc.data().lng,
        area:doc.data().area,
        id:doc.data().id,
        bRegionalStrokeCentre:doc.data().bRegionalStrokeCentre,
        Driving:true,
        TimeWithMult: 0,
        TimeWithMultChar: "",
        Timechar: "",
        Timeval: 0,
        DistChar: "",
        Dist: 0,
        weather_code: "",
        expanded:false

      }
      Routes.push(distobj);//add each of the new objects to the routes array 

      weatherService.getWeatherFromApi(distobj.lat, distobj.lng).subscribe(weather => {  // get the neccecery weather information 
        w = weather;
        let id = w.weather[0].id;
        distobj.weather_code = id;
        /*let description = w.weather[0].description;
        let icon = w.weather[0].icon;
        let tempreal = w.main.temp - 273.15;
        let tempfeel = w.main.temp - 273.15;
        // gets description of weather
        let destination_weatherdata = [id, description, icon, tempreal, tempfeel];*///this is not used at the moment but could be useful later on 
      }); 
  });
  
  return Routes;// return the routes from the query 
});
var destinations=[];//create an array to get the information from all of the destinations 
for(var i=0;i<Routes.length;i++)//go through all of the routes and create lats and longs to be used to get the travel information for all of the driving routes 
{
let coords= new google.maps.LatLng(Routes[i].lat,Routes[i].lng);
destinations[i]=coords;
}
ret=await this.distMat(destinations,ret);// get the distance and time from the distance matrix api which is not as intensive as the google ones we have been using 
//the distance matrix function is likely the one that takes the longest time and it is important that we wait for it to finish so we have results 

return ret;// return all of the driving routes 
}

destination_flight_weather_array;

async distMat(destinations,Routes){// this will find the travel information for all of the driving routes 
  
  var mult=await this.totalOriginMultiplier();// the multiplier used to modify all of the travel times 
  var Database = this.Database;
  var destination_weather_multiplier;
  var destination_area_multiplier;

  var flight_dest_weather;
  var getflight = [];

  for(var m=0;m<Routes.length;m++)// go through all of the routes and get the destination weather for each site 
  {

      await flightWeatherDestination(Routes[m].weather_code).then(data => {
         flight_destination_weather = data;
      });
      getflight.push(flight_destination_weather);

  }
       // get multiplier for weather of flight destination

       async function flightWeatherDestination(id){
        let val = await Database.collection("/Multipliers/").doc(JSON.stringify(id))
        .get()
        .then((querySnapshot) => {
          var m= waitforMultiAir();
          function waitforMultiAir()
          {
            if(querySnapshot.data()==undefined||querySnapshot.data().multi_air==undefined)
            {
              console.log("Wait");
              setTimeout(this.waitforMultiAir,25);
            }
            else{
            flight_dest_weather = querySnapshot.data().multi_air;
            return flight_dest_weather;
            }
          }
            return m;
          })
          .catch(error=>{
            console.log(error);
          })
          return val;
       }
      // console.log(getflight)
       this.destination_flight_weather_array = getflight;

  var origin=new google.maps.LatLng(this.Data.lat,this.Data.lng);// set the origin for the distance matrix to be the origin site the patient starts at
  var service= new google.maps.DistanceMatrixService();//declare the service 
  const {response,status}=await new Promise(resolve => //this is an usual way of doing it but it is the best way we found for it to actually wait for the data to be returned 
    service.getDistanceMatrix(
   {
     origins: [origin],//as it is only one latlng the brackets are neccecery 
     destinations: destinations,//enter all of the destinations
     travelMode: google.maps.TravelMode.DRIVING,//specify that it is using driving routes
   },(response, status) => resolve({response,status}))//once done call this function 
  );
  const resp=await handleMapResponse(response,status);
   var final_multiplier;
   var flight_destination_weather;
    async function handleMapResponse(response,status){
    
     for(var m=0;m<Routes.length;m++)
     {
      if(response.rows[0].elements[m].status != "ZERO_RESULTS")// if there are actual results given fill the rest of the missing information 
      {
        Routes[m].Timechar=response.rows[0].elements[m].duration.text;
        Routes[m].TimeWithMultChar=response.rows[0].elements[m].duration.text;
        Routes[m].Timeval=response.rows[0].elements[m].duration.value;
        Routes[m].DistChar=response.rows[0].elements[m].distance.text;
        Routes[m].Dist=response.rows[0].elements[m].distance.value;
        await initiateMultipliers(Routes[m].weather_code, Routes[m].area).then(data => {
          final_multiplier = data;
        });
        Routes[m].TimeWithMult=Routes[m].Timeval*final_multiplier;
        Routes[m].CompTime=Routes[m].TimeWithMult/3600;// we divide by 3600 so it is in the same format as other times we have returning 
    }
      }
         

     // get multiplier for weather and area of land ambulance destination

     var weather_multiplier;
     var area_multiplier;
     var destination_total;//get weather multipliers to add on to the time based on what has been found 
     var final;
     async function initiateMultipliers(id, area){
       await getDestinationWeatherMultiplier(id).then(data => {
         weather_multiplier = data;
       })
       await getDestinationAreaMultiplier(area).then(data => {
         area_multiplier = data;
       })
 
       destination_total = (weather_multiplier + area_multiplier) / 2;
       final = (mult + destination_total) / 2;
       return final;
     }
 
     async function getDestinationWeatherMultiplier(id){
      let val = await Database.collection("/Multipliers/").doc(JSON.stringify(id))
         .get()
         .then((querySnapshot) => {
           var ret= getMulti();
          async function getMulti(){

            if(querySnapshot==undefined||querySnapshot.data()==undefined||querySnapshot.data().multi==undefined)//there was an error when a variable was not being filled fast enough so this is a function to wait to be sure it will be filled 
            {
              console.log("GetMulti Print")
              setTimeout(getMulti,25);// if there is nothing wait 25 milliseconds and try again 
            }
            else// if the variable is filled search the database for the information required 
            {
             destination_weather_multiplier = querySnapshot.data().multi;
             return destination_weather_multiplier;
            }
          }
          return ret;
           });
           return val;
     }
 
     async function getDestinationAreaMultiplier(area){
       let val = await Database.collection("/Multipliers Area/").doc(area)
           .get()
           .then((querySnapshot) => {
               destination_area_multiplier = querySnapshot.data().multi;
               return destination_area_multiplier;
             });
             return val;
     }
 
     Routes = await convertTime(Routes);// this is a function we made to go though all of the routes and convert the time into a char and something we could use 
       await sortRoutes();// the sortRoutes is specific to this data and is defined below 
     async function sortRoutes(){
      Routes.sort((a,b)=>a.TimeWithMult-b.TimeWithMult);// sort the routes in order of the time with the multiplier 

      return Routes;// all of these returns are neccecery for the async functions to work and wait the proper amount 
    }
    return Routes;
  }
    
    return resp;
  }

  masterSort(ArraytoSort)// sorts the array based on the time specified to compare 
  {
    ArraytoSort.sort((a,b)=>a.CompTime-b.CompTime);
    return ArraytoSort;
  }

 async SetColour(param){// goes through all the routes and sets the colour based on when it is estimated they will reach the hospital 
   
  //console.log(param)
  //console.log(param.length)

 
  for(var i=0; i<param.length;i++)
  {
    var RouteTime=param[i].CompTime;// this is the time the route will take 
    var timePassed=this.Data.SinceTimeForm;// this is the amount of time that has already passed 
   
    if((RouteTime+timePassed)<4.5)// if the total time is less than 4 and a half hours the colour will be set to green for tpa 
    {
      param[i].colour="#008742";
    }
    else if((RouteTime+timePassed)>=4.5&&(RouteTime+timePassed)<6)// if the total time is more than 4 and a half hours and less than 6 set the colour to yellow for evt 
    {
      param[i].colour="#ecb318";
    }
    else if((RouteTime+timePassed)>=6)// if the total time is greater than 6 hours set the colour to red for passing the usual recovery time 
    {
      param[i].colour="#d2232a";
    }
    
  }
   return param;// return the data with the colours added on 
  }

CombineAll(cards)
{
  console.log(cards)
 // console.log(cards)
  var comb:any=[];
  var matched=false;
  var meth;
  var bdrive;
  var hasDrive, hasFly;
 for(var i=0;i<cards.length;i++)
 {
   matched=false;
   if(comb.length==0)
   {
     comb.push(this.NewCard(cards[i]));
   }
   for(var m=0;m<comb.length;m++)
   {
    if(cards[i].name==comb[m].name)
    {
    //console.log("Match");
    hasDrive=comb[m].HasDrive;//get the values to be looked at and changed 
    hasFly=comb[m].HasFly;
      if(cards[i].Driving==true)
      {
        comb[m].Drive=cards[i];
        meth="Driving";
        bdrive=true;
        hasDrive=true;
      }
      else if(cards[i].Airport==true||cards[i].Helipad==true)
      {
        console.log(comb[m].Air.TimeWithMult)
       // if(cards[i].TimeWithMult<comb[m].Air.TimeWithMult)
       // {
        //  console.log("swap")
        if(comb[m].Air!=undefined)//if there is already data put the lower one in 
        {
          if(cards[i].TimeWithMult<comb[m].Air.TimeWithMult)
          {
            comb[m].Air=cards[i];
          }
        }
        else{
          comb[m].Air=cards[i];
        }
         
        //}
        meth="Flying";
        bdrive=false;
        hasFly=true;
        
      }
      if(comb[m].TimeWithMult>cards[i].TimeWithMult)
      {
       // console.log("Faster")
       console.log(bdrive)
       comb[m].Driving=bdrive;
        comb[m].TimeWithMult=cards[i].TimeWithMult;
        comb[m].TravelMode=meth;
        comb[m].CompTime=cards[i].CompTime;
        comb[m].colour=cards[i].colour;      
      }
      comb[m].HasDrive=hasDrive;//if it is the same nothing happens if one was found it will be added in 
      comb[m].HasFly=hasFly;
    matched=true;
    }
   
   }
   if(matched!=true)
   {
     comb.push(this.NewCard(cards[i]));
   }
 }
console.log(comb)
return comb;
}

expandItem(event,item): void {///This function will expand the card when it is clicked 
  // console.log("ClickWorks")
   //console.log(item);
   if (item.expanded) {
     item.expanded = false;
   } else {///////This is currently unused and it is what will eventually make the cards only expand one at a time 
     item.expanded=true;
     /*this.items.map(listItem => {
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

NewCard(card){
var methods;
var capabilities;
var drive,Flying,lat,lng;
var booldrive;
var hasDrive=false;
var hasFly=false;
  if(card.Driving==true)
  {
    methods="Driving";
    drive=card;
    lat=card.lat;
    lng=card.lng;
    booldrive=true;
    hasDrive=true;
  }
  else if(card.Airport==true||card.Helipad==true)
  {
    methods="Flying";
    Flying=card;
    lat=card.desti.lat;
    lng=card.desti.lng;
    booldrive=false;
    hasFly=true;
  }
 

  if(card.bRegionalStrokeCentre==true)
  {
    capabilities="Imaging/tPA/EVT";
  }
  else{
    capabilities="Imaging/tPA";
  }
  var together={
  name: card.name,
   city: card.city,
   colour: card.colour,
   expanded: false,
   CompTime:card.CompTime,
   TimeWithMultChar: card.TimeWithMultChar,
   TimeWithMult:card.TimeWithMult,
   TravelMode: methods,
   lat: lat,
   lng: lng,
   id:card.id,
  services:capabilities,
    Drive:drive,
    Air:Flying,
    Driving:booldrive,
    HasDrive: hasDrive,
    HasFly: hasFly,
  }
  return together;
}

async getFlights(endpoints)
{
 var loc = await this.getCloseLoc(this.Data.lat,this.Data.lng);// get the closest helipad and airport to the origin site 
 this.loc=loc;
var dest= new Array(endpoints.length);// create an array for all of the destinations which could vary based on what you are searching for 
for(var o=0;o<endpoints.length;o++)
{
  var closesites={// create an array of objects for the landing sites close to the destination hospital with the site that is close to and the closest helipad and airport 
    CloseHospital: endpoints[o].name,
    CloseCity:endpoints[o].city,
    Sites: await this.getCloseLoc(endpoints[o].lat,endpoints[o].lng)
  }
  dest[o]=(closesites);// fill the array with this object 
}

var origins=[];//set up the variables needed to use the distanceMatrix api 
var destinations=[];
var RouteToHeli=true;
var RouteToPlane=true;


origins.push(new google.maps.LatLng(this.Data.lat,this.Data.lng));// create the origins array to hold the origin location
for(var r=0;r<this.loc.length;r++)
{
destinations.push(new google.maps.LatLng(this.loc[r].lat,this.loc[r].lng));// add the array of destinations 
}

var service= new google.maps.DistanceMatrixService();
const {response,status}=await new Promise(resolve => 
  service.getDistanceMatrix(
 {
   origins: origins,
   destinations: destinations,
   travelMode: google.maps.TravelMode.DRIVING,
 },(response, status) => resolve({response,status}))
);
const resp=await handleMapResponse(response,status);
 
  async function handleMapResponse(response,status){
  return response;
   
  }
  var HeliDriveTime=0;// set all of the variables to be changed later on in order to not have null data 
  var PlaneDriveTime=0;
  var HeliDriveDistance=0;
  var PlaneDriveDistance=0;
  if(response.rows[0].elements[0].status="OK"&&response.rows[0].elements[0].duration!=undefined)// if the response was good for helicopters and there are values
  {
        HeliDriveTime=response.rows[0].elements[0].duration.value/3600;//get the time and distance and convert them into the standard base we are using 
        HeliDriveDistance=response.rows[0].elements[0].distance.value/1000;
  }
  else{// if there is no response set the boolean value to false 
    RouteToHeli=false;
  }
  if(response.rows[0].elements[1].status="OK"&&response.rows[0].elements[1].duration!=undefined)// if there are values for the driving to the plane site 
  {
        PlaneDriveTime=response.rows[0].elements[1].duration.value/3600;// get the values in the form that we are most used to 
        PlaneDriveDistance=response.rows[0].elements[1].distance.value/1000;
  }
  else if(this.Data.StartLoc.name=="Sena Memorial Nursing Station"||this.Data.StartLoc.name=="Wanapetum Memorial Health Centre")// for the two special cases that do not have a route defined by google 
  {
    //Trina talked to people at these locations and decided that we should add about 10 minutes for each 
    PlaneDriveDistance=getDistance(this.Data.lat,this.Data.lng,this.loc[1].lat,this.loc[1].lng);// get the straight line distance getDistance is a function we created 
   // we used to use the distance and a predefined speed to estimate the time needed to be added which we may need again if there are more cases like this 
    PlaneDriveTime=600/3600;// have the time be 10 minutes which is 600/3600 in the base we are using 
  }  
  else{// if there are no routes or special routes set to false 
    RouteToPlane=false;
  }
  
var flight_time;
await this.getFlightSpeeds().then(data => {// use the get flight speed function 
  flight_time = data;
});


var heli_speed: number = flight_time.speed_vals.heli_speed;
var flight_o_weather: number = flight_time.speed_vals.origin_weather;
var AirTravel=[];
if(RouteToHeli==true)// if there is a route to helipad sites 
{
  for(var m=0;m<dest.length;m++)
{ 
var heliDist= getDistance(loc[0].lat,loc[0].lng,dest[m].Sites[0].lat,dest[m].Sites[0].lng)+HeliDriveDistance;//get the distance in straight line form plus what we have for the driving time
var time=(heliDist / heli_speed) * flight_o_weather * this.destination_flight_weather_array[m]+HeliDriveTime;//have the time be the distance with multipliers added and driving time added
  var heliopt={//set the format for the cards which is very similar to what we have for driving 
    origin: loc[0],
    desti:dest[m].Sites[0],
    Dist:heliDist,
    DistChar: convertDist(heliDist),//convert the distance into a string using a function we created 
    name: dest[m].CloseHospital,
    city: dest[m].CloseCity,
    closestSite: endpoints[m],
    id: endpoints[m].id,
    Helipad: true,
    bRegionalStrokeCentre:endpoints[m].bRegionalStrokeCentre,
    Airport: false,
    TimeWithMult: time,
    TimeWithMultChar: convertTimePlanes(time),// convert the time into a string using a function we created specifically for the time of these flight options 
    CompTime: time
    
  }
 AirTravel.push(heliopt);// add the object to the distances array
  }
}


if(RouteToPlane==true)// if there are routes to planes 
{
for(var m=0;m<dest.length;m++)
{ var distplane= getDistance(loc[1].lat,loc[1].lng,dest[m].Sites[1].lat,dest[m].Sites[1].lng)+PlaneDriveDistance;// get the straight line distance added to the driving distance
  var timeplane=(distplane / heli_speed) * flight_o_weather * this.destination_flight_weather_array[m]+PlaneDriveTime;// get the total time based on distance and speed with the driving time added on 

  var flightopt={//create the object to be displayed on the cards 
    origin: loc[1],
    desti:dest[m].Sites[1],
    Dist: distplane,
    DistChar: convertDist(distplane),// convert to char using the function we created 
    name: dest[m].CloseHospital,
    city: dest[m].CloseCity,
    closestSite: endpoints[m],
    id: endpoints[m].id,
    Helipad: false,
    Airport: true,
    bRegionalStrokeCentre:endpoints[m].bRegionalStrokeCentre,
    TimeWithMult: timeplane,
    TimeWithMultChar: convertTimePlanes(timeplane),// convert to char using the function we created 
    CompTime: timeplane
    
  }
  AirTravel.push(flightopt);// add the objects to the same array 
}
}
  return AirTravel;// return the total array with helicopters and airplanes if routes where found 
}
}//end of the export class 

function convertDist(dist)//convert the distance into a string 
{
  var distString=(Math.ceil(dist)).toString()+" km";//round the number up and convert into a string 
  return distString;
}


async function convertTime(obj: any)// convert the driving time into a string 
{
for(var l=0;l<obj.length;l++)// go through all of the objects in the array and convert the numbers into strings for time 
{
  var newtimeChar=obj[l].TimeWithMult;
  newtimeChar=newtimeChar/3600;
  let hours=Math.abs(newtimeChar);// get the absolute value to find the value for the hours 
  hours=Math.floor(hours);//round down to find the hours without the minutes
  let minutes=Math.abs(newtimeChar)-hours;// find the minutes by subtracting the hours
  minutes=Math.ceil(minutes*60);// get the minutes rounded up and converted into the right base in this case 0.5 would be 30 min 
  if(minutes==60)// if the minutes are 60 an hour would have passed
  {
    minutes=0;//reset the minutes
    hours++;// add an hour 
  }/*
 if (hours != 0 && minutes != 0){// if none of them are zero display hours and minutes 
    newtimeChar=hours.toString()+" hours "+minutes.toString()+" mins";
  }
  else if (minutes == 0){// if there are zero minutes just display hours 
    newtimeChar=hours.toString()+" hours";
  }
  else{// if it is not an hour yet just display minutes 
    newtimeChar=minutes.toString()+" mins";
  }*/
  if(hours<10)
{
  newtimeChar="0"+hours.toString()+":";
}
else{
  newtimeChar=hours.toString()+":";
}

if(minutes<10)
{
  newtimeChar+="0"+minutes.toString();
}
else{
  newtimeChar+=minutes.toString();
}
  obj[l].TimeWithMultChar=newtimeChar;// set the new time in the object 
}


return obj;// return the object with the new times 
}

function convertTimePlanes(obj: any)//convert the time into hours when dealing with the flight time the main calculations are the same to what is above but it returns something different 
{
  var newtimeChar=obj;
  let Hours=Math.abs(newtimeChar);// get the absolute value and just worry about the number before the decimal 
  Hours=Math.floor(Hours);
  let Minutes=Math.abs(newtimeChar)-Hours;//get the number after the decimal 
  Minutes=Math.ceil(Minutes*60);//convert it into minutes
  if(Minutes==60)// if it has been an hour reset the minutes and add an hour 
  {
    Minutes=0;
    Hours++;
  }
/*
  if (Hours != 0 && Minutes != 0){// if they are not zero display them all 
    newtimeChar=Hours.toString()+" hours "+Minutes.toString()+" mins";
  }
  else if (Minutes == 0){// if there are no minutes just display hours 
    newtimeChar=Hours.toString()+" hours";
  }
  else if (Hours==0)
  {// if there are no hours just display minutes 
    newtimeChar=Minutes.toString()+" mins";
  }
*/
if(Hours<10)
{
  newtimeChar="0"+Hours.toString()+":";
}
else{
  newtimeChar=Hours.toString()+":";
}

if(Minutes<10)
{
  newtimeChar+="0"+Minutes.toString();
}
else{
  newtimeChar+=Minutes.toString();
}

return newtimeChar;// return the value not the whole array of objects like in the other one 
}


function getDistance(lat1,lon1,lat2,lon2) {// get the straight line distance between two lat and long points 
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)// return the distance in kilometers 
}

