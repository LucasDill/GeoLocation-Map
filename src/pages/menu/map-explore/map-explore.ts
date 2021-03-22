import {Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { MenuController, NavController } from "ionic-angular";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { DataServiceProvider } from '../../../providers/data-service';
import { AnyMxRecord } from 'dns';
import { MappingProvider } from '../../../providers/mapping';
declare var google: any;//this was giving us some trouble because it kept saying that google is not defined 



// variable arrays for each marker (hospital, telestroke site, etc.), this way we can push the arrays to clear the markers when they are deselected in the UI
var gmarkers = [], gmarkers2 = [], gmarkers3 = [], gmarkers4 = [], gmarkers5 = [], gmarkers6 = [], gmarkers7 = [], gmarkers8=[],gmarkers9=[];

// variable array for pin that appears when the map is clicked, we can push to the array to clear it when a new location is clicked (this way we do not have multiple pins on the map)
var clicked_marker = [];


function DeleteMarker()
{
  console.log("Here")
}


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
    @ViewChild('header') header: ElementRef;
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
    HideMap:any=false;
    SearchResults: any;
    Results:any;
    NoResults: any=false;
    counter: any=0;

    SearchMark:any=[];
    
  constructor(public zone: NgZone, public geolocation: Geolocation, public navCtrl: NavController,
    public DataBase: AngularFireDatabase,
    public Data: DataServiceProvider,
    private menu: MenuController,
    private Mapping: MappingProvider) {
    /*load google map script dynamically */
      this.db = firebase.firestore();
  }

SearchInput(event)//This function is called whenever something is put in the search bar and will do the search and return results
{
  //console.log("SearchResults: ",this.SearchResults)//get what is currently typed into the form to be searched for
  //console.log(this.Data.AllMedicalCenters)
  if(this.SearchResults=="")
  {
    this.HideMap=false;
  }
  else{
    this.HideMap=true;
    this.Results=this.Mapping.SearchCenters(this.SearchResults)
    if(this.Results.length==0)
    {
      this.NoResults=true;
    }
    else{
      this.NoResults=false;
    }
  }
  
  //this.Results=this.Data.AllMedicalCenters;
}

AddPlace(location)//this will eventually place the pin and recenter the map 
{
  this.HideMap=false;//show the map 
  //console.log(location.OnlyCity)
  this.SearchResults="";//?THIS will clear the text in the search bar but it may be better kept as it is.
  this.addMarker(this.map,location,location.city)//TODO need to look at more search options, removing the markers and setting info for the windows.  
}

//TODO This function adds a marker for the search at the moment Still need to look at removing the marker
addMarker(map: any,Location,GivenLabel:any) {// this function will place custom markers on the map at the specific lat and long and with the label provided
this.counter++;
  // variable to hold chosen imaging capable hospital location

let clickedm = new google.maps.Marker({
  position: { lat: Location.lat, lng: Location.lng },
  map: map,
  draggable: false,
  label: GivenLabel,
  animation: google.maps.Animation.DROP
});
this.SearchMark.push(clickedm);
// pushes marker to array (so that it can be cleared easily)
clicked_marker.push(clickedm);
this.map.setCenter({ lat: Location.lat, lng: Location.lng })//this will set the new center for the map to put you near the marker
this.addInfoWindow(clickedm,Location)
}

// add information window to show data from database for markers which are in the legend when they are clicked on 
addInfoWindow(marker, location) {
  var info;
  var infoWindow = new google.maps.InfoWindow({
    content: ""
  });
  if(location.OnlyCity==true)
  {
    info='<b>City:</b> '+location.city+'<br><br>';
  }
  else{
    info='<b>Name:</b> '+location.name+'<br>'+
    '<b>Address:</b> '+location.address+'<br><br>'; 
  }
  var button='<button style="color: black;border: solid black .5px;" id="'+marker.label+'">Remove</button>';
 
  google.maps.event.addListener(marker, "click", () => {
    infoWindow.setContent('<div style="text-align:center;">'+info+button+'</div>');//TODO this button may work but has trouble finding the function 
    infoWindow.open(this.map, marker);
    //! Maybe look at this https://stackoverflow.com/questions/41921126/google-map-marker-info-window-needs-to-remove-the-marker 
  });
  google.maps.event.addListenerOnce(infoWindow,'domready',()=>{//this will add a listener for the 
    document.getElementById(marker.label).addEventListener('click',()=>{
     for(var a=0;a<this.SearchMark.length;a++)
     {
       if(this.SearchMark[a].label===marker.label)
       {
         this.SearchMark[a].setMap(null);
       }
     }
    });
  });
  
}

deleteMarker(a)
{
  console.log("Actually here")
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



ionViewWillEnter(){//size the page when it is loaded 
  var he=this.Data.getHeight(this.header);//get the size of the header in pixels 
var mapheight=(this.Data.height-he).toString()+"px";//calculate the remaining space left on the page 
this.height=mapheight;//set the height of the map 
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
var icon = {
  url:
    "./assets/imgs/hospital.png",
  // define size to work with our UI
  scaledSize: new google.maps.Size(30, 30)
};

for(var i=0;i<this.Data.AllMedicalCenters.length;i++)
{
  if (
    this.Data.AllMedicalCenters[i].bHospital == true &&
    this.Data.AllMedicalCenters[i].bRegionalStrokeCentre == false&&
    this.Data.AllMedicalCenters[i].bTelestroke==false
  ) {
    // marker is displayed with properties
    let marker1 = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: { lat: this.Data.AllMedicalCenters[i].lat, lng: this.Data.AllMedicalCenters[i].lng },
      icon: icon
    });
    // add information for window when location is clicked on
    let content =
      "<b>Name:</b> " +
      this.Data.AllMedicalCenters[i].name +
      "<br>" +
      "<b>Address:</b> " +
      this.Data.AllMedicalCenters[i].address;
      
        let infoWindow = new google.maps.InfoWindow({
          content: content
        });
      
        google.maps.event.addListener(marker1, "click", () => {
          infoWindow.open(map, marker1);
        });
      
    // push information to array so that it can be cleared easily
    gmarkers.push(marker1);
}
        }   
    this.items = items;  
}

