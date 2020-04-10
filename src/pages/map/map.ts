import {Component, ElementRef, NgZone, ViewChild, asNativeElements} from '@angular/core';
import { IonicPage } from "ionic-angular";
import { NavController } from "ionic-angular";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { Platform } from 'ionic-angular';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { DataServiceProvider } from '../../providers/data-service';
import { getOrCreateTemplateRef } from '@angular/core/src/render3/di';
import { FitBoundsAccessor } from '@agm/core';
declare var google: any;


let data: Array<Provider>;
interface Provider {
  lat: any;
  lng: any;
  bHospital: any;
  name: any;
}
let routes: Array<routecalc> = [];
interface routecalc {
  start: any;
  end: any;
  distance: any;
  time: any;
  name: any;
}
// variable arrays for each marker (hospital, telestroke site, etc.), this way we can push the arrays to clear the markers when they are deselected in the UI
var gmarkers = [], gmarkers2 = [], gmarkers3 = [], gmarkers4 = [], gmarkers5 = [], gmarkers6 = [], gmarkers7 = [];

// variable array for pin that appears when the map is clicked, we can push to the array to clear it when a new location is clicked (this way we do not have multiple pins on the map)
var clicked_marker = [];

// variable to hold the location of the clicked pin globally so that it can be accessed in all methods
var start;

// variable to hold the destination location (as determined by querying the database)
var chosen_location;

// array to hold directionsDisplay information so that we can push the array and show only one route on the map at one time
var displayEnd = [];

var directionsService;
var directionsDisplay;
var directionsDisplay1;
var myPolyline;
var bounds1;

// loads the page
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})

export class MapPage {
  // define variable to hold information from Firebase database
  public hospital: AngularFireList<any>;
  // makes Google Maps API visible
    @ViewChild('Map') mapElement: ElementRef;
    map: any;
    mapOptions: any;
    location = {lat: null, lng: null};
    markerOptions: any = {position: null, map: null, title: null};
    marker: any;
    db: any;
  constructor(public zone: NgZone, public geolocation: Geolocation, public navCtrl: NavController,
    public DataBase: AngularFireDatabase,
    public Data: DataServiceProvider) {
    /*load google map script dynamically */
      this.db = firebase.firestore();
      console.log(bounds1);
      setTimeout(() => {
        directionsService = new google.maps.DirectionsService();
        directionsDisplay = new google.maps.DirectionsRenderer();
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
            preserveViewport: true,
            zoom: 8
        });
        // if a pin is placed, display it on the map
        this.addMarker(this.map);
        // if a route is calcualted, display it on the map
        directionsDisplay.setMap(this.map);
if(myPolyline!=undefined)
{
  myPolyline.setMap(this.map);// set a line on the map 
}
        


  if (bounds1.getNorthEast().equals(bounds1.getSouthWest())) {
    var extendPoint = new google.maps.LatLng(bounds1.getNorthEast().lat() + 0.01, bounds1.getNorthEast().lng() + 0.01);
    bounds1.extend(extendPoint);
  }
  var points = myPolyline.getPath().getArray();
    for (var n = 0; n < points.length; n++){
        bounds1.extend(points[n]);
        console.log(points[n])
    }

  //this.map.fitBounds([this.Data.StartClinic, this.Data.FirstSite, this.Data.SecondSite, this.Data.EndHospital]);
  this.map.fitBounds(bounds1);

       


      }, 2);

  

    // load Medical Centres into hospital variable to be accessed later with a more convenient name
    this.hospital = DataBase.list("/Medical_Centers");
    // call data loading functions
    this.getDataFromFirebase();
    this.getData();
  }

// variable to store database information when it is loaded from Firebase
items;

// load data from Firebase, valueChanges and subscribe are used to get data as it is changed in Firebase in realtime
getDataFromFirebase() {
  this.DataBase.list("/Medical_Centers/")
    .valueChanges()
    .subscribe(data => {
      this.items = data;
    });
}

