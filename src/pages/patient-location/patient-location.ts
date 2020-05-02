import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder } from "@angular/forms"
import { NgZone, OnInit, ViewChild } from '@angular/core';
import { DataServiceProvider } from '../../providers/data-service';
import { MapsAPILoader } from '@agm/core';
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { AngularFirestore } from "angularfire2/firestore"
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore"; 

import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Rx';
import { ImagingPage } from '../imaging/imaging';
import { ImagingRequiredPage } from '../imaging-required/imaging-required';


import { WeatherService } from './weather';
import { RoutingProvider } from '../../providers/routing';

@Component({
  selector: 'page-patient-location',
  templateUrl: 'patient-location.html'
})
export class PatientLocationPage implements OnInit{

  Telestroke:any;

  public healthCentres: AngularFireList<any>;
  @ViewChild("search")
  public searchElementRef;
  buttonDisabled: boolean;
  public lat: number;
  public lng: number;

  next: number;
  
  db: any;
 

  constructor(public navCtrl: NavController, private mapsAPILoader: MapsAPILoader,
     public formBuilder: FormBuilder,public Data: DataServiceProvider,
    public DataBase: AngularFireDatabase,
    private weatherService: WeatherService,public Routes: RoutingProvider) {
      this.buttonDisabled = true;
      this.db = firebase.firestore();
      //this.setCurrentPosition();
  }

