import {Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { MenuController, NavController } from "ionic-angular";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { DataServiceProvider } from '../../providers/data-service';
import { AnyMxRecord } from 'dns';
declare var google: any;//this was giving us some trouble because it kept saying that google is not defined 



// variable arrays for each marker (hospital, telestroke site, etc.), this way we can push the arrays to clear the markers when they are deselected in the UI
var gmarkers = [], gmarkers2 = [], gmarkers3 = [], gmarkers4 = [], gmarkers5 = [], gmarkers6 = [], gmarkers7 = [], gmarkers8=[],gmarkers9=[];

// variable array for pin that appears when the map is clicked, we can push to the array to clear it when a new location is clicked (this way we do not have multiple pins on the map)
var clicked_marker = [];





// array to hold directionsDisplay information so that we can push the array and show only one route on the map at one time




// loads the page
@Component({
  selector: 'page-map-explore',
  templateUrl: 'map-explore.html'
})

export class MapExplorePage {
  // define variable to hold information from Firebase database
  public hospital: AngularFireList<any>;
  // makes Google Maps API visible
    @ViewChild('Map') mapElement: ElementRef;
    map: any;
    mapOptions: any;
    height:any;
    google:any;
    location = {lat: null, lng: null};//at the start the location is set to null 
    markerOptions: any = {position: null, map: null, title: null};
    marker: any;
    db: any;
    items;
    latin: any;
    lngin: any;
    zoom: any;
    content: any;
  constructor(public zone: NgZone, public geolocation: Geolocation, public navCtrl: NavController,
    public DataBase: AngularFireDatabase,
    public Data: DataServiceProvider,
    private menu: MenuController) {
    /*load google map script dynamically */
      this.db = firebase.firestore();
  }


initmap()
{
  if(this.Data.StartLoc!=undefined&&this.Data.CityMap==true)
  {
    this.latin=this.Data.StartLoc.lat;
    this.lngin=this.Data.StartLoc.lng;
    this.zoom=10;
  }
  else{
    this.latin=48.424889;
    this.lngin=-89.270721;
    this.zoom=6;
  }
  this.map = new google.maps.Map(this.mapElement.nativeElement, {
    zoom: this.zoom,
    center:{ lat: this.latin, lng: this.lngin}
});
if(this.Data.StartLoc!=undefined&&this.Data.CityMap==true)
{
  var marker=new google.maps.Marker({
    position: { lat: this.latin, lng: this.lngin},
    map: this.map,
    title: this.Data.StartLoc.city
  });
if(this.Data.StartLoc.name!=undefined)
{
  this.content =
  "<b>Name:</b> " +
  this.Data.StartLoc.name +
  "<br>" +
  "<b>City:</b> "+
  this.Data.StartLoc.city+
  "<br>"+
  "<b>Address:</b> " +
  this.Data.StartLoc.address;  
}
else{
  this.content="<b>"+this.Data.StartLoc.city+"</b>";
}
  
     
let infoWindow = new google.maps.InfoWindow({
  content: this.content
});
google.maps.event.addListener(marker, "click", () => {
  infoWindow.open(this.map, marker);
});             

  marker.setMap(this.map);
}

}

ionViewDidLoad(){
  this.initmap();

}
ionViewDidEnter(){
  this.menu.swipeEnable(false);
}
ionViewWillLeave(){
  this.menu.swipeEnable(true);
}

ionViewWillEnter(){
if (this.Data.GivenTime==true)
{
  this.height="76vh";
}
else{
  this.height="84vh";
}
}

addMarker(map: any,LatLng:any,GivenLabel:any) {// this function will place custom markers on the map at the specific lat and long and with the label provided

  // variable to hold chosen imaging capable hospital location

let clickedm = new google.maps.Marker({
  position: LatLng,
  map: map,
  draggable: false,
  label: GivenLabel
});
// pushes marker to array (so that it can be cleared easily)
clicked_marker.push(clickedm);
}

// add information window to show data from database for markers which are in the legend when they are clicked on 
addInfoWindow(marker, content) {
  let infoWindow = new google.maps.InfoWindow({
    content: content
  });

  google.maps.event.addListener(marker, "click", () => {
    infoWindow.open(this.map, marker);
  });
}

AddMapMarkers(e) {
  // clear markers when they are deleted from menu
  for (var i = 0; i < gmarkers.length; i++) gmarkers[i].setMap(null);
  for (var i = 0; i < gmarkers2.length; i++) gmarkers2[i].setMap(null);
  for (var i = 0; i < gmarkers3.length; i++) gmarkers3[i].setMap(null);
  for (var i = 0; i < gmarkers4.length; i++) gmarkers4[i].setMap(null);
  for (var i = 0; i < gmarkers5.length; i++) gmarkers5[i].setMap(null);
  for (var i = 0; i < gmarkers6.length; i++) gmarkers6[i].setMap(null);
  for (var i = 0; i < gmarkers7.length; i++) gmarkers7[i].setMap(null);
  for (var i = 0; i < gmarkers8.length; i++) gmarkers8[i].setMap(null);
  for (var i = 0; i < gmarkers9.length; i++) gmarkers9[i].setMap(null);
 
  // call methods to show markers when they are selected in menu (in the html file we use numbers, stored in array e, to distinguish which markers the user would like displayed)
  for (var i = 0; i < e.length; i++) {
    if (e[i] == 1) {
      this.AddHospitals();
    }
    if (e[i] == 2) {
      this.AddTele();
    }
    if (e[i] == 3) {
      this.AddtPA();
    }
    if (e[i] == 4) {
      this.AddEVT();
    }
    if (e[i] == 5) {
      this.AddHealthService();
    }
    if (e[i] == 6) {
      this.AddHele();
    }
    if (e[i] == 7) {
      this.AddAirport();
    }
    if (e[i] == 8) {
      this.AddAmbBase();
    }
    if (e[i] == 9) {
      this.AddORNGE();
    }
  }
}


AddHospitals() {// add the hospital markers to the map with the specified icons this may need to change if i try to store them locally and synchronize with firebase 
  var items;
  var map = this.map;
  // add hospital markers
  // database initialization
  this.db.collection("/Health Centers/")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(function(doc) {
      
      // get hospital icon from website
      var icon = {
        url:
          "./assets/imgs/hospital.png",
        // define size to work with our UI
        scaledSize: new google.maps.Size(30, 30)
      };
      // get special icon for TBRHSC from website
      var icon2 = {
        url:
          "./assets/imgs/TBRHSC.png",
        scaledSize: new google.maps.Size(30, 30)
      };

        // selects data values with have certain attributes
        // in this case, if the location is a hospital (bHospital == true) and if the location is not a regional stroke centre (bRegionalStrokeCentre == false) then it is selected
        // see the Firebase database for corresponding data values and attributes
        if (
          doc.data().bHospital == true &&
          doc.data().bRegionalStrokeCentre == false&&
          doc.data().bTelestroke==false
        ) {
          // marker is displayed with properties
          let marker1 = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: { lat: doc.data().lat, lng: doc.data().lng },
            icon: icon
          });
          // add information for window when location is clicked on
          let content =
            "<b>Name:</b> " +
            doc.data().name +
            "<br>" +
            "<b>Address:</b> " +
            doc.data().address;
            
              let infoWindow = new google.maps.InfoWindow({
                content: content
              });
            
              google.maps.event.addListener(marker1, "click", () => {
                infoWindow.open(map, marker1);
              });
            
          // push information to array so that it can be cleared easily
          gmarkers.push(marker1);
        } 
        // special case for TBRHSC
       /* else if (doc.data().bRegionalStrokeCentre == true) {
          let markerTB = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: { lat: doc.data().lat, lng: doc.data().lng },
            icon: icon2
          });

          let content =
            "<b>Name:</b> " +
            doc.data().name +
            "<br>" +
            "<b>Address:</b> " +
            doc.data().address;

              let infoWindow = new google.maps.InfoWindow({
                content: content
              });
            
              google.maps.event.addListener(markerTB, "click", () => {
                infoWindow.open(map, markerTB);
              });
            

          gmarkers.push(markerTB);
        }*/
     
    });
    this.items = items;
    
  });
  
}

