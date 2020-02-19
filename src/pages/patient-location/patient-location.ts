import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LastKnownWellPage } from '../last-known-well/last-known-well';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms"
import { GeolocationOptions, Geoposition } from '@ionic-native/geolocation/ngx';
import { NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataServiceProvider } from '../../providers/providers/data-service';
import { MapsAPILoader } from '@agm/core';
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { AngularFirestore } from "angularfire2/firestore"
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore"; 

import { Autocomplete } from '../../providers/providers/autocomplete';
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'page-patient-location',
  templateUrl: 'patient-location.html'
})
export class PatientLocationPage implements OnInit{

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
    private auto: Autocomplete,
    private afs: AngularFirestore) {
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



  goToLastKnownWell(params){
    if (!params) params = {};
    this.navCtrl.push(LastKnownWellPage);
  }


  Medical_Centers;
  startAt = new Subject()
  endAt = new Subject()
  start;
  end;

  searchterm : string;
  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();


  ngOnInit() {
    Observable.combineLatest(this.startobs, this.endobs).subscribe((value) => {
      this.firequery(value[0], value[1]).subscribe((Medical_Centers) => {
        this.Medical_Centers = Medical_Centers;
      });
    });


    /*Observable.combineLatest(this.startobs, this.endobs).subscribe((value) => {
      this.firestorequery(value[0], value[1]);
    });*/

    
              
  }

  search($event) {
    console.log("searching");
      let q = $event.target.value
      this.startAt.next(q)
      this.endAt.next(q+"\uf8ff")
      console.log(q);
      console.log("next"+this.startAt.next(q));
  }

  firequery(start, end){
    if (start.length != 0 && start == start.toUpperCase())
    {
      this.next = 1;
      console.log("1 " + start + "," + end);
      console.log("yuck" + start.length);
      return this.DataBase.list('/Medical_Centers/', ref => ref.limitToFirst(3).orderByChild('city').startAt(start).endAt(end+'\uf8ff')).valueChanges()
    }
    else if (start.length != 0 && this.next == 1)
    {
      console.log("2 " + start + "," + end);
      return this.DataBase.list('/Medical_Centers/', ref => ref.limitToFirst(3).orderByChild('city').startAt(start).endAt(end+'\uf8ff')).valueChanges()
    }
    else if (start.length == 0 && this.next == 1)
    {
      console.log("start is blank");
      this.next = 0;
      return this.DataBase.list('/Medical_Centers/', ref => ref.limitToFirst(3).orderByChild('cityForSearch').startAt(start).endAt(end+'\uf8ff')).valueChanges()
    }
    else
    {
      //this.next = 0;
      console.log("3 " + start + "," + end);
      return this.DataBase.list('/Medical_Centers/', ref => ref.limitToFirst(3).orderByChild('cityForSearch').startAt(start).endAt(end+'\uf8ff')).valueChanges()
    }
  
  
  }

  firestorequery(start, end){
    console.log("START" + start);
    return new Promise((resolve, reject) => {
      this.db.collection(this.collection)
        .where('city', '==', start)
        .get()
        .then((querySnapshot) => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.id = doc.id;
            //obj.eventId = doc.id;
            arr.push(obj);
          });
    
          if (arr.length > 0) {
            resolve(arr);
          } else {
            console.log("No such document!");
            resolve(null);
          }
        })
        .catch((error: any) => {
          reject(error);
        });
       });
 
  }

  storedLocation;
  cityLocation;
  getLatLng(name){
    
    this.DataBase.list("/Medical_Centers/")
    .valueChanges()
    .subscribe(
      data => {
        this.storedLocation = data;
        // for loop to iterate through data array which retrieves latitude and longitude of chosen imaging capable hospital location (see first if statement)
        for (var i = 0; i < data.length; i++) {
          if ((<any>data[i]).name == name) 
          {
            this.cityLocation = new google.maps.LatLng(
              (<any>data[i]).lat,
              (<any>data[i]).lng
            );
            this.Data.lat = (<any>data[i]).lat;
            this.Data.lng = (<any>data[i]).lng;
              
            if (
              (<any>data[i]).bTelestroke == true
            ) {
              // write code here to go to next applicable page
              console.log("YOU ARE AT A TELSTROKE CENTRE");

            }
            else{
              // write code here to go to next applicable page
              console.log("YOU ARE NOT AT A TELESTROKE CENTRE");
              
            }
            



          }
      }
      //console.log(this.cityLocation);
      //this.Data.location = this.cityLocation;
    }
  );



  }

}
