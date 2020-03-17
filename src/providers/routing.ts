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

Database: any;
  constructor(public http: HttpClient,public Data: DataServiceProvider,public DataBase: AngularFireDatabase,
    private afs: AngularFirestore,
    private weatherService: WeatherService) {
      this.Database = firebase.firestore();
  }

  nearestLocations(param){
    console.log(this.Data.lng);
    console.log(this.Data.lat);

  this.Database.collection("/Landing Sites/")
    //ref.orderBy("lat")
    //.startAt(this.Data.lat+0.5)
    //.endAt(this.Data.lat-0.5)
    .get()
    .then((querySnapshot) => {

      querySnapshot.forEach(function(doc) {
        var obj = JSON.parse(JSON.stringify(doc.data()));
        obj.id = doc.id;
        obj.eventId = doc.id;
        console.log(doc.data());
      });

  });
console.log(this.OriginLat,this.OriginLng);
  this.Database.collection("/Health Centers/")
  //.where('city', '==', start
  .orderBy("lat")
  .startAt(Math.abs(this.OriginLat+0.5))
  .endAt(Math.abs(this.OriginLat-0.5))
  .limit(20)
  .get()
  .then((querySnapshot) => {
    let arr = [];
    querySnapshot.forEach(function(doc) {
      var obj = JSON.parse(JSON.stringify(doc.data()));
      obj.id = doc.id;
      obj.eventId = doc.id;
      arr.push(obj);
      console.log(doc.data());
    });
  });

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
  var mult=await this.totalOriginMultiplier();
  var Routes=[];
  var service= new google.maps.DistanceMatrixService();

  var origin=new google.maps.LatLng(this.Data.lat,this.Data.lng);
  var Database = this.Database;
  var weatherService = this.weatherService;
  var Data = this.Data;
  var w;

  var destination_weather_multiplier;
  var destination_area_multiplier;
  var destination_total_multiplier;

var query= await this.Database.collection("/Health Centers/").where("bTelestroke","==",true)
.get()
.then(function(querySnapshot) {
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
        TimeWithMult: 0,
        TimeWithMultChar: "",
        Timechar: "",
        Timeval: 0,
        DistChar: "",
        Dist: 0,
        weather_code: 0
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
var destinations=[];
for(var i=0;i<Routes.length;i++)
{
let coords= new google.maps.LatLng(Routes[i].lat,Routes[i].lng);
destinations[i]=coords;

}
//console.log(destinations);
//console.log(origin);

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
        Routes[m].TimeWithMult=Routes[m].Timeval*final_multiplier;
        console.log(Routes[m])
        await initiateMultipliers(Routes[m].weather_code, Routes[m].area).then(data => {
          final_multiplier = data;
        });
        console.log(mult)
        console.log(m)
        console.log(final_multiplier)
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
      if (route.Dist == 0) {
          Routes.splice(Routes.indexOf(route), 1);
          break;
      }      
    }
    
   // console.log(response.rows[0].elements[0]);
   //console.log(response);
   //console.log("Status: "+status);
   await sortRoutes();
  // Routes=addMult(Routes);
  
  }
  async function sortRoutes(){
    Routes.sort((a,b)=>a.TimeWithMult-b.TimeWithMult);
    console.log(Routes.sort((a,b)=>a.TimeWithMult-b.TimeWithMult))
    console.log(Routes.sort((a,b)=>a.Timeval-b.Timeval))
  }
  return Routes;
})
.catch(function(error) {
  console.log("Error getting documents: ", error);
});
this.ImgRoutes= query;
console.log(query);
return query;
}

gettPA(){
  

}
}
 

function getEVT(){
  
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
