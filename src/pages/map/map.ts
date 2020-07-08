import {Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { NavController } from "ionic-angular";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { DataServiceProvider } from '../../providers/data-service';
declare var google: any;//this was giving us some trouble because it kept saying that google is not defined 



// variable arrays for each marker (hospital, telestroke site, etc.), this way we can push the arrays to clear the markers when they are deselected in the UI
var gmarkers = [], gmarkers2 = [], gmarkers3 = [], gmarkers4 = [], gmarkers5 = [], gmarkers6 = [], gmarkers7 = [];

// variable array for pin that appears when the map is clicked, we can push to the array to clear it when a new location is clicked (this way we do not have multiple pins on the map)
var clicked_marker = [];





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
    location = {lat: null, lng: null};//at the start the location is set to null 
    markerOptions: any = {position: null, map: null, title: null};
    marker: any;
    db: any;
    items;
  constructor(public zone: NgZone, public geolocation: Geolocation, public navCtrl: NavController,
    public DataBase: AngularFireDatabase,
    public Data: DataServiceProvider) {
    /*load google map script dynamically */
      this.db = firebase.firestore();
      setTimeout(() => {// this initially threw an error unless we added a bit of a time buffer to allow it to continue 
        directionsService = new google.maps.DirectionsService();
        directionsDisplay = new google.maps.DirectionsRenderer();
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
            preserveViewport: true,
            zoom: 8
        });
        // if a route is calcualted, display it on the map
        directionsDisplay.setMap(this.map);
if(myPolyline!=undefined)// if it was a driving route it would throw an error because it would try to do this part but it now allows us to set a line
{
  myPolyline.setMap(this.map);// set a line on the map 
}
        


  if (bounds1.getNorthEast().equals(bounds1.getSouthWest())) {//bounds are the display parameter of the map and make sure it shows the whole route these are set further below 
    var extendPoint = new google.maps.LatLng(bounds1.getNorthEast().lat() + 0.01, bounds1.getNorthEast().lng() + 0.01);//an extra 0.01 is added so it zooms a bit more out to improve the look
    bounds1.extend(extendPoint);//extend the bounds to include the new point
  }
  var points = myPolyline.getPath().getArray();//goes along the line and makes sure that it fits inside of the bounds 
    for (var n = 0; n < points.length; n++){
        bounds1.extend(points[n]);
    }

  this.map.fitBounds(bounds1);
      }, 2);//this is the end of the interval so it will wait 2 micro or miliseconds before performing these actions 

  }

ionViewDidLoad(){
  myPolyline=new google.maps.Polyline();// declare all of the variables that will be used to get the directions and display them 
directionsService = new google.maps.DirectionsService();
directionsDisplay = new google.maps.DirectionsRenderer();
directionsDisplay1 =new google.maps.DirectionsRenderer();
if(this.Data.ComplexRoute==false)//if the route is not complex as we set if clicking a driving route we only need to worry about 
{
  if (this.Data.Destination == undefined && this.Data.Destination == undefined)// if there is nothing passed in throw an error message 
  {
    console.error("No Data Provided");
  }
  else//if there is data that has been passed in 
  {
    var originLatLng=new google.maps.LatLng(this.Data.lat,this.Data.lng);//set the origin and destination as google maps LatLng to be passed in to the remaining part 
    var destLatLng= new google.maps.LatLng(this.Data.Destination.lat,this.Data.Destination.lng);
    bounds1 = new google.maps.LatLngBounds();//create and set new bounds for the map to keep the whole route in frame
    bounds1.extend(originLatLng);
    bounds1.extend(destLatLng);
  directionsService.route(//use the directions service to get the directions from the origin to destination 
    {
      origin: originLatLng,
      destination: destLatLng,
      travelMode: "DRIVING"//the driving mode is driving but if needed we could add trafic and other variables to this request 
    },
    // retrieve Maps API response, if it is able to find a route
    (response, status, request) => {
      if (status === "OK") {
        // display the route on the defined map
        directionsDisplay.setOptions({//set the options for the route 
          draggable: false,//do not allow the route to be modified 
          map: this.map,//display it on the map we have on the page 
          preserveViewport: true,
          zoom: 8
        });
        directionsDisplay.setDirections(response);//set the directions on the directions display which will be added to the map 
      } else {
        // print error message if route cannot be found
        window.alert("Directions request failed due to " + status);
      }
      // push route into displayEnd array to be cleared on click of new marker
      displayEnd.push(directionsDisplay);//add the directions to the displayend which will show all of the directions 
    }
  );
  }
}
else if(this.Data.ComplexRoute==true)// if the complex route is true we need to show a line as well as two driving routes if they are in maps 
{
if(this.Data.Destination==undefined)// if nothing has been passed in throw an error 
{
  console.error("No Data has been passed In");
}
else{
  
  bounds1 = new google.maps.LatLngBounds();
  var StartClinc= new google.maps.LatLng(this.Data.lat,this.Data.lng);
  bounds1.extend(StartClinc);//have the bounds include all of the points 
  var FirstSite= new google.maps.LatLng(this.Data.Destination.origin.lat,this.Data.Destination.origin.lng);
  bounds1.extend(FirstSite);
  var firstlat=this.Data.Destination.origin.lat;//these lats and longs are used by the polyline function as the google ones did not seem to work
  var firstlng=this.Data.Destination.origin.lng;
  var secondlat=this.Data.Destination.desti.lat;
  var secondlng=this.Data.Destination.desti.lng;
  var SecondSite= new google.maps.LatLng(this.Data.Destination.desti.lat,this.Data.Destination.desti.lng);
  bounds1.extend(SecondSite);
  var EndHospital= new google.maps.LatLng(this.Data.Destination.closestSite.lat,this.Data.Destination.closestSite.lng);
  bounds1.extend(EndHospital);

 
  directionsService.route(//start the first route from the origin clinic to the closest helipad or airport 
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
      } else{
        this.addMarker(this.map,StartClinc,"A");// if there are no reusults as there are with sena memorial station this will place two markers with the labels provided 
        this.addMarker(this.map,FirstSite,"B");
      }

      // push route into displayEnd array to be cleared on click of new marker
      displayEnd.push(directionsDisplay);
      google.maps.event.addListener(//keeping this here in case we need to add anything to it later 
        directionsDisplay,
        "click",
        function() {}
      );
    }
  );

  var path2=[//load the information needed for the line into the path2 variable 
    {lat: firstlat, lng: firstlng},
    {lat: secondlat, lng: secondlng}
  ];
    myPolyline= new google.maps.Polyline({//create the polyline and display it on the map
    path: path2,
    geodesic: true,
    strokeColor: 'green',
    strokeOpacity: 1.0,
    strokeWeight: 3,
    map: this.map
 });

  directionsService.route(//create another route for the landing site to the end location 
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
 
  // call methods to show markers when they are selected in menu (in the html file we use numbers, stored in array e, to distinguish which markers the user would like displayed)
  for (var i = 0; i < e.length; i++) {
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


AddHospitals() {// add the hosital markers to the map with the specified icons this may need to change if i try to store them locally and syncronize with firebase 
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
  this.db.collection("/Ambulance Bases/")
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