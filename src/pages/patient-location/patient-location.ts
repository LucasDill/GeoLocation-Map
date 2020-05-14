import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder } from "@angular/forms"
import { OnInit, ViewChild } from '@angular/core';
import { DataServiceProvider } from '../../providers/data-service';
import { MapsAPILoader } from '@agm/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { HttpClient} from "@angular/common/http";
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
 
  @ViewChild("search")
  
  next: number;
  
  db: any;
 

  constructor(private httpClient: HttpClient,public navCtrl: NavController, private mapsAPILoader: MapsAPILoader,
     public formBuilder: FormBuilder,public Data: DataServiceProvider,
    public DataBase: AngularFireDatabase,
    private weatherService: WeatherService,public Routes: RoutingProvider) {
     
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
  //getWeatherFromApi is found in the weather.ts file 
    await this.weatherService.getWeatherFromApi(this.Data.lat, this.Data.lng).subscribe( weather => {  // async function returning the weather information for the area specified after the location has been found
          this.weather = weather;
          this.id = this.weather.weather[0].id;//the weather id is used to find the multiplier for the time multiplier 
          this.description = this.weather.weather[0].description;//the description of the weather at the moment this value is not used 
          this.icon = this.weather.weather[0].icon;
          this.tempreal = this.weather.main.temp - 273.15;//the actual temperature and feel of the temperature in the area this is used for the display on the routing options
          this.tempfeel = this.weather.main.temp - 273.15;// the temperature is retunred in Kelven hence the -273.15
          //console.log(weather);
         this.Data.origin_weatherdata = [this.id, this.description, this.icon, this.tempreal, this.tempfeel];//Set the custom array in the data provider with the weather data 
          // gets description of weather
         // console.log(this.Data.origin_weatherdata);
          this.Data.origin_id = this.id;//Set specifics of the weather in the data provider used for finding the multipler and other parts 
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
          this.Data.lng = position.coords.longitude;//Still need to impliment this part 
          console.log("Your current position is:\n"+"Latitude: "+position.coords.latitude+"\n"+"Longitude: "+position.coords.longitude);
          //console.log("The closest Health Center is:");//needs to be implimented after sorting out the firebase maybe with a pop up window 
          
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
      return new Promise((resolve, reject) => {//search by the cities with a start and end but keep it to a limit of 3 
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
              arr.push(obj);//push the results onto an array so we can combine it with other searches and give the final results 
              //console.log(doc.data())
            });
      
            if (arr.length > 0) {//if there are any results in the array resolve or search again by the name of the health center
              resolve(arr);
            } else {
              //console.log("No such location!");
              
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
        
              if (arr.length > 0) {//if there are results show them and if not end the searches and look for any errors 
                resolve(arr);
              } else {
                //console.log("No such location!");
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
    if (start.length != 0 && this.next == 1)//do another search first by city and the by name 
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
              //console.log("No such location!");
              
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
                //console.log("No such location!");
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
          .orderBy("cityForSearch")//to deal with the issue of capatalization we have created extra data types that have the names without any capatalization 
          .startAt(start)
          .endAt(end+'\uf8ff')
          .limit(3)
          .get()
          .then((querySnapshot) => {
            let arr = [];
            querySnapshot.forEach(function(doc) {
              var obj = JSON.parse(JSON.stringify(doc.data()));//the data is returned in a JSON format so we must parse it to get in the formay that we want 
              obj.id = doc.id;
              //obj.eventId = doc.id;
              arr.push(obj);
              //console.log(doc.data())
            });
      
            if (arr.length > 0) {
              resolve(arr);
            } else {
              //console.log("No such location!");
              
              this.db.collection("/Health Centers/")
            //.where('city', '==', start)
            .orderBy("nameForSearch")//same story this is a data type name that has no capatalization 
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
                //console.log("No such location!");
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
              //console.log("No such location!");
              
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
               // console.log("No such location!");
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
    .then(async (querySnapshot) => {
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
              //console.log("YOU ARE AT A TELSTROKE CENTRE");//used to test and make sure it was recognizing the right thing 

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
      var SendingTimeZone;
      
     (await this.weatherService.getTimeZone(lat.toString(), lng.toString())).subscribe(Results=>{
      var i=  waitforResults();
      async function waitforResults()
      {
        if (Results==undefined||Results.dstOffset==undefined||Results.rawOffset==undefined)
        {
          console.log("Need to wait");
          setTimeout(this.waitforResults(),25);
        }
        else{
          var finalChange=(Results.rawOffset+Results.dstOffset)/3600;
          SendingTimeZone=finalChange;
          console.log(SendingTimeZone);
          return finalChange;
        }
      }
     
      })//get the time zone based on the lat and long 

      this.getWeather();
var user=this.Data.UserTimeZone;
     let m= await waitForTimeZone();

      function waitForTimeZone(){
        if(SendingTimeZone==undefined)
        {
          console.log("Need to wait");
          setTimeout(waitForTimeZone,50);
        }
        else{
          console.log(SendingTimeZone);
          if(this.user==SendingTimeZone)
     {
       console.log("They are in the same time Zone");
       if (Telestroke == true) {//if the center entered is a telestroke site go to the Imaging required page and if not go to the imaging routes page 
        this.navCtrl.push(ImagingRequiredPage);
      }
      else{
        this.navCtrl.push(ImagingPage);
      }
     } 
     else if(SendingTimeZone!=undefined){
       console.log("It is a Different time zone");
     }
        }
      }
      console.log(m);
    
     


      // get weather from chosen city
      
      
      
    })
     .catch((error: any) => {//catch any errors that might have been thrown 
            reject(error);
          });
  });

  }

}