ionViewDidLoad(){
  myPolyline=new google.maps.Polyline();
console.log(this.Data.Destination, this.Data.Destination)
directionsService = new google.maps.DirectionsService();
directionsDisplay = new google.maps.DirectionsRenderer();
directionsDisplay1 =new google.maps.DirectionsRenderer();
if(this.Data.ComplexRoute==false)
{
  console.log("Was False");
  if (this.Data.Destination == undefined && this.Data.Destination == undefined)
  {
    console.error("No Data Provided");
  }
  else
  {
    console.log(this.Data.lat, this.Data.lng)
    console.log(this.Data.Destination.lat, this.Data.Destination.lng)
    var originLatLng=new google.maps.LatLng(this.Data.lat,this.Data.lng);
    var destLatLng= new google.maps.LatLng(this.Data.Destination.lat,this.Data.Destination.lng);
    bounds1 = new google.maps.LatLngBounds();
    bounds1.extend(originLatLng);
    bounds1.extend(destLatLng);
  directionsService.route(
    {
      origin: originLatLng,
      destination: destLatLng,
      travelMode: "DRIVING"
    },
    // retrieve Maps API response, if it is able to find a route
    (response, status, request) => {
      if (status === "OK") {
        // display the route on the defined map
        console.log("status was ok")
        directionsDisplay.setOptions({
          draggable: false,
          map: this.map,
          preserveViewport: true,
          zoom: 8
        });
        // load the route to calculate its distance and time
        directionsDisplay.setDirections(response);
      } else {
        // print error message if route cannot be found
        window.alert("Directions request failed due to " + status);
      }
      // push route into displayEnd array to be cleared on click of new marker
      displayEnd.push(directionsDisplay);
      google.maps.event.addListener(
        directionsDisplay,
        "click",
        function() {}
      );
    }
  );
  }
}
else if(this.Data.ComplexRoute==true)
{
if(this.Data.Destination==undefined)
{
  console.error("No Data has been passed In");
}
else{
  console.log(this.Data.Destination);
  bounds1 = new google.maps.LatLngBounds();
  var StartClinc= new google.maps.LatLng(this.Data.lat,this.Data.lng);
  bounds1.extend(StartClinc);
  var FirstSite= new google.maps.LatLng(this.Data.Destination.origin.lat,this.Data.Destination.origin.lng);
  bounds1.extend(FirstSite);
  var firstlat=this.Data.Destination.origin.lat;
  var firstlng=this.Data.Destination.origin.lng;
  var secondlat=this.Data.Destination.desti.lat;
  var secondlng=this.Data.Destination.desti.lng;
  var SecondSite= new google.maps.LatLng(this.Data.Destination.desti.lat,this.Data.Destination.desti.lng);
  bounds1.extend(SecondSite);
  var EndHospital= new google.maps.LatLng(this.Data.Destination.closestSite.lat,this.Data.Destination.closestSite.lng);
  bounds1.extend(EndHospital);

  this.Data.StartClinic = [this.Data.lat,this.Data.lng];
  this.Data.FirstSite = [this.Data.Destination.origin.lat,this.Data.Destination.origin.lng];
  this.Data.SecondSite = [this.Data.Destination.desti.lat,this.Data.Destination.desti.lng];
  this.Data.EndHospital = [this.Data.Destination.closestSite.lat,this.Data.Destination.closestSite.lng];
  console.log(this.Data.StartClinic)
 
  directionsService.route(
    {
      origin: StartClinc,
      destination: FirstSite,
      travelMode: "DRIVING"
    },
    // retrieve Maps API response, if it is able to find a route
    (response, status, request) => {
      if (status === "OK") {
        // display the route on the defined map
        directionsDisplay.setOptions({
          draggable: false,
          map: this.map,
          preserveViewport: true,
          zoom: 8
        });
        // load the route to calculate its distance and time
        directionsDisplay.setDirections(response);
      } else {
        // print error message if route cannot be found



        /////////////////////// create airport polyline mapping here


        /*var cant_drive_to_airport=[
          StartClinc,
          FirstSite
        ];
          myPolyline= new google.maps.Polyline({
          path: cant_drive_to_airport,
          geodesic: true,
          strokeColor: 'green',
          strokeOpacity: 1.0,
          strokeWeight: 3,
          map: this.map
       });
       myPolyline.setMap(this.map);*/


        
        //window.alert("Directions request failed due to " + status);
      }
      // push route into displayEnd array to be cleared on click of new marker
      displayEnd.push(directionsDisplay);
      google.maps.event.addListener(
        directionsDisplay,
        "click",
        function() {}
      );
    }
  );

  var path2=[
    {lat: firstlat, lng: firstlng},
    {lat: secondlat, lng: secondlng}
  ];
    myPolyline= new google.maps.Polyline({
    path: path2,
    geodesic: true,
    strokeColor: 'green',
    strokeOpacity: 1.0,
    strokeWeight: 3,
    map: this.map
 });
 //myPolyline.setMap(this.map);
  directionsService.route(
    {
      origin: SecondSite,
      destination: EndHospital,
      travelMode: "DRIVING"
    },
    // retrieve Maps API response, if it is able to find a route
    (response, status, request) => {
      if (status === "OK") {
        // display the route on the defined map
        directionsDisplay1.setOptions({
          draggable: false,
          map: this.map,
          preserveViewport: true,
          zoom: 8
        });
        // load the route to calculate its distance and time
        directionsDisplay1.setDirections(response);
      } else {
        // print error message if route cannot be found
        window.alert("Directions request failed due to " + status);
      }
      // push route into displayEnd array to be cleared on click of new marker
      displayEnd.push(directionsDisplay1);
      google.maps.event.addListener(
        directionsDisplay,
        "click",
        function() {}
      );
    }
    
  );
}


console.log(bounds1);
}

 



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



ionViewWillLeave()
{
    // clears the end location for the displayed route when the page is closed
    chosen_location = null;
}


addEndLocation(name) {
  console.log(name);
  // for loop to load in locations from imaging capable hospials that are clicked on, we can push to the array to clear previously stored distances and times
  for (var i = 0; i < displayEnd.length; i++) {
      displayEnd[i].setMap(null);
    }
  this.DataBase.list("/Medical_Centers/")
    .valueChanges()
    .subscribe(
      data => {
        this.items = data;
        // for loop to iterate through data array which retrieves latitude and longitude of chosen imaging capable hospital location (see first if statement)
        for (var i = 0; i < data.length; i++) {
          if ((<any>data[i]).name == name) {
            chosen_location = new google.maps.LatLng(
              (<any>data[i]).lat,
              (<any>data[i]).lng
            );
            // uses Maps API to define a route from the origin to destination locations (start and chosen_location) by driving
            directionsService.route(
              {
                origin: start,
                destination: chosen_location,
                travelMode: "DRIVING"
              },
              // retrieve Maps API response, if it is able to find a route
              (response, status, request) => {
                if (status === "OK") {
                  // display the route on the defined map
                  directionsDisplay.setOptions({
                    draggable: false,
                    map: this.map,
                    preserveViewport: true,
                    zoom: 8
                  });
                  // load the route to calculate its distance and time
                  directionsDisplay.setDirections(response);
                } else {
                  // print error message if route cannot be found
                  window.alert("Directions request failed due to " + status);
                }
                // push route into displayEnd array to be cleared on click of new marker
                displayEnd.push(directionsDisplay);
                google.maps.event.addListener(
                  directionsDisplay,
                  "click",
                  function() {}
                );
              }
            );
          }
        }
      }
    );
}


addMarker(map: any) {
// variables to hold the locations of the 5 imaging capable hospitals
  var end1 = new google.maps.LatLng(48.424818, -89.270847);
  var end2 = new google.maps.LatLng(49.770121, -92.838622);
  var end3 = new google.maps.LatLng(48.60634, -93.392308);
  var end4 = new google.maps.LatLng(49.768015, -94.499514);
  var end5 = new google.maps.LatLng(50.105711, -91.927465);

  // variable to hold chosen imaging capable hospital location
  var end;
  // variables to reference when loading DirectionsService/Renderer
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();
var chosen_lat = this.Data.lat;
var chosen_lng = this.Data.lng;
//var myLatLng = this.Data.location;

  var myLatLng = new google.maps.LatLng(
    chosen_lat,
    chosen_lng
  );


console.log(myLatLng);
let clickedm = new google.maps.Marker({
  position: myLatLng,
  map: map,
  draggable: false
});
// pushes marker to array (so that it can be cleared easily)
clicked_marker.push(clickedm);

setRoutes(myLatLng, map);

  function setRoutes(position, map) {
    // for loop to clear map of markers when a new one is placed
    /*for (var i = 0; i < clicked_marker.length; i++)
      clicked_marker[i].setMap(null);*/

    // get coordinates of clicked marker to be printed when marker is clicked
    markerCoords(clickedm);
    // load coordinates of chosen location to global start variable
    /*start = new google.maps.LatLng(
      clickedm.position.lat(),
      clickedm.position.lng()
    );*/
    start = myLatLng;
    console.log("start" + start);
    // equate end to chosen_location
    end = chosen_location;

    if (end == null) {
      // if end location has not yet been chosen, calculate possible routes without displaying a route
      //calculateAllRoutes(start);
    } else {
      // if end location has been chosen, calculate and display that specific route
     // calculateAndDisplayRoute(start, end);
    }
  }

  function markerCoords(markerobject) {
    // define information window to hold marker coordinates
    let infoWindow = new google.maps.InfoWindow({});
    // open window on marker click
    google.maps.event.addListener(markerobject, "click", () => {
        infoWindow.open(map, markerobject);
      });
    // load and print coordinates to marker information window
    google.maps.event.addListener(markerobject, "click", function(evt) {
      infoWindow.setOptions({
        content:
          "<p>Latitude: " +
          evt.latLng.lat().toFixed(3) +
          "<br>Longitude: " +
          evt.latLng.lng().toFixed(3) +
          "</p>"
      });
    });
    // update coordinates when marker is dragged to a new location
    google.maps.event.addListener(markerobject, "dragend", function(evt) {
      infoWindow.setOptions({
        content:
          "<p>Latitude: " +
          evt.latLng.lat().toFixed(3) +
          "<br>Longitude: " +
          evt.latLng.lng().toFixed(3) +
          "</p>"
      });
      // open window on click
      google.maps.event.addListener(markerobject, "click", () => {
        infoWindow.open(map, markerobject);
      });

      // define new start location based on where the marker was dragged to
      start = new google.maps.LatLng(evt.latLng.lat(), evt.latLng.lng());
      // ensure end location is properly set
      end = chosen_location;
      if (end == null) {
        // if end location has not yet been chosen, calculate possible routes without displaying a route
     // calculateAllRoutes(start);
    } else {
      // if end location has been chosen, calculate and display that specific route
       // calculateAndDisplayRoute(start, end);
      }
    });
    // marker drag functionality
    google.maps.event.addListener(markerobject, "drag", function(evt) {
    });
  }

  function clearEnd() {
    // clear the displayed routes by retrieving them from array and setting the map to null
    for (var i = 0; i < displayEnd.length; i++) {
      displayEnd[i].setMap(null);
    }
  }

  /*function calculateAndDisplayRoute(start, end) {
    // clear previously displayed route
    clearEnd();
    // create array of routes which holds information of each route
    var routes: Array<routecalc>;
    interface routecalc {
      start: any;
      end: any;
      distance: any;
      time: any;
    }
    // set array to empty
    routes = [];
    

    // TBRHSC
    directionsService.route(
      {
        origin: start,
        destination: end1,
        travelMode: "DRIVING"
      },
      (response, status, request) => {
        if (status === "OK") {
          var dist = response.routes[0].legs[0].distance.text;
          var time = response.routes[0].legs[0].duration.text;
        } else {
          window.alert("Directions request failed due to " + status);
        }
        displayEnd.push(directionsDisplay);
                google.maps.event.addListener(
                  directionsDisplay,
                  "click",
                  function() {}
                );
      }
    );

    // Dryden
    directionsService.route(
      {
        origin: start,
        destination: end2,
        travelMode: "DRIVING"
      },
      (response, status, request) => {
        if (status === "OK") {
          var dist = response.routes[0].legs[0].distance.text;
          var time = response.routes[0].legs[0].duration.text;
        } else {
          window.alert("Directions request failed due to " + status);
        }
        displayEnd.push(directionsDisplay);
                google.maps.event.addListener(
                  directionsDisplay,
                  "click",
                  function() {}
                );
      }
    );

    // Fort Frances
    directionsService.route(
      {
        origin: start,
        destination: end3,
        travelMode: "DRIVING"
      },
      (response, status, request) => {
        if (status === "OK") {
          var dist = response.routes[0].legs[0].distance.text;
          var time = response.routes[0].legs[0].duration.text;
        } else {
          window.alert("Directions request failed due to " + status);
        }
        displayEnd.push(directionsDisplay);
                google.maps.event.addListener(
                  directionsDisplay,
                  "click",
                  function() {}
                );
      }
    );

    // Kenora
    directionsService.route(
      {
        origin: start,
        destination: end4,
        travelMode: "DRIVING"
      },
      (response, status, request) => {
        if (status === "OK") {
          var dist = response.routes[0].legs[0].distance.text;
          var time = response.routes[0].legs[0].duration.text;
        } else {
          window.alert("Directions request failed due to " + status);
        }
        displayEnd.push(directionsDisplay);
                google.maps.event.addListener(
                  directionsDisplay,
                  "click",
                  function() {}
                );
      }
    );

    // Sioux Lookout
    directionsService.route(
      {
        origin: start,
        destination: end5,
        travelMode: "DRIVING"
      },
      (response, status, request) => {
        if (status === "OK") {
          var dist = response.routes[0].legs[0].distance.text;
          var time = response.routes[0].legs[0].duration.text;
        } else {
          window.alert("Directions request failed due to " + status);
        }
        displayEnd.push(directionsDisplay);
                google.maps.event.addListener(
                  directionsDisplay,
                  "click",
                  function() {}
                );
      }
    );
  }

 /* function calculateAllRoutes(start) {
    clearEnd();
    routes.length = 0;
    routes = [];
    // TBRHSC
    directionsService.route(
      {
        origin: start,
        destination: end1,
        travelMode: "DRIVING"
      },
      (response, status, request) => {
        if (status === "OK") {
          var dist = response.routes[0].legs[0].distance.text;
          var time = response.routes[0].legs[0].duration.text;
          // load information into array with same properties as routecalc
          let putin = {} as routecalc;
          putin.start = start;
          putin.end = end1;
          putin.distance = dist;
          putin.time = time;
          putin.name = "TBRHSC";
          routes.push(putin);
          // display time and distance to each imaging capable hospital location
          document.getElementById("TBrad").innerHTML = "";
          document.getElementById("TBrad").innerHTML +=
            "<b>Time:</b>" + time + "        <b> Distance:</b>" + dist;
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );

    // Dryden
    directionsService.route(
      {
        origin: start,
        destination: end2,
        travelMode: "DRIVING"
      },
      (response, status, request) => {
        if (status === "OK") {
          var dist = response.routes[0].legs[0].distance.text;
          var time = response.routes[0].legs[0].duration.text;
          let putin = {} as routecalc;
          putin.start = start;
          putin.end = end2;
          putin.distance = dist;
          putin.time = time;
          putin.name = "Dryden";
          routes.push(putin);
          document.getElementById("Drad").innerHTML = "";
          document.getElementById("Drad").innerHTML +=
            "<b>Time:</b>" + time + "        <b> Distance:</b>" + dist;
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );

    // Fort Frances
    directionsService.route(
      {
        origin: start,
        destination: end3,
        travelMode: "DRIVING"
      },
      (response, status, request) => {
        if (status === "OK") {
          var dist = response.routes[0].legs[0].distance.text;
          var time = response.routes[0].legs[0].duration.text;
          let putin = {} as routecalc;
          putin.start = start;
          putin.end = end3;
          putin.distance = dist;
          putin.time = time;
          putin.name = "Fort Francis";
          routes.push(putin);
          document.getElementById("Frad").innerHTML = "";
          document.getElementById("Frad").innerHTML +=
            "<b>Time:</b>" + time + "        <b> Distance:</b>" + dist;
          console.log(routes);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );

    // Kenora
    directionsService.route(
      {
        origin: start,
        destination: end4,
        travelMode: "DRIVING"
      },
      (response, status, request) => {
        if (status === "OK") {
          var dist = response.routes[0].legs[0].distance.text;
          var time = response.routes[0].legs[0].duration.text;
          let putin = {} as routecalc;
          putin.start = start;
          putin.end = end4;
          putin.distance = dist;
          putin.time = time;
          putin.name = "Kenora";
          routes.push(putin);
          document.getElementById("Krad").innerHTML = "";
          document.getElementById("Krad").innerHTML +=
            "<b>Time:</b>" + time + "        <b> Distance:</b>" + dist;
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );

    // Sioux Lookout
    directionsService.route(
      {
        origin: start,
        destination: end5,
        travelMode: "DRIVING"
      },
      (response, status, request) => {
        if (status === "OK") {
          var dist = response.routes[0].legs[0].distance.text;
          var time = response.routes[0].legs[0].duration.text;
          let putin = {} as routecalc;
          putin.start = start;
          putin.end = end5;
          putin.distance = dist;
          putin.time = time;
          putin.name = "Sioux Lookout";
          routes.push(putin);
          document.getElementById("Srad").innerHTML = "";
          document.getElementById("Srad").innerHTML +=
            "<b>Time:</b>" + time + "        <b> Distance:</b>" + dist;
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
    console.log(routes.length);
  }*/
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
  // clear markers when they are delected from menu
  for (var i = 0; i < gmarkers.length; i++) gmarkers[i].setMap(null);
  for (var i = 0; i < gmarkers2.length; i++) gmarkers2[i].setMap(null);
  for (var i = 0; i < gmarkers3.length; i++) gmarkers3[i].setMap(null);
  for (var i = 0; i < gmarkers4.length; i++) gmarkers4[i].setMap(null);
  for (var i = 0; i < gmarkers5.length; i++) gmarkers5[i].setMap(null);
  for (var i = 0; i < gmarkers6.length; i++) gmarkers6[i].setMap(null);
  for (var i = 0; i < gmarkers7.length; i++) gmarkers7[i].setMap(null);
  console.log(e);
  // call methods to show markers when they are selected in menu (in the html file we use numbers, stored in array e, to distinguish which markers the user would like displayed)
  for (var i = 0; i < e.length; i++) {
    console.log("here");
    if (e[i] == 1) {
      this.AddHospitals();
    }
    if (e[i] == 2) {
      this.AddTele();
    }
    if (e[i] == 3) {
      this.AddHealthService();
    }
    if (e[i] == 4) {
      this.AddHele();
    }
    if (e[i] == 5) {
      this.AddAirport();
    }
    if (e[i] == 6) {
      this.AddAmbBase();
    }
    if (e[i] == 7) {
      this.AddORNGE();
    }
  }
}


AddHospitals() {
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
          doc.data().bRegionalStrokeCentre == false
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
        else if (doc.data().bRegionalStrokeCentre == true) {
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
        }
     
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

        if (doc.data().bTelestroke == true) {
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
          doc.data().bHospital == false
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

AddHele() {
  var items;
  var map = this.map;
  //add helepad markers
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
          let marker4 = new google.maps.Marker({
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
          
            google.maps.event.addListener(marker4, "click", () => {
              infoWindow.open(map, marker4);
            });

          gmarkers4.push(marker4);
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
          let marker5 = new google.maps.Marker({
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
          
            google.maps.event.addListener(marker5, "click", () => {
              infoWindow.open(map, marker5);
            });

          gmarkers5.push(marker5);
        }
      
    });
    this.items = items;
  });
}

AddAmbBase() {
  var items;
  var map = this.map;
  //add ambulance base markers
  this.db.collection("/Ambulance Sites/")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(function(doc) {

      var icon = {
        url:
          "./assets/imgs/ambulance.png",
        scaledSize: new google.maps.Size(26, 20)
      };

        let marker6 = new google.maps.Marker({
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
        
          google.maps.event.addListener(marker6, "click", () => {
            infoWindow.open(map, marker6);
          });

        gmarkers6.push(marker6);
      
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

        let marker7 = new google.maps.Marker({
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
        
          google.maps.event.addListener(marker7, "click", () => {
            infoWindow.open(map, marker7);
          });

        gmarkers7.push(marker7);
      
    });
    this.items = items;
  });
}





}