AddTele() {
  var items;
  var map = this.map;
  //add telestroke location markers
  
      var icon = {
        url: "./assets/imgs/telestroke.png",
        scaledSize: new google.maps.Size(25, 25)
      };
for(var o=0;o<this.Data.AllMedicalCenters.length;o++)
{
  if (this.Data.AllMedicalCenters[o].bTelestroke == true&&this.Data.AllMedicalCenters[o].bRegionalStrokeCentre==false) {
    let marker2 = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: { lat: this.Data.AllMedicalCenters[o].lat, lng: this.Data.AllMedicalCenters[o].lng },
      icon: icon
    });

    let content =
      "<b>Name:</b> " +
      this.Data.AllMedicalCenters[o].name +
      "<br>" +
      "<b>Address:</b> " +
      this.Data.AllMedicalCenters[o].address;

      let infoWindow = new google.maps.InfoWindow({
        content: content
      });
    
      google.maps.event.addListener(marker2, "click", () => {
        infoWindow.open(map, marker2);
      });

    gmarkers2.push(marker2);
}
        
}
    this.items = items;
}

AddtPA(){
  var items;
  var map = this.map;
  //add health service markers

      var icon = {
        url: "./assets/imgs/tPA.png",
        scaledSize: new google.maps.Size(25, 25)
      };
for(var e=0;e<this.Data.AllMedicalCenters.length;e++)
{


        if (
          this.Data.AllMedicalCenters[e].bTelestroke == true
          
        ) {
          let marker3 = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: { lat: this.Data.AllMedicalCenters[e].lat, lng:this.Data.AllMedicalCenters[e].lng },
            icon: icon
          });

          let content =
            "<b>Name:</b> " +
            this.Data.AllMedicalCenters[e].name +
            "<br>" +
            "<b>Address:</b> " +
            this.Data.AllMedicalCenters[e].address;

            let infoWindow = new google.maps.InfoWindow({
              content: content
            });
          
            google.maps.event.addListener(marker3, "click", () => {
              infoWindow.open(map, marker3);
            });

          gmarkers3.push(marker3);
        }
      
      }
    this.items = items;
 
}

AddEVT()
{
  var items;
  var map = this.map;
  //add health service markers

      var icon = {
        url: "./assets/imgs/EVT.png",
        scaledSize: new google.maps.Size(25, 25)
      };
for(var r=0;r<this.Data.AllMedicalCenters.length;r++){
        if (
          this.Data.AllMedicalCenters[r].bRegionalStrokeCentre == true 
        ) {
          let marker4 = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: { lat: this.Data.AllMedicalCenters[r].lat, lng: this.Data.AllMedicalCenters[r].lng },
            icon: icon
          });

          let content =
            "<b>Name:</b> " +
            this.Data.AllMedicalCenters[r].name +
            "<br>" +
            "<b>Address:</b> " +
            this.Data.AllMedicalCenters[r].address;

            let infoWindow = new google.maps.InfoWindow({
              content: content
            });
          
            google.maps.event.addListener(marker4, "click", () => {
              infoWindow.open(map, marker4);
            });

          gmarkers4.push(marker4);
        }
      
   
    this.items = items;
      }
}

AddHealthService() {
  var items;
  var map = this.map;
  //add health service markers

      var icon = {
        url: "./assets/imgs/healthservices.png",
        scaledSize: new google.maps.Size(25, 25)
      };
for(var t=0;t<this.Data.AllMedicalCenters.length;t++){

        if (
          this.Data.AllMedicalCenters[t].bHealthServices == true &&
          this.Data.AllMedicalCenters[t].bTelestroke == false &&
          this.Data.AllMedicalCenters[t].bHospital == false&&
          this.Data.AllMedicalCenters[t].bRegionalStrokeCentre==false
        ) {
          let marker5 = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: { lat: this.Data.AllMedicalCenters[t].lat, lng: this.Data.AllMedicalCenters[t].lng },
            icon: icon
          });

          let content =
            "<b>Name:</b> " +
            this.Data.AllMedicalCenters[t].name +
            "<br>" +
            "<b>Address:</b> " +
            this.Data.AllMedicalCenters[t].address;

            let infoWindow = new google.maps.InfoWindow({
              content: content
            });
          
            google.maps.event.addListener(marker5, "click", () => {
              infoWindow.open(map, marker5);
            });

          gmarkers5.push(marker5);
        }
}

    this.items = items;

}

