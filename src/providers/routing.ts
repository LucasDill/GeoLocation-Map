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

//declare var google;
//var service = new google.maps.DistanceMatrixService();
/*

  Generated class for the RoutingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RoutingProvider {
OriginLat: any=this.Data.lat;
OriginLng:any=this.Data.lng;// probably need to change was not working 
startAt=new Subject();

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



multiplier: any;
multiplier_area: any;
// multipliers for weather and area
getMultiplier(){
  return new Promise((resolve, reject) => {
  this.Database.collection("/Multipliers/").doc(JSON.stringify(this.Data.origin_weatherdata[0]))
  .get()
  .then((querySnapshot) => {
      this.multiplier = querySnapshot.data().multi;
      console.log(querySnapshot.data().multi);
  });

});

}

getMultiplierArea(){
return new Promise((resolve, reject) => {
  this.Database.collection("/Multipliers Area/").doc(this.Data.origin_area)
  .get()
  .then((querySnapshot) => {
      this.multiplier_area = querySnapshot.data().multi;
      console.log(querySnapshot.data().multi);
  });

});
}

getImaging(){
  var distance = require('google-distance-matrix');
  var origins = ['San Francisco CA'];
var destinations = ['New York NY', '41.8337329,-87.7321554'];
 
distance.matrix(origins, destinations, function (err, distances) {
    if (!err)
    {
      console.log(distances);
    }
    else{
      console.log(err);
    }
        
})

}



}
 
function gettPA(){

}
function getEVT(){
  
}
//code from stackblitz to get the direction service working well 
//https://stackblitz.com/edit/google-maps1?file=app%2Fdistance-matrix.service.ts

/*import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Rx';

import { ViewChild } from '@angular/core';
import { } from '@types/googlemaps';

@Injectable()
export class DistanceMatrixService {

    googleResults:any;
    
    googleUrl = "https://maps.googleapis.com/maps/api/distancematrix/json?origins="
    origins:String="";
    destinationKey="&destinations=";
    destinations:String="";
    googleKey = "&key=AIzaSyCJG2oV6yBeP2pwVMEL1EftSiZo7YsZNDU";
  
  constructor(public http: HttpClient) { }

  ngOnInit():void {}

  getGoogleData(){
    return this.http.get(this.googleUrl + this.origins + this.destinationKey + this.destinations + this.googleKey);
  };
}*/