AddTele() {
  var items;
  var map = this.map;
  //add telestroke location markers
  this.db.collection("/Health Centers/")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(function(doc) {

      var icon = {
        url: "./assets/imgs/telestroke.png",
        scaledSize: new google.maps.Size(25, 25)
      };

        if (doc.data().bTelestroke == true&&doc.data().bRegionalStrokeCentre==false) {
          let marker2 = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: { lat: doc.data().lat, lng: doc.data().lng },
            icon: icon
          });

          let content =
            "<b>Name:</b> " +
            doc.data().name +
            "<br>" +
            "<b>Address:</b> " +
            doc.data().address;

            let infoWindow = new google.maps.InfoWindow({
              content: content
            });
          
            google.maps.event.addListener(marker2, "click", () => {
              infoWindow.open(map, marker2);
            });

          gmarkers2.push(marker2);
        }
      
    });
    this.items = items;
  });
}

AddtPA(){
  var items;
  var map = this.map;
  //add health service markers
  this.db.collection("/Health Centers/")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(function(doc) {

      var icon = {
        url: "./assets/imgs/tPA.png",
        scaledSize: new google.maps.Size(25, 25)
      };

        if (
          doc.data().bTelestroke == true
          
        ) {
          let marker3 = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: { lat: doc.data().lat, lng: doc.data().lng },
            icon: icon
          });

          let content =
            "<b>Name:</b> " +
            doc.data().name +
            "<br>" +
            "<b>Address:</b> " +
            doc.data().address;

            let infoWindow = new google.maps.InfoWindow({
              content: content
            });
          
            google.maps.event.addListener(marker3, "click", () => {
              infoWindow.open(map, marker3);
            });

          gmarkers3.push(marker3);
        }
      
    });
    this.items = items;
  });
}

