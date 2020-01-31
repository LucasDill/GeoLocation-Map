import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LastKnownWellPage } from '../last-known-well/last-known-well';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms"
import { GeolocationOptions, Geoposition } from '@ionic-native/geolocation/ngx';
import { NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'page-patient-location',
  templateUrl: 'patient-location.html'
})
export class PatientLocationPage {

  @ViewChild("search", {static: false})
  public searchElementRef;

  public lat: number;
  public lng: number;
  
  constructor(public navCtrl: NavController, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, public formBuilder: FormBuilder,public Data: DataServiceProvider) {
      
      this.setCurrentPosition();
  }

  ionViewDidLoad() {

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
                this.lat = place.geometry.location.lat();
                this.lng = place.geometry.location.lng();
                this.Data.lat = this.lat;
                this.Data.lng = this.lng;
                console.log(this.lat);
                console.log(this.lng);
            });
        });
    });
}




private setCurrentPosition() {
  if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
      });
  }
}
  goToLastKnownWell(params){
    if (!params) params = {};
    this.navCtrl.push(LastKnownWellPage);
  }


}
