import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {DataServiceProvider } from '../providers/data-service';
import { MapsAPILoader } from '@agm/core';
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { AngularFirestore } from "angularfire2/firestore"
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore"; 
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Rx';
import { isNgTemplate, identifierModuleUrl } from '@angular/compiler';
import { WeatherService } from '../pages/patient-location/weather';
import { getValueFromFormat } from 'ionic-angular/umd/util/datetime-util';
import { p } from '@angular/core/src/render3';
import { repeat } from 'rxjs-compat/operator/repeat';

/*

  Generated class for the RoutingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RoutingProvider {
OriginLat: any=this.Data.lat;
OriginLng:any=this.Data.lng;// probably need to change was not working 
googleResults:any;

ImgRoutes: any;
tPARoutes: any;
EVTRoutes: any;
closestFlightOpt: any=[];
Database: any;
LandingSites:any;

  constructor(public http: HttpClient,public Data: DataServiceProvider,public DataBase: AngularFireDatabase,
    private afs: AngularFirestore,
    private weatherService: WeatherService) {
      this.Database = firebase.firestore();
  }

    async nearestLocations(){
    var lng=this.Data.lng;
    var lat=this.Data.lat;
     var distances= this.Database.collection("/Landing Sites/")
      //ref.orderBy("lat")
      //.startAt(this.Data.lat+0.5)
      //.endAt(this.Data.lat-0.5)
      .get()
      .then((querySnapshot) => {
        var total=[]
        querySnapshot.forEach(function(doc) {
          
         
            var obj = JSON.parse(JSON.stringify(doc.data()));
            total.push(obj);
          
        });
        this.LandingSites=total;
        return total;
        
    });
    return distances;
  }
   async getCloseLoc(lat, lng)
    {
      var all= this.LandingSites;
     // console.log(all.length);
      var heli=[];
      var plane=[];
      var repeat=1;
      var radius=0.5;
      var closestFlightOpt=[];
      while(repeat==1)
      {
        for(var i=0;i<all.length;i++)
        {
          if(Math.abs(Math.abs(all[i].lat)-Math.abs(lat))<radius&&Math.abs(Math.abs(all[i].lng)-Math.abs(lng))<radius)
          {
            //console.log("found");
            if(all[i].type=="Airport")
            {
              plane.push(all[i]);
            }
            else if(all[i].type=="Helipad")
            {
              heli.push(all[i]);
            }
          }
        }
        if(heli.length==0||plane.length==0)
        {
          radius=radius+0.2;
         // console.log("Need to repeat");
        }
        else
        {
         // console.log("Found an Airport and Helipad");
          repeat=0;
        }
      }
      heli.sort((a,b)=>(Math.abs(Math.abs(a.lat)-Math.abs(lat))+Math.abs(Math.abs(a.lng)-Math.abs(lng)))-(Math.abs(Math.abs(b.lat)-Math.abs(lat))+Math.abs(Math.abs(b.lng)-Math.abs(lng))));
      plane.sort((a,b)=>(Math.abs(Math.abs(a.lat)-Math.abs(lat))+Math.abs(Math.abs(a.lng)-Math.abs(lng)))-(Math.abs(Math.abs(b.lat)-Math.abs(lat))+Math.abs(Math.abs(b.lng)-Math.abs(lng))));
      //console.log(plane);
      //console.log(heli);
      closestFlightOpt[0]=heli[0];
      closestFlightOpt[1]=plane[0];
     // console.log(closestFlightOpt);
      return closestFlightOpt;
    }
    




origin_weather_multiplier: number;
origin_area_multiplier: number;
origin_total_multiplier: any;

// multipliers for weather and area
async getOriginWeatherMultiplier(){
await this.Database.collection("/Multipliers/").doc(JSON.stringify(this.Data.origin_id))
  .get()
  .then((querySnapshot) => {
      this.origin_weather_multiplier = querySnapshot.data().multi;
      return this.origin_weather_multiplier;
  });

}

async getOriginAreaMultiplier(){
await this.Database.collection("/Multipliers Area/").doc(this.Data.origin_area)
  .get()
  .then((querySnapshot) => {
      this.origin_area_multiplier = querySnapshot.data().multi;
      return this.origin_area_multiplier;
  });

}

async totalOriginMultiplier(){
  await this.getOriginAreaMultiplier();
  await this.getOriginWeatherMultiplier();
  this.origin_total_multiplier = (this.origin_weather_multiplier + this.origin_area_multiplier)/2;
  return this.origin_total_multiplier;

}

async getImaging(){
  await this.getOriginAreaMultiplier();
  await this.getOriginWeatherMultiplier();
  
  var Routes=[];
  
var serv;
  
  
  var weatherService = this.weatherService;
  var Data = this.Data;
  var w;

  

var ret= await this.Database.collection("/Health Centers/").where("bTelestroke","==",true)
.get()
.then(async function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, " => ", doc.data().name);
      var distobj={
        name:doc.data().name,
        address:doc.data().address,
        city:doc.data().city,
        lat:doc.data().lat,
        lng:doc.data().lng,
        area:doc.data().area,
        Method:"Driving",
        TimeWithMult: 0,
        TimeWithMultChar: "",
        Timechar: "",
        Timeval: 0,
        DistChar: "",
        Dist: 0,
        weather_code: ""
      }
     // console.log(distobj);
      Routes.push(distobj);

      weatherService.getWeatherFromApi(distobj.lat, distobj.lng).subscribe(weather => {  
        w = weather;
        let id = w.weather[0].id;
        distobj.weather_code = id;
        let description = w.weather[0].description;
        let icon = w.weather[0].icon;
        let tempreal = w.main.temp - 273.15;
        let tempfeel = w.main.temp - 273.15;
        // gets description of weather
        let destination_weatherdata = [id, description, icon, tempreal, tempfeel];
      }); 
  });
  
 // console.log(Routes.length);



//console.log(destinations);
//console.log(origin);

    
   // console.log(response.rows[0].elements[0]);
   //console.log(response);
   //console.log("Status: "+status);
   
  // Routes=addMult(Routes);
  return Routes;
});
var destinations=[];
for(var i=0;i<Routes.length;i++)
{
let coords= new google.maps.LatLng(Routes[i].lat,Routes[i].lng);
destinations[i]=coords;
}
console.log(ret);
ret=await this.distMat(destinations,ret);
console.log(ret);
return ret;
}

async  distMat(destinations,Routes){
  var mult=await this.totalOriginMultiplier();
  var Database = this.Database;
  var destination_weather_multiplier;
  var destination_area_multiplier;
  var destination_total_multiplier;
  var origin=new google.maps.LatLng(this.Data.lat,this.Data.lng);
  var service= new google.maps.DistanceMatrixService();
   service.getDistanceMatrix(
   {
     origins: [origin],
     destinations: destinations,
     travelMode: google.maps.TravelMode.DRIVING,
   },callback);
   var final_multiplier;
   async function callback(response,status){
     for(var m=0;m<Routes.length;m++)
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
        // console.log(Routes[m])
         //console.log(mult)
        // console.log(m)
        // console.log(final_multiplier)
     }
 
     var weather_multiplier;
     var area_multiplier;
     var destination_total;
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
             destination_weather_multiplier = querySnapshot.data().multi;
             return destination_weather_multiplier;
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
 
     Routes = await convertTime(Routes);
     for (let route of Routes) {
       if (route.Dist ==0) {
           Routes.splice(Routes.indexOf(route), 1);
           break;
       }   
       await sortRoutes();
     }
     async function sortRoutes(){
      Routes.sort((a,b)=>a.TimeWithMult-b.TimeWithMult);
    //  console.log(Routes.sort((a,b)=>a.TimeWithMult-b.TimeWithMult))
     // console.log(Routes.sort((a,b)=>a.Timeval-b.Timeval))
      return Routes;
    }
    }
    
    return Routes;
  }


 SetColour(param){
  console.log(param[0].city);
  console.log(this.Data.SinceTimeForm);
  for(var i=0; i<param.length;i++)
  {
    var RouteTime=param[i].TimeWithMult/3600;
    var timePassed=this.Data.SinceTimeForm;
    console.log(RouteTime);
    console.log(timePassed);
    if((RouteTime+timePassed)<4.5)
    {
      param[i].colour="#90EE90";
    }
    else if((RouteTime+timePassed)>=4.5&&(RouteTime+timePassed)<6)
    {
      param[i].colour="#FFFF99";
    }
    else if((RouteTime+timePassed)>=6)
    {
      param[i].colour="#F7CFCE";
    }
    
  }
   return param;
  }

async getFlights(endpoints)
{
  console.log(this.Data.lat);
  console.log(this.Data.lng);
 var loc = await this.getCloseLoc(this.Data.lat,this.Data.lng);
var dest= new Array(endpoints.length);
console.log(endpoints.length);
for(var o=0;o<endpoints.length;o++)
{
  var closesites={
    CloseHospital: endpoints[o].name,
    Sites: await this.getCloseLoc(endpoints[o].lat,endpoints[o].lng)
  }
  dest[o]=(closesites);
}
console.log(loc);
console.log(dest);

var distances= new Array(loc.length);
for(var j=0;j<loc.length;j++)
{
  distances[j]=new Array(dest.length);
}
console.log(dest);
console.log(loc);

for(var i=0;i<loc.length;i++)
{
for(var m=0;m<dest.length;m++)
{ 
  var flightopt={
    origin: loc[i],
    desti:dest[m].Sites[i],
    distance: getDistance(loc[i].lat,loc[i].lng,dest[m].Sites[i].lat,dest[m].Sites[i].lng),
    DistChar: convertDist(getDistance(loc[i].lat,loc[i].lng,dest[m].Sites[i].lat,dest[m].Sites[i].lng)),
    type: dest[m].Sites[i].type,
    name: dest[m].Sites[i].siteName
    

  }
  distances[i][m]=flightopt;
}
}
console.log(distances);
  return distances;
}
}
 

function getEVT(){
  
}
function convertDist(dist)
{
  var distString=(Math.ceil(dist)).toString()+" km";
  return distString;
}


async function convertTime(obj: any)
{
for(var l=0;l<obj.length;l++)
{
  var newtimeChar=obj[l].TimeWithMult;
  newtimeChar=newtimeChar/3600;
  let start=Math.abs(newtimeChar);
  start=Math.floor(start);
  let end=Math.abs(newtimeChar)-start;
  end=Math.ceil(end*60);
  if(end==60)
  {
    end=0;
    start++;
  }
  newtimeChar=start.toString()+" hours "+end.toString()+" mins";
  obj[l].TimeWithMultChar=newtimeChar;

}
return obj;
}


function getDistance(lat1,lon1,lat2,lon2) {
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
  return deg * (Math.PI/180)
}

