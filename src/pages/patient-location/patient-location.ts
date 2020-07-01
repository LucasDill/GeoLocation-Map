import { Component } from '@angular/core';
import { NavController, AlertController, Platform, App } from 'ionic-angular';
import { FormBuilder } from "@angular/forms"
import { ViewChild } from '@angular/core';
import { DataServiceProvider } from '../../providers/data-service';
import { MapsAPILoader } from '@agm/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { HttpClient} from "@angular/common/http";
import "firebase/auth";
import "firebase/firestore"; 

import { ImagingPage } from '../imaging/imaging';
import { ImagingRequiredPage } from '../imaging-required/imaging-required';


import { WeatherService } from './weather';
import { RoutingProvider } from '../../providers/routing';
import { CityPage } from '../city/city';
import { LastKnownWellPage } from '../last-known-well/last-known-well';

@Component({
  selector: 'page-patient-location',
  templateUrl: 'patient-location.html'
})
export class PatientLocationPage {
 
  @ViewChild("search")
  
  next: number;
  
  Alerts:any;

  constructor(private httpClient: HttpClient,public navCtrl: NavController, private mapsAPILoader: MapsAPILoader,
     public formBuilder: FormBuilder,public Data: DataServiceProvider,
    public DataBase: AngularFireDatabase,
    private weatherService: WeatherService,public Routes: RoutingProvider, public alertController: AlertController, public platform: Platform, public app: App) {
  }