AddEVT()
{
  var items;
  var map = this.map;
  //add health service markers
  this.db.collection("/Health Centers/")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(function(doc) {

      var icon = {
        url: "./assets/imgs/EVT.png",
        scaledSize: new google.maps.Size(25, 25)
      };

        if (
          doc.data().bRegionalStrokeCentre == true 
        ) {
          let marker4 = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: { lat: doc.data().lat, lng: doc.data().lng },
            icon: icon
          });

          let content =
            "<b>Name:</b> " +
            doc.data().name +
            "<br>" +
            "<b>Address:</b> " +
            doc.data().address;

            let infoWindow = new google.maps.InfoWindow({
              content: content
            });
          
            google.maps.event.addListener(marker4, "click", () => {
              infoWindow.open(map, marker4);
            });

          gmarkers4.push(marker4);
        }
      
    });
    this.items = items;
  });
}

AddHealthService() {
  var items;
  var map = this.map;
  //add health service markers
  this.db.collection("/Health Centers/")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(function(doc) {

      var icon = {
        url: "./assets/imgs/healthservices.png",
        scaledSize: new google.maps.Size(25, 25)
      };

        if (
          doc.data().bHealthServices == true &&
          doc.data().bTelestroke == false &&
          doc.data().bHospital == false&&
          doc.data().bRegionalStrokeCentre==false
        ) {
          let marker5 = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: { lat: doc.data().lat, lng: doc.data().lng },
            icon: icon
          });

          let content =
            "<b>Name:</b> " +
            doc.data().name +
            "<br>" +
            "<b>Address:</b> " +
            doc.data().address;

            let infoWindow = new google.maps.InfoWindow({
              content: content
            });
          
            google.maps.event.addListener(marker5, "click", () => {
              infoWindow.open(map, marker5);
            });

          gmarkers5.push(marker5);
        }
      
    });
    this.items = items;
  });
}

