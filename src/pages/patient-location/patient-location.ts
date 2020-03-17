import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LastKnownWellPage } from '../last-known-well/last-known-well';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms"
import { GeolocationOptions, Geoposition } from '@ionic-native/geolocation/ngx';
import { NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { TPaQuestionPage } from '../t-pa-question/t-pa-question';

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
  items;
  next: number;
  
  db: any;
  collection: string = 'Health Centers';

  constructor(public navCtrl: NavController, private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone, public formBuilder: FormBuilder,public Data: DataServiceProvider,
    public DataBase: AngularFireDatabase,
    private afs: AngularFirestore,
    private weatherService: WeatherService,public Routes: RoutingProvider) {
      this.buttonDisabled = true;
      this.db = firebase.firestore();
      //this.setCurrentPosition();
  }

  ionViewDidLoad() {

    //set current position
    //this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
        let nativeHomeInputBox = document.getElementById('txtHome').getElementsByTagName('input')[0];
        

        // Google Maps autocomplete
        /*let autocomplete = new google.maps.places.Autocomplete(nativeHomeInputBox, {
            types: ["address"]
        });*/
        //console.log(autocomplete);
        /*autocomplete.addListener("place_changed", () => {
            this.ngZone.run(() => {
                //get the place result
                let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                //verify result
                if (place.geometry === undefined || place.geometry === null) {
                    return;
                }

                //set latitude, longitude and zoom
                this.lat = place.geometry.location.lat();
                this.lng = place.geometry.location.lng();
                this.Data.lat = this.lat;
                this.Data.lng = this.lng;
                if(this.lat != null)
                {
                  this.buttonDisabled = false;
                }
            });
            
        });*/
        //console.log(autocomplete);
    });


this.getDataFromFirebase();
this.getData();

}


// call weather.ts to get weather of selected location (see getLatLng() function)
public weather;
public city;
public id;
public description;
public icon;
public tempreal;
public tempfeel;
public wlat;
public wlon;
async getWeather(){
    await this.weatherService.getWeatherFromApi(this.Data.lat, this.Data.lng).subscribe( weather => {  
          this.weather = weather;
          this.id = this.weather.weather[0].id;
          this.description = this.weather.weather[0].description;
          this.icon = this.weather.weather[0].icon;
          this.tempreal = this.weather.main.temp - 273.15;
          this.tempfeel = this.weather.main.temp - 273.15;
          console.log(weather);
          this.Data.origin_weatherdata = [this.id, this.description, this.icon, this.tempreal, this.tempfeel];
          // gets description of weather
          console.log(this.Data.origin_weatherdata);
          this.Data.origin_id = this.id;
          this.Data.origin_icon = "./assets/weather/" + this.Data.origin_weatherdata[2] + ".png";
          this.Data.origin_tempreal = this.tempreal;
          this.Data.origin_tempfeel = this.tempfeel;
        });

}


// get current location
private setCurrentPosition() {
  if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
          this.Data.lat = position.coords.latitude;
          this.Data.lng = position.coords.longitude;
          console.log(position.coords.latitude);
          console.log(position.coords.longitude);
          
      });
  }
}

// load data from Firebase, valueChanges and subscribe are used to get data as it is changed in Firebase in realtime
getDataFromFirebase() {
  this.DataBase.list("/Medical_Centers/")
    .valueChanges()
    .subscribe(data => {
      this.items = data;
    });
}

// load data from Firebase into local variable
getData() {
  firebase
    .database()
    .ref("/Medical_Centers/")
    .once("value")
    .then(function(data) {
    });
}



 goToLastKnownWell(params,params1,params2){
    console.log(params,params1,params2);
    //if (!params) params = {};
    this.Data.lat=params1;
    this.Data.lng=params2;
    //await this.getWeather();
    //this.Routes.getOriginWeatherMultiplier();
    //this.Routes.getOriginAreaMultiplier();
    //this.Routes.totalOriginMultiplier();
   
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


  // realtime database search
  /*firequery(start, end){
 
    if (start.length != 0 && start == start.toUpperCase())
    {
      this.next = 1;
      return this.DataBase.list('/Medical_Centers/', ref => ref.limitToFirst(3).orderByChild('city').startAt(start).endAt(end+'\uf8ff')).valueChanges()
    }
    if (start.length != 0 && this.next == 1)
    {
      return this.DataBase.list('/Medical_Centers/', ref => ref.limitToFirst(3).orderByChild('city').startAt(start).endAt(end+'\uf8ff')).valueChanges()
    }
    else if (start.length == 0 && this.next == 1)
    {
      this.next = 0;
      return this.DataBase.list('/Medical_Centers/', ref => ref.limitToFirst(3).orderByChild('cityForSearch').startAt(start).endAt(end+'\uf8ff')).valueChanges()
    }
    else
    {
      return this.DataBase.list('/Medical_Centers/', ref => ref.limitToFirst(3).orderByChild('cityForSearch').startAt(start).endAt(end+'\uf8ff')).valueChanges()
    }
  }*/

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
    return new Promise((resolve, reject) => {
    this.db.collection("/Health Centers/")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(function(doc) {
        if (doc.id == name) 
          {
            cityLocation = new google.maps.LatLng(
              doc.data().lat,
              doc.data().lng
            );
            lat = doc.data().lat;
            lng = doc.data().lng;
            city = doc.data().city;
            area = doc.data().area;
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
              console.log("YOU ARE NOT AT A TELESTROKE CENTRE");
              
            }
           
      }
      });
      // set variables to public versions of the variables
      // could not do this directly inside of query
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
