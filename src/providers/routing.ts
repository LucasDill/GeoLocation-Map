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
    var ref=this.Database.collection("/Landing Sites/")
    ref.orderBy("lat")
    .startAt(Math.abs(this.OriginLat)+0.5)
    .endAt(Math.abs(this.OriginLat)-0.5)
    .get()
    .then((querySnapshot) => {
      console.log(querySnapshot);
      if (querySnapshot.empty) {
        console.log('no documents found');
      } 
      let arr = [];
      querySnapshot.forEach(function(doc) {
        var obj = JSON.parse(JSON.stringify(doc.data()));
      obj.id = doc.id;
      obj.eventId = doc.id;
      arr.push(obj);
      console.log(doc.data());
      });
    console.log(arr);

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
}
function getImaging(){

}

function gettPA(){

}
function getEVT(){
  
}