  ionViewDidLoad() {

    //set current position
    //this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load();

}


// call weather.ts to get weather of selected location (see getLatLng() function)
public weather;
public id;
public description;
public icon;
public tempreal;
public tempfeel;

async getWeather(){
    await this.weatherService.getWeatherFromApi(this.Data.lat, this.Data.lng).subscribe( weather => {  
          this.weather = weather;
          this.id = this.weather.weather[0].id;
          this.description = this.weather.weather[0].description;
          this.icon = this.weather.weather[0].icon;
          this.tempreal = this.weather.main.temp - 273.15;
          this.tempfeel = this.weather.main.temp - 273.15;
          //console.log(weather);
          this.Data.origin_weatherdata = [this.id, this.description, this.icon, this.tempreal, this.tempfeel];
          // gets description of weather
         // console.log(this.Data.origin_weatherdata);
          this.Data.origin_id = this.id;
          this.Data.origin_icon = "./assets/weather/" + this.Data.origin_weatherdata[2] + ".png";
          this.Data.origin_tempreal = this.tempreal;
          this.Data.origin_tempfeel = this.tempfeel;
        });

}


// get current location this is triggered by the Use my Location button and is currently disabled 
// Once I figure out the firebase and have it syncronized instead of querying I will come up with a search that will find the appropriate health center 
 setCurrentPosition() {
  if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
          this.Data.lat = position.coords.latitude;
          this.Data.lng = position.coords.longitude;
          console.log(position.coords.latitude);
          console.log(position.coords.longitude);
          
      });
  }
}


  Medical_Centers;
  startAt = new Subject()
  endAt = new Subject()
  start;
  end;

  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();

  // subscribes to firestore to get realtime results of keys when pressed
  ngOnInit() {
    Observable.combineLatest(this.startobs, this.endobs).subscribe((value) => {
      this.firestorequery(value[0], value[1]).then((Medical_Centers) => {
        this.Medical_Centers = Medical_Centers;
    });
  });
  }


  // gets key pressed (see HTML) and pushes it into array of pressed keys
  search($event) {
      let q = $event.target.value
      this.startAt.next(q)
      this.endAt.next(q+"\uf8ff")
  }

  // firestore database search
  firestorequery(start, end){
   
    if (start.length != 0 && start == start.toUpperCase())
    {
      this.next = 1;
      return new Promise((resolve, reject) => {
        this.db.collection("/Health Centers/")
          //.where('city', '==', start
          .orderBy("city")
          .startAt(start)
          .endAt(end+'\uf8ff')
          .limit(3)
          .get()
          .then((querySnapshot) => {
            let arr = [];
            querySnapshot.forEach(function(doc) {
              var obj = JSON.parse(JSON.stringify(doc.data()));
              obj.id = doc.id;
              //obj.eventId = doc.id;
              arr.push(obj);
              //console.log(doc.data())
            });
      
            if (arr.length > 0) {
              resolve(arr);
            } else {
              console.log("No such location!");
              
              this.db.collection("/Health Centers/")
            //.where('city', '==', start)
            .orderBy("name")
            .startAt(start)
            .endAt(end+'\uf8ff')
            .limit(3)
            .get()
            .then((querySnapshot) => {
              let arr = [];
              querySnapshot.forEach(function(doc) {
                var obj = JSON.parse(JSON.stringify(doc.data()));
                obj.id = doc.id;
                //obj.eventId = doc.id;
                arr.push(obj);
                //console.log(doc.data())
              });
        
              if (arr.length > 0) {
                resolve(arr);
              } else {
                console.log("No such location!");
                resolve(null);
              }
            })
            .catch((error: any) => {
              reject(error);
            });
            }
          })
          .catch((error: any) => {
            reject(error);
          });
  
           });
    }
    if (start.length != 0 && this.next == 1)
    {
      return new Promise((resolve, reject) => {
        this.db.collection("/Health Centers/")
          //.where('city', '==', start
          .orderBy("city")
          .startAt(start)
          .endAt(end+'\uf8ff')
          .limit(3)
          .get()
          .then((querySnapshot) => {
            let arr = [];
            querySnapshot.forEach(function(doc) {
              var obj = JSON.parse(JSON.stringify(doc.data()));
              obj.id = doc.id;
              //obj.eventId = doc.id;
              arr.push(obj);
              //console.log(doc.data())
            });
      
            if (arr.length > 0) {
              resolve(arr);
            } else {
              console.log("No such location!");
              
              this.db.collection("/Health Centers/")
            //.where('city', '==', start)
            .orderBy("name")
            .startAt(start)
            .endAt(end+'\uf8ff')
            .limit(3)
            .get()
            .then((querySnapshot) => {
              let arr = [];
              querySnapshot.forEach(function(doc) {
                var obj = JSON.parse(JSON.stringify(doc.data()));
                obj.id = doc.id;
                //obj.eventId = doc.id;
                arr.push(obj);
                //console.log(doc.data())
              });
        
              if (arr.length > 0) {
                resolve(arr);
              } else {
                console.log("No such location!");
                resolve(null);
              }
            })
            .catch((error: any) => {
              reject(error);
            });
            }
          })
          .catch((error: any) => {
            reject(error);
          });
  
           });
    }
    else if (start.length == 0 && this.next == 1)
    {
      this.next = 0;
      return new Promise((resolve, reject) => {
        this.db.collection("/Health Centers/")
          //.where('city', '==', start
          .orderBy("cityForSearch")
          .startAt(start)
          .endAt(end+'\uf8ff')
          .limit(3)
          .get()
          .then((querySnapshot) => {
            let arr = [];
            querySnapshot.forEach(function(doc) {
              var obj = JSON.parse(JSON.stringify(doc.data()));
              obj.id = doc.id;
              //obj.eventId = doc.id;
              arr.push(obj);
              //console.log(doc.data())
            });
      
            if (arr.length > 0) {
              resolve(arr);
            } else {
              console.log("No such location!");
              
              this.db.collection("/Health Centers/")
            //.where('city', '==', start)
            .orderBy("nameForSearch")
            .startAt(start)
            .endAt(end+'\uf8ff')
            .limit(3)
            .get()
            .then((querySnapshot) => {
              let arr = [];
              querySnapshot.forEach(function(doc) {
                var obj = JSON.parse(JSON.stringify(doc.data()));
                obj.id = doc.id;
                //obj.eventId = doc.id;
                arr.push(obj);
                //console.log(doc.data())
              });
        
              if (arr.length > 0) {
                resolve(arr);
              } else {
                console.log("No such location!");
                resolve(null);
              }
            })
            .catch((error: any) => {
              reject(error);
            });
            }
          })
          .catch((error: any) => {
            reject(error);
          });
  
           });
    }
    else
    {
      return new Promise((resolve, reject) => {
        this.db.collection("/Health Centers/")
          //.where('city', '==', start
          .orderBy("cityForSearch")
          .startAt(start)
          .endAt(end+'\uf8ff')
          .limit(3)
          .get()
          .then((querySnapshot) => {
            let arr = [];
            querySnapshot.forEach(function(doc) {
              var obj = JSON.parse(JSON.stringify(doc.data()));
              obj.id = doc.id;
              //obj.eventId = doc.id;
              arr.push(obj);
              //console.log(doc.data())
            });
      
            if (arr.length > 0) {
              resolve(arr);
            } else {
              console.log("No such location!");
              
              this.db.collection("/Health Centers/")
            //.where('city', '==', start)
            .orderBy("nameForSearch")
            .startAt(start)
            .endAt(end+'\uf8ff')
            .limit(3)
            .get()
            .then((querySnapshot) => {
              let arr = [];
              querySnapshot.forEach(function(doc) {
                var obj = JSON.parse(JSON.stringify(doc.data()));
                obj.id = doc.id;
                //obj.eventId = doc.id;
                arr.push(obj);
                //console.log(doc.data())
              });
        
              if (arr.length > 0) {
                resolve(arr);
              } else {
                console.log("No such location!");
                resolve(null);
              }
            })
            .catch((error: any) => {
              reject(error);
            });
            }
          })
          .catch((error: any) => {
            reject(error);
          });
  
           });
    }
  }


  cityLocation;

  getLatLng(name){
  var cityLocation;
  var lat, lng, city, area, Telestroke;
  var OriginObject;
    return new Promise((resolve, reject) => {
    this.db.collection("/Health Centers/")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(function(doc) {
        if (doc.data().name == name) 
          {
            cityLocation = new google.maps.LatLng(
              doc.data().lat,
              doc.data().lng
            );
            lat = doc.data().lat;
            lng = doc.data().lng;
            city = doc.data().city;
            area = doc.data().area;
            OriginObject=doc.data();
            if (
              doc.data().bTelestroke == true
            ) {
              Telestroke=true;
              // write code here to go to next applicable page
              console.log("YOU ARE AT A TELSTROKE CENTRE");

            }
            else{
              // write code here to go to next applicable page
              Telestroke=false;
            //  console.log("YOU ARE NOT AT A TELESTROKE CENTRE");
              
            }
           
      }
      });
      // set variables to public versions of the variables
      // could not do this directly inside of query
      this.Data.StartLoc=OriginObject;
      this.cityLocation = cityLocation;
      this.Data.lat = lat;
      this.Data.lng = lng;
      this.Data.city = city;
      this.Data.origin_area = area;
      this.Telestroke = Telestroke;
      // get weather from chosen city
      this.getWeather();
      if (Telestroke == true) {
        this.navCtrl.push(ImagingRequiredPage);
      }
      else{
        this.navCtrl.push(ImagingPage);
      }
      
    })
     .catch((error: any) => {
            reject(error);
          });
  });

  }

}