AddHele() {
  var items;
  var map = this.map;
  //add helipad markers
  this.db.collection("/Landing Sites/")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(function(doc) {

      var icon = {
        url:
          "./assets/imgs/helipad.png",
        scaledSize: new google.maps.Size(25, 25)
      };

        if (doc.data().type == "Helipad") {
          let marker6 = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: { lat: doc.data().lat, lng: doc.data().lng },
            icon: icon
          });

          let content =
            "<b>Site Name:</b> " +
            doc.data().siteName +
            "<br>" +
            "<b>Address:</b> " +
            doc.data().Address +
            "<br>" +
            "<b>Identifier:</b> " +
            doc.data().ident;

            let infoWindow = new google.maps.InfoWindow({
              content: content
            });
          
            google.maps.event.addListener(marker6, "click", () => {
              infoWindow.open(map, marker6);
            });

          gmarkers6.push(marker6);
        }
      
    });
    this.items = items;
  });
}

AddAirport() {
  var items;
  var map = this.map;
  //add airport markers
  this.db.collection("/Landing Sites/")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(function(doc) {

      var icon = {
        url:
          "./assets/imgs/airport.png",
        scaledSize: new google.maps.Size(25, 25)
      };

        if (doc.data().type == "Airport") {
          let marker7 = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: { lat: doc.data().lat, lng: doc.data().lng },
            icon: icon
          });

          let content =
            "<b>Site Name:</b> " +
            doc.data().siteName +
            "<br>" +
            "<b>Address:</b> " +
            doc.data().Address +
            "<br>" +
            "<b>Identifier:</b> " +
            doc.data().ident;

            let infoWindow = new google.maps.InfoWindow({
              content: content
            });
          
            google.maps.event.addListener(marker7, "click", () => {
              infoWindow.open(map, marker7);
            });

          gmarkers7.push(marker7);
        }
      
    });
    this.items = items;
  });
}

AddAmbBase() {
  var items;
  var map = this.map;
  //add ambulance base markers
  this.db.collection("/Ambulance Bases/")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(function(doc) {

      var icon = {
        url:
          "./assets/imgs/ambulance.png",
        scaledSize: new google.maps.Size(26, 20)
      };

        let marker8 = new google.maps.Marker({
          map: map,
          animation: google.maps.Animation.DROP,
          position: { lat: doc.data().lat, lng: doc.data().lng },
          icon: icon
        });

        let content =
          "<b>Site Name:</b> " +
          doc.data().SiteName +
          "<br>" +
          "<b>Address:</b> " +
          doc.data().Address +
          "<br>" +
          "<b>City:</b> " +
          doc.data().city;

          let infoWindow = new google.maps.InfoWindow({
            content: content
          });
        
          google.maps.event.addListener(marker8, "click", () => {
            infoWindow.open(map, marker8);
          });

        gmarkers8.push(marker8);
      
    });
    this.items = items;
  });
}

AddORNGE() {
  var items;
  var map = this.map;
  //add ORNGE location markers
  this.db.collection("/ORNGE Bases/")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(function(doc) {

      var icon = {
        url:
          "./assets/imgs/ornge.png",
        scaledSize: new google.maps.Size(25, 25)
      };

        let marker9 = new google.maps.Marker({
          map: map,
          animation: google.maps.Animation.DROP,
          position: { lat: doc.data().lat, lng: doc.data().lng },
          icon: icon
        });

        let content =
          "<b>Site Name:</b> " +
          doc.data().base_name +
          "<br>" +
          "<b>Address:</b> " +
          doc.data().Address +
          "<br>";

          let infoWindow = new google.maps.InfoWindow({
            content: content
          });
        
          google.maps.event.addListener(marker9, "click", () => {
            infoWindow.open(map, marker9);
          });

        gmarkers9.push(marker9);
      
    });
    this.items = items;
  });
}





}