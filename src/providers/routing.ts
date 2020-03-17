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
import { isNgTemplate } from '@angular/compiler';
import { WeatherService } from '../pages/patient-location/weather';

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
    private afs: AngularFirestore) {
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
getOriginWeatherMultiplier(){

this.Database.collection("/Multipliers/").doc(JSON.stringify(this.Data.origin_id))
  .get()
  .then((querySnapshot) => {
      this.origin_weather_multiplier = querySnapshot.data().multi;
      console.log(this.origin_weather_multiplier);
      return querySnapshot.data().multi;
  });

}

getOriginAreaMultiplier(){

this.Database.collection("/Multipliers Area/").doc(this.Data.origin_area)
  .get()
  .then((querySnapshot) => {
      this.origin_area_multiplier = querySnapshot.data().multi;
      console.log(this.origin_area_multiplier);
      return querySnapshot.data.multi;
  });

}

totalOriginMultiplier(){
  this.origin_total_multiplier = (this.origin_weather_multiplier + this.origin_area_multiplier)/2;
  return(this.origin_total_multiplier);

}

async getImaging(){
  var Routes=[];
  var mult=await this.totalOriginMultiplier();
  var service= new google.maps.DistanceMatrixService();
  var origin=new google.maps.LatLng(this.Data.lat,this.Data.lng);

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
        TimeWithMult: 0,
        TimeWithMultChar: "",
        Timechar: "",
        Timeval: 0,
        DistChar: "",
        Dist: 0
      }
     // console.log(distobj);
      Routes.push(distobj);
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
  function callback(response,status){
    for(var m=0;m<Routes.length;m++)
    {
      Routes[m].Timechar=response.rows[0].elements[m].duration.text;
      Routes[m].Timeval=response.rows[0].elements[m].duration.value;
      Routes[m].DistChar=response.rows[0].elements[m].distance.text;
      Routes[m].Dist=response.rows[0].elements[m].distance.value;
      console.log("Here in Loop"+mult);//need to talk with matt about this value 
      Routes[m].TimeWithMult=Routes[m].Timeval*mult;
    }
    Routes=convertTime(Routes);
    for (let route of Routes) {
      if (route.Dist == 0) {
          Routes.splice(Routes.indexOf(route), 1);
          break;
      }      
    }
    
   // console.log(response.rows[0].elements[0]);
   //console.log(response);
   //console.log("Status: "+status);
   Routes.sort((a,b)=>a.TimeWithMult-b.TimeWithMult);
  // Routes=addMult(Routes);
  
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
function convertTime(obj: any)
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