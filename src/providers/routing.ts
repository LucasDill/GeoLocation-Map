import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {DataServiceProvider } from '../providers/data-service';
import { AngularFireDatabase } from "@angular/fire/database";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore"; 
import { WeatherService } from '../pages/patient-location/weather';
import { T } from '@angular/core/src/render3';

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
  //these are all used to determine the plan based on where the patient start location is 
 const endTBLoc=["MED_NIPIGON","MED_NOSH","MED_AGH"];//Used for the under 6 hours for the 4 special sites
 const endDryLoc=["MED_REDLAKE","MED_AGH"];//used for plans 3 
 const endFortLoc=["MED_EMO","MED_RIVERSIDERAINY","MED_AGH"];//used fort plans 4 
  if(this.Data.SinceTimeForm<6)// this is the long if statement that will get the final plan html for the page 
  {
    if((endTBLoc.includes(this.Data.StartLoc.id)&&Dest.id=="MED_TBRHSC"))//||(this.Data.StartLoc.id=="MED_NOSH"&&Dest.id=="MED_TBRHSC")||(this.Data.StartLoc.id=="MED_AGH"&&Dest.id=="MED_TBRHSC"))
    {
      this.Data.plan="2";
    }
    else if(endDryLoc.includes(this.Data.StartLoc.id)&&Dest.id=="MED_DRYDEN")
    {
      this.Data.plan="3";
    }
    else if(endFortLoc.includes(this.Data.StartLoc.id)&&Dest.id=="MED_RIVERSIDE")
    {
      this.Data.plan="4";
    }
    
    else if(this.Data.StartLoc.bRegionalStrokeCentre==true&&Dest.bRegionalStrokeCentre==true)
    {
      this.Data.plan="9";
    }
    else if(endTBLoc.includes(this.Data.StartLoc.id)||endDryLoc.includes(this.Data.StartLoc.id)||endFortLoc.includes(this.Data.StartLoc.id))
    {
      if(this.Data.StartLoc.id=="MED_NIPIGON"||this.Data.StartLoc.id=="MED_NOSH")//these two locations will call a different CACC number so will be separated into 4B
      {
        this.Data.plan="6";
      }
      else{
        this.Data.plan="5";
      }
      

    }
    else if(this.Data.StartLoc.bTelestroke==true)//!this used to be true for the first one and have the this.Data.TelestrokePlan==true
    {
      if(this.Data.HadImg==false)
      {
        this.Data.plan="8";
      }
      else{
        this.Data.plan="7";
      }
      
    }
    else{
      this.Data.plan="10";
    }
    
  }
  else if (this.Data.SinceTimeForm>=6&&this.Data.SinceTimeForm<24)//Middle ground of plans from 6-24 hours 
  {
    
    if(this.Data.StartLoc.id=="MED_EMO")// if they are in emo 
    {
      this.Data.plan="11";
    }
    else if(this.Data.StartLoc.bTelestroke==true&&this.Data.StartLoc.bRegionalStrokeCentre==false)//For special cases where it is 6-12 hours and starts at a telestroke site 
    {
      //this.Data.plan="8";
      //!Remove below part to get rid of the imaging options
      
       if(this.Data.HadImg==false)
      {
        this.Data.plan="8"
      }
      else{
        this.Data.plan="7";
      }
    }
    else if(Dest.bRegionalStrokeCentre==true)//When they are going to an evt site no special condition as it will always go to the page when over 6h 
    {
      this.Data.plan="9";
    }
    else if(this.Data.StartLoc.bTelestroke==true||this.Data.StartLoc.bTelestroke!=true)//used to also have if Telestrokeplan == true but that resulted in an error when going to non imaging routes
    {
      this.Data.plan="10";
    }
    else{
      this.Data.plan="1";
    }
  }
  else if (this.Data.SinceTimeForm>=24&&this.Data.SinceTimeForm<48)
  {
    this.Data.plan="12";
  }
  else if(this.Data.SinceTimeForm>=48){
    this.Data.plan="13";
  }
  else{
    console.error("No Plan found Critical Error")
  }


}


async MasterRoutes(searchFor){
  var startTime=performance.now();
  var a=  this.getRoutes(searchFor).then(data =>{//Search for all driving routes to telestroke centers which at the moment are the only places to get imaging 
   var DrivingRoutes=data;//set the imageroutes to be the data returned by the function 
   var FlightRoutes;//assign another variable for the total collection of card information 
  var b= this.getFlights(data).then(distances =>{//get the information on the flights from the routing provider 
FlightRoutes=distances;//set the totalcard variable with the information from the flights 
var imgroutes=this.addRoutes(data,distances);//combines the flight information and the driving information into one list 
 var testroutes=this.CombineAll(imgroutes);
 testroutes=this.addDriveHist(testroutes);
 testroutes=this.masterSort(testroutes);//Sort the combined list of flight and driving information to have the shortest amount of time first
 testroutes=this.SetColour(testroutes);
console.log("Total Loading Time: ",performance.now()-startTime)
 return testroutes;//return the final list of sorted information ready to be displayed 
 });
 return b
 });

 return a

}

