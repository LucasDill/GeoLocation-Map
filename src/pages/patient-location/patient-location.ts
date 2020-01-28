import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LastKnownWellPage } from '../last-known-well/last-known-well';

import { GeolocationOptions, Geoposition } from '@ionic-native/geolocation/ngx';
import { NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import {FormControl} from "@angular/forms";
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'page-patient-location',
  templateUrl: 'patient-location.html'
})
export class PatientLocationPage {

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;

  @ViewChild("search")
  public searchElementRef;
  
  
  constructor(public navCtrl: NavController, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
      
      this.zoom = 4;
      this.latitude = 39.8282;
      this.longitude = -98.5795;
      this.searchControl = new FormControl();
      this.setCurrentPosition();
  }

  ionViewDidLoad() {
    //set google maps defaults
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
        let nativeHomeInputBox = document.getElementById('txtHome').getElementsByTagName('input')[0];
        let autocomplete = new google.maps.places.Autocomplete(nativeHomeInputBox, {
            types: ["address"]
        });
        autocomplete.addListener("place_changed", () => {
            this.ngZone.run(() => {
                //get the place result
                let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                //verify result
                if (place.geometry === undefined || place.geometry === null) {
                    return;
                }

                //set latitude, longitude and zoom
                this.latitude = place.geometry.location.lat();
                this.longitude = place.geometry.location.lng();
                this.zoom = 12;
            });
        });
    });
}




private setCurrentPosition() {
  if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 12;
      });
  }
}






  goToLastKnownWell(params){
    if (!params) params = {};
    this.navCtrl.push(LastKnownWellPage);
  }
}