  ionViewDidLoad() {

    //set current position used for testing the use my location functionality 
    //this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load()
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
    this.weatherService.getWeatherFromApi(this.Data.lat, this.Data.lng).subscribe(weather => {
    this.weather = weather;
    //console.log(weather);// Used this to look at the weather Data //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.id = this.weather.weather[0].id; //the weather id is used to find the multiplier for the time multiplier 
    this.description = this.weather.weather[0].description; //the description of the weather at the moment this value is not used 
    this.icon = this.weather.weather[0].icon;
    this.tempreal = this.weather.main.temp - 273.15; //the actual temperature and feel of the temperature in the area this is used for the display on the routing options
    this.tempfeel = this.weather.main.temp - 273.15; // the temperature is retunred in Kelven hence the -273.15
    this.Data.origin_weatherdata = [this.id, this.description, this.icon, this.tempreal, this.tempfeel]; //Set the custom array in the data provider with the weather data 
    // gets description of weather
    this.Data.origin_id = this.id; //Set specifics of the weather in the data provider used for finding the multipler and other parts 
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




  Medical_Centers;//This is what holds the data to be displayed on the start page 
 
  


  // gets key pressed (see HTML) and pushes it into array of pressed keys
  search($event) {
      let q = $event.target.value;//Get the value for what was searched 
     if(q.length>0)// if there is something there call the search function 
     {
      this.getResults(q);
     }
     else{//If ther is no results instead of displaying everything display no results 
       this.Medical_Centers=[]
     }
      
  }

getResults(search)// get the results of the search 
{
  let arr=[]//set the array and the Medical_Centers to nothing 
  this.Medical_Centers=[];
for(var i=0;i<this.Data.AllMedicalCenters.length;i++)//Go through all of the medical centers and check to see if there is a match 
{
  if(this.Data.AllMedicalCenters[i].name!=undefined)
  {
    if(search.toUpperCase()==this.Data.AllMedicalCenters[i].name.toUpperCase().substring(0,search.length))//make everything uppercase to search and make sure the name in the database is the same length 
    {
      arr.push(this.Data.AllMedicalCenters[i]);// if there is a match push to the array to be displayed 
    }
    else if(search.toUpperCase()==this.Data.AllMedicalCenters[i].city.toUpperCase().substring(0,search.length))//This one searches by the city 
    {
      arr.push(this.Data.AllMedicalCenters[i]);
    }
    else if(this.Data.AllMedicalCenters[i].AKA!=undefined)// if there is nothing else search through the also Known as Variables 
    {
      for(var j=0;j<this.Data.AllMedicalCenters[i].AKA.length;j++)
      {
        if(search.toUpperCase()==this.Data.AllMedicalCenters[i].AKA[j].toUpperCase().substring(0,search.length))
        {
          let temp=this.Data.AllMedicalCenters[i].name;// save the usual name temporarally 
          this.Data.AllMedicalCenters[i].name=this.Data.AllMedicalCenters[i].AKA[j];// set the name for the object as the also known as so it displays on the button
          this.Data.AllMedicalCenters[i].AKA[j]=temp;//Save the other name in the AKA 
          arr.push(this.Data.AllMedicalCenters[i]);// add it to the array 
        }
      }
    }
  }
  else{// if the name is not defined it will be a city site and we will have different functions 
    if(search.toUpperCase()==this.Data.AllMedicalCenters[i].city.toUpperCase().substring(0,search.length))//This one searches by the city 
    {
      arr.push(this.Data.AllMedicalCenters[i]);
    }
    else if(this.Data.AllMedicalCenters[i].AKA!=undefined)// if there is nothing else search through the also Known as Variables 
    {
      for(var j=0;j<this.Data.AllMedicalCenters[i].AKA.length;j++)
      {
        if(search.toUpperCase()==this.Data.AllMedicalCenters[i].AKA[j].toUpperCase().substring(0,search.length))
        {
          let temp=this.Data.AllMedicalCenters[i].city;// save the usual city temporarally 
          this.Data.AllMedicalCenters[i].city=this.Data.AllMedicalCenters[i].AKA[j];// set the name for the object as the also known as so it displays on the button
          this.Data.AllMedicalCenters[i].AKA[j]=temp;//Save the other name in the AKA 
          arr.push(this.Data.AllMedicalCenters[i]);// add it to the array 
        }
      }
    }
  }

}
this.Medical_Centers=arr;//make the display information the array 
}

  
goToCityPage(city)
{
  this.Data.StartLoc=city;
  this.navCtrl.push(CityPage);
}

  cityLocation;

  async getLatLng(name){
  //var cityLocation=new google.maps.LatLng(name.lat,name.lng);

  var Telestroke;
    
            if ( name.bTelestroke == true) {
              Telestroke=true;
              // write code here to go to next applicable page
              //console.log("YOU ARE AT A TELSTROKE CENTRE");//used to test and make sure it was recognizing the right thing 
            }
            else{
              // write code here to go to next applicable page
              Telestroke=false;
            //  console.log("YOU ARE NOT AT A TELESTROKE CENTRE");
              
            }
           
      
      // set variables to public versions of the variables
      // could not do this directly inside of query
      this.Data.StartLoc=name;
     // this.cityLocation = cityLocation;
      this.Data.lat = name.lat;
      this.Data.lng = name.lng;
      this.Data.city = name.city;
      this.Data.origin_area = name.area;
      var SendingTimeZone;
       
        var result;

        //await the call to the google api function which is stored in the weather.ts file it is a http request 
     (await this.weatherService.getTimeZone(name.lat.toString(), name.lng.toString())).subscribe(Results=>{
       result=Results;//When I was using just Result in the past it was giving me errors 
      let i=  waitforResults();
      async function waitforResults()
      {
        //console.log(result);/////////////////////////////////////////////////////////////////used to see what the google api result is may be usefull in the future 
        if (result==undefined||result.dstOffset==undefined||result.rawOffset==undefined)// if anything is undefined the results will loop untill they are filled 
        {
          console.log("Need to wait");
          setTimeout(this.waitforResults(),25);
        }
        else{
          var finalChange=(result.rawOffset+result.dstOffset)/3600;// convert to the UTC + or - format
          SendingTimeZone=finalChange;
       //   console.log(SendingTimeZone);////////////////////Show the time zone of the sending location 
          return finalChange;
        }
      }
     
      })//get the time zone based on the lat and long 
      

     let m= waitForTimeZone();

var page=this;
      function waitForTimeZone(){
        if(SendingTimeZone==undefined)// wait untill the sending time zone variable has been filled 
        {
          setTimeout(waitForTimeZone,50);
        }
        else{
          page.Data.PatientTimeZone=SendingTimeZone;// set the Sending time zone in the Data service we are using page as it did not know what this was 
          if(page.Data.UserTimeZone==SendingTimeZone)
     {
       console.log("They are in the same time Zone");
       if (Telestroke == true) {//if the center entered is a telestroke site go to the Imaging required page and if not go to the imaging routes page 
        page.navCtrl.push(ImagingRequiredPage);
      }
      else{
        page.navCtrl.push(ImagingPage);
      }
     } 
     else if(SendingTimeZone!=undefined){// if it is not the same time zone and not undefined call the popup and send in if the function is a telestroke site 
       page.TimeZonePopup(Telestroke);// call the popup again using page as there where issues using the this 
       
     }
        }
      }
      this.getWeather();// call the the getWeather function for the next screen 
    }

 
  

  async TimeZonePopup(Telestroke){// this function will create a popup that asks about the time zones 
    var difference=Math.abs(Math.abs(this.Data.PatientTimeZone)-Math.abs(this.Data.UserTimeZone));// find the total difference and add it to the time 
    let alert=this.alertController.create({
      title:"Different Time Zones",
      message: "The Site you have specifed is in a different time zone.\nDid you enter the last known well in your time zone or the time zone of the sending location?",
      buttons: [
        {
          text: "Sending Location",
          handler: () => {
           if((this.Data.HoursSince-difference)<0)// if the time would be negative 
           {
            this.WrongTime(); 
           }
           else{
            if(this.Data.UserTimeZone<this.Data.PatientTimeZone)
            {
             clearInterval(this.Data.intervalID);//stops the previous interval from running 
               this.Data.StartTime(this.Data.time,difference);// send the new time 
            }
            else{
             
             clearInterval(this.Data.intervalID);//stops the previous interval from running 
             this.Data.StartTime(this.Data.time,(-1)*difference);// send the new time 
            }
             if (Telestroke == true) {
               this.navCtrl.push(ImagingRequiredPage);
             }
             else {
               this.navCtrl.push(ImagingPage);
             }
           }
            
          }
        }, {
          text: "My Location",
          handler: () => {
            // enter the new time zone stuff here once we figure out what it is 
            if (Telestroke == true) {
              this.navCtrl.push(ImagingRequiredPage);
            }
            else {
              this.navCtrl.push(ImagingPage);
            }
          }
        }
      ]
    });
    await alert.present();
  }


  async WrongTime(){
    let alert =await this.alertController.create({
      title: 'Incorrect Time',
      message: "The time provided is incorrect with your time zone.\n Would you like to enter a new time?",
      buttons:[
        {
          text:"No"
          
          },
          {
            text:"Yes",
            handler: ()=>{
              this.navCtrl.push(LastKnownWellPage);
            }
          }
    ]

    });
    await alert.present();
  }
  
}