AddHele() {
  var items;
  var map = this.map;
  //add helipad markers


      var icon = {
        url:
          "./assets/imgs/helipad.png",
        scaledSize: new google.maps.Size(25, 25)
      };
for(var g=0;g<this.Data.AllLandingSites.length;g++){
        if (this.Data.AllLandingSites[g].type == "Helipad") {
          let marker6 = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: { lat: this.Data.AllLandingSites[g].lat, lng: this.Data.AllLandingSites[g].lng },
            icon: icon
          });
          let content =
            "<b>Site Name:</b> " +
            this.Data.AllLandingSites[g].siteName +
            "<br>" +
            "<b>Address:</b> " +
            this.Data.AllLandingSites[g].Address +
            "<br>" +
            "<b>Identifier:</b> " +
            this.Data.AllLandingSites[g].ident+
            "<br>" +
            "<b>ID:</b> " +
            this.Data.AllLandingSites[g].id;
            let infoWindow = new google.maps.InfoWindow({
              content: content
            });
          
            google.maps.event.addListener(marker6, "click", () => {
              infoWindow.open(map, marker6);
            });

          gmarkers6.push(marker6);
        }
}

    this.items = items;
 
}

AddAirport() {
  var items;
  var map = this.map;
  //add airport markers


      var icon = {
        url:
          "./assets/imgs/airport.png",
        scaledSize: new google.maps.Size(25, 25)
      };
for(var f=0;f<this.Data.AllLandingSites.length;f++){
        if (this.Data.AllLandingSites[f].type == "Airport") {
          let marker7 = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: { lat: this.Data.AllLandingSites[f].lat, lng: this.Data.AllLandingSites[f].lng },
            icon: icon
          });

          let content =
            "<b>Site Name:</b> " +
            this.Data.AllLandingSites[f].siteName +
            "<br>" +
            "<b>Address:</b> " +
            this.Data.AllLandingSites[f].Address +
            "<br>" +
            "<b>Identifier:</b> " +
            this.Data.AllLandingSites[f].ident+
            "<br>" +
            "<b>ID:</b> " +
            this.Data.AllLandingSites[f].id;

            let infoWindow = new google.maps.InfoWindow({
              content: content
            });
          
            google.maps.event.addListener(marker7, "click", () => {
              infoWindow.open(map, marker7);
            });

          gmarkers7.push(marker7);
        }
}
  
    this.items = items;
}

AddAmbBase() {
  var items;
  var map = this.map;
  //add ambulance base markers
  
      var icon = {
        url:
          "./assets/imgs/ambulance.png",
        scaledSize: new google.maps.Size(25, 25)
      };
for(var a=0;a<this.Data.AllAmb_Bases.length;a++){
        let marker8 = new google.maps.Marker({
          map: map,
          animation: google.maps.Animation.DROP,
          position: { lat: this.Data.AllAmb_Bases[a].lat, lng: this.Data.AllAmb_Bases[a].lng },
          icon: icon
        });

        let content =
          "<b>Site Name:</b> " +
          this.Data.AllAmb_Bases[a].SiteName +
          "<br>" +
          "<b>Address:</b> " +
          this.Data.AllAmb_Bases[a].Address +
          "<br>" +
          "<b>City:</b> " +
          this.Data.AllAmb_Bases[a].city;

          let infoWindow = new google.maps.InfoWindow({
            content: content
          });
        
          google.maps.event.addListener(marker8, "click", () => {
            infoWindow.open(map, marker8);
          });

        gmarkers8.push(marker8);
        }
    this.items = items;
}

AddORNGE() {
  var items;
  var map = this.map;
  //add ORNGE location markers
 

      var icon = {
        url:
          "./assets/imgs/ornge.png",
        scaledSize: new google.maps.Size(25, 25)
      };
for(var t=0;t<this.Data.AllORNGE.length;t++)
{

        let marker9 = new google.maps.Marker({
          map: map,
          animation: google.maps.Animation.DROP,
          position: { lat: this.Data.AllORNGE[t].lat, lng: this.Data.AllORNGE[t].lng },
          icon: icon
        });

        let content =
          "<b>Site Name:</b> " +
          this.Data.AllORNGE[t].base_name +
          "<br>" +
          "<b>Address:</b> " +
          this.Data.AllORNGE[t].Address +
          "<br>";

          let infoWindow = new google.maps.InfoWindow({
            content: content
          });
        
          google.maps.event.addListener(marker9, "click", () => {
            infoWindow.open(map, marker9);
          });

        gmarkers9.push(marker9);
        }
 
    this.items = items;

}





}