filterData(data,id){
  return data.find(x=>x.id===id);
}

   async getCloseLoc(lat, lng)// gets all close locations to the site for the best airport and helipad options it will return an array with the closest helipad and airports 
    {
      var all= this.Data.AllLandingSites;
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
    



// multipliers for weather and area
 async getOriginWeatherMultiplier(){//? Changed and still works
var area=this.filterData(this.Data.AllMult,JSON.stringify(this.Data.origin_id));
return area.multi;
 
}

addDriveHist(Routes)
{
//console.log("Routes to Look for historical Data:",Routes);


if(this.Data.StartLoc.HistDrive!=undefined)// if the start location actually has a starting location with some historical data 
{
  //console.log(this.Data.StartLoc.HistDrive)
  for(var t=0;t<this.Data.StartLoc.HistDrive.length;t++)//go through each of the data points for historical driving times 
  {
    if(this.Data.StartLoc.HistDrive[t].id!="Aircraft")//some have aircraft which are not currently used
    {
      //console.log("Historical ID:",this.Data.StartLoc.HistDrive[t].id)
      var ret=this.filterData(Routes,this.Data.StartLoc.HistDrive[t].id)
      if(ret!=undefined)//When there is a case where the end location in the data is not in the established routes 
      {
        ret.HistDrive=true;
        ret.HistDriveDat={
          Avg:(this.Data.StartLoc.HistDrive[t].avg/60),
          Fastest:(this.Data.StartLoc.HistDrive[t].fast/60),
          AvgString:convertTimePlanes(this.Data.StartLoc.HistDrive[t].avg/60),
          FastestString:convertTimePlanes(this.Data.StartLoc.HistDrive[t].fast/60)
        }

        ret.CompTime=(this.Data.StartLoc.HistDrive[t].avg/60);////////////////////////////////////!!THIS WILL NEED TO BER CHANGED EVENTUALLY SO THAT THE COMP TIME WILL TAKE INTO ACCOUNT IF THE OTHER ONE IS FASTER ONCE WE KNOW THE ACCURACY
        /*ret.HistDriveAvg=this.Data.StartLoc.HistDrive[t].avg; //!Delete once you know you can use the object 
        ret.HistDriveFastest=this.Data.StartLoc.HistDrive[t].fast;
        ret.HistDriveAvgString=convertTimePlanes(this.Data.StartLoc.HistDrive[t].avg/60);//use the convertTimePlanes function which takes time as a decimal but because we have it in minutes we need to divide by 60 
        ret.HistDriveFastestString=convertTimePlanes(this.Data.StartLoc.HistDrive[t].fast/60);*/
      }
      
    }
  }

  for(var i=0;i<Routes.length;i++)//to use the ngIf statement we need to check if this value is true so if not we have to set it to false 
  {
    if(Routes[i].HistDrive==undefined)
    {
      Routes[i].HistDrive=false;
    }
  }
}
console.log(Routes)
return Routes;
}


async getOriginAreaMultiplier(){// search the database for the area multiplier for the results based on the data 
var ar=this.filterData(this.Data.AllMultArea,this.Data.origin_area);
return ar.multi;
}

async totalOriginMultiplier(area, weather){//Get the total multiplier by taking the average of the area and weather multipliers 
  var totalOriginMult= (weather + area)/2;
  return totalOriginMult;

}

heli: any;// the air speed of helicopters 
plane: any;//the air speed of planes 
flight_weather_origin: any;

async getFlightSpeeds(){// get the flight speeds of planes and helicopters which may be taken out if we figure out the database synchronization 
var helispeed=this.filterData(this.Data.AllAirSpeed,"heli");
this.heli=helispeed.speed;

  var planespeed=this.filterData(this.Data.AllAirSpeed,"plane");
this.plane=planespeed.speed;

  var flightweather=this.filterData(this.Data.AllMult,JSON.stringify(this.Data.origin_id));

  this.flight_weather_origin=flightweather.multi_air;

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
  var area=await this.getOriginAreaMultiplier();//get the neccecery information needed for the routes 
  var weather= await this.getOriginWeatherMultiplier();
 
 
  
  var weatherService = this.weatherService;
 
  var w;//create a data object for the weather 
  var search;
var obj
  if(param=="bTelestroke")
  {
    var Routes=[];// create an array for all of the routes 
    for(var i=0;i<this.Data.AllMedicalCenters.length;i++)
    {
      if(this.Data.AllMedicalCenters[i].bTelestroke==true)
      {
         obj= await this.createObject(this.Data.AllMedicalCenters[i])
        Routes.push(obj);
      }
    }
  }
  else /*if(param=="bRegionalStrokeCentre")*/{
    var Routes=[];// create an array for all of the routes 
    for(var l=0;l<this.Data.AllMedicalCenters.length;l++)
    {
      if(this.Data.AllMedicalCenters[l].bRegionalStrokeCentre==true)
      {
         obj= await this.createObject(this.Data.AllMedicalCenters[l])
        Routes.push(obj);
      }
    }
  }


var destinations=[];//create an array to get the information from all of the destinations 
for(var i=0;i<Routes.length;i++)//go through all of the routes and create lats and longs to be used to get the travel information for all of the driving routes 
{
let coords= new google.maps.LatLng(Routes[i].lat,Routes[i].lng);
destinations[i]=coords;
}

  var ret=await this.distMat(destinations,Routes, area, weather);// get the distance and time from the distance matrix api which is not as intensive as the google ones we have been using 
  //the distance matrix function is likely the one that takes the longest time and it is important that we wait for it to finish so we have results 
  
  return ret;
}


createObject(obj){
  return new Promise(async resolve=>{
  var distobj={//create an object with all of the data we need from the object along with ones that will be defined later on 
    name:obj.name,
    address:obj.address,
    city:obj.city,
    lat:obj.lat,
    lng:obj.lng,
    area:obj.area,
    id:obj.id,
    bRegionalStrokeCentre:obj.bRegionalStrokeCentre,
    Driving:true,
    TimeWithMult: 0,
    TimeWithMultChar: "",
    Timechar: "",
    Timeval: 0,
    DistChar: "",
    Dist: 0,
    expanded:false,
    weather_code: 0,
    phoneT:obj.phoneT,
    phoneN:obj.phoneN,
  }
  distobj.weather_code=<number>await this.weatherService.getWeatherFromApi(distobj.lat,distobj.lng);
  resolve(distobj)
  });
  
}



destination_flight_weather_array;

async distMat(destinations,Routes, area,weather){// this will find the travel information for all of the driving routes 
  var upper=this;
  var mult=await this.totalOriginMultiplier(area, weather);// the multiplier used to modify all of the travel times 
  var Database = this.Database;
  var destination_weather_multiplier;
  var destination_area_multiplier;

  var flight_dest_weather;
  var getflight = [];
  //console.log(Routes)
  for(var m=0;m<Routes.length;m++)// go through all of the routes and get the destination weather for each site 
  {
    
   // console.log(Routes[m].weather_code)
      await flightWeatherDestination(Routes[m].weather_code).then(data => {
         flight_destination_weather = data;
         getflight.push(flight_destination_weather);
      });
     // getflight.push(flight_destination_weather);

  }
       // get multiplier for weather of flight destination

        async function flightWeatherDestination(id){
          let val=upper.filterData(upper.Data.AllMult,(JSON.stringify(id)))
          return val.multi_air;
       }
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
        //console.log(Routes[m].Timeval)
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
           var dest=upper.filterData(upper.Data.AllMult,JSON.stringify(id))
           //console.log(dest.multi)
           return(dest.multi)
     }
 
     async function getDestinationAreaMultiplier(area){
             var area=upper.filterData(upper.Data.AllMultArea,area)
             //console.log(area.multi);
             return area.multi;
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
         
        meth="Flying";
        bdrive=false;
        hasFly=true;
        
      }
      if(comb[m].TimeWithMult>cards[i].TimeWithMult)
      {

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
return comb;
}

expandItem(event,item): void {///This function will expand the card when it is clicked 

   if (item.expanded) {
     item.expanded = false;
   } else {///////This is currently unused and it is what will eventually make the cards only expand one at a time 
     item.expanded=true;
     /*this.items.map(listItem => {//!uncomment this if I only want one to go at a time but also might need more than just to uncomment 
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
    phoneN: card.phoneN,
    phoneT:card.phoneT
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
    Sites: await this.getCloseLoc(endpoints[o].lat,endpoints[o].lng),
    phoneN:endpoints[o].phoneN,
    phoneT:endpoints[o].phoneT
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
    CompTime: time,
    phoneN:dest[m].phoneN,
    phoneT:dest[m].phoneT
    
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
    CompTime: timeplane,
    phoneN: dest[m].phoneN,
    phoneT:dest[m].phoneT
    
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
  }
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