//This is a provider it is regularly accessed by other pages and used to store and syncronize data 
//This particular provider is used to store a lot of information that other pages need to access and it is also used for the timer to count down the seconds 
import { Injectable } from '@angular/core';
import {Platform} from 'ionic-angular'
import { AngularFireDatabase } from '@angular/fire/database';
import firebase from 'firebase';

/*
  Generated class for the DataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataServiceProvider {
  db: any;
// this data is mostly used by the timer function and not really by the rest of the application 
  time: any;
  CurrentTime: any;
  LastKnownWellTime: any;
  intervalID:any;
  GivenHours: number;
  GivenMinutes:number;
  GivenTimeForm:number;
  CurrentHours:number;
  CurrentMinutes:number;
  CurrentTimeForm:number;
  HoursSince: any;
  MinutesSince:any;
  SecondsSince:any;
  SinceTimeForm:number;
  colour: any="#90ee90";
  TreatmentInfo: any;

  CurrentDate: any;
  GivenDate: any;

  //this data is used to store information on the weather and where the different locations are 
  StartLoc:any;

  city: any;
  lat: any;
  lng: any;
  origin_area: any;
  origin_weatherdata: { id: any, description: any, icon: any, tempreal: any, tempfeel: any }[];
  origin_tempreal: any;
  origin_tempfeel: any;
  origin_multiplier_area: any;
  origin_multiplier_weather: any;
  origin_id: any;
  origin_icon: any;

  destination_lat: any;
  destination_lng: any;
  destination_area: any;
  destination_weatherdata: { id: any, description: any, icon: any, tempreal: any, tempfeel: any }[];
  destination_tempreal: any;
  destination_tempfeel: any;
  destination_multiplier_area: any;
  destination_multiplier_weather: any;
  destination_id: any;
  destination_icon: any;
  
  area_temp: any;
  id_temp: any;
  destination_multiplier: number;

  location: any;
  NeedImaging:boolean;
  hadtPA:boolean;
  height:any;
  width: any;

Destination:any;
ComplexRoute:Boolean;

GivenTime:Boolean=false;// a test to see if the time has been given

AllMedicalCenters:any;// this is loaded when the app first initializes and gets all of the Medical Centeres so we do not need to search the Database as much 

//These Variables will be what time zone the person is in and the time zone the sending location is in 
UserTimeZone:any;
PatientTimeZone:any;

Plans:any; //This will store all of the plans in the database and should only be queried once 
ChosenPlan:any;//This will store the plan that has been selected for display 

TelestrokePlan: boolean=false;//This determines if the special 4A case is needed for the Telestroke site and will be set if imaging is required 

TimerTextColour:any;

  constructor(platform: Platform, public DataBase: AngularFireDatabase) {//the constructor finds the height and width of the current platform which may be used later on to get a better idea of how large to make each of the pages 
    platform.ready().then((readySource) => {
      console.log('Width: ' + platform.width());
      console.log('Height: ' + platform.height());
      this.height=platform.height();
      this.width=platform.width();
    });
    this.db=firebase.firestore();
  }

getPlans(){
  this.Plans= this.db.collection("/Plans")// gets all of the plans ahead of time so they will only be queried once and stored 
  .get()
  .then((planSnapshot)=>{
  var plans=[];
  planSnapshot.forEach(function(doc) {
    var obj=doc.data();
    plans[doc.id]=(obj);
  });
  this.Plans=plans;
  });
}

getCenters(){
  this.AllMedicalCenters= this.db.collection("/Health Centers/")//This would be better done somewhere else or done with syncronization through realtime database but this is how we have it now 
  .get()
  .then((querySnapshot) => {
    var total=[]
    querySnapshot.forEach(function(doc) {
        var obj = doc.data();
        total.push(obj);
      
    });
    this.AllMedicalCenters=total;// save the array of all abjects to the Data Service provider 
});
}

  StartTime(param,diff)//starts when a time is provided in last known well sets the time to be displayed at the top of pages after getting the current time 
  {
    var givendate: any= new Date(this.GivenDate.toString()+" "+param.toString());// creates a new date format we can use to calculate the difference in two dates and times 
    let DateDiff=(this.CurrentDate-givendate);// calculates the difference between the two dates which are the ones provided and given 
    let days=Math.abs(Math.floor((DateDiff / 86400000)));// get the date with no parts 
    let hours= Math.abs(Math.floor((DateDiff % 86400000)/3600000))+diff;// to get the hours that have passed 
    let minutes=Math.abs(Math.floor(((DateDiff % 86400000) % 3600000)/60000));// the minutes that have passed 
    hours+=(24*days);// convert the days that have passed to 24 hours 
    this.SecondsSince= new Date().getSeconds();
   /* console.log("Days",days);
    console.log("Hours",hours);
    console.log("Minutes",minutes);*/
   this.SinceTimeForm=ConvertToTimeForm(hours,minutes);
   let m=ConvertBack(this.SinceTimeForm+(1/60));

    this.HoursSince=m.hour;
    this.MinutesSince=(m.min);
    
      if(this.SinceTimeForm<4.5)// this sets the information for the first time so it is not blank until a second passes 
      {
        let EVTtime=6-this.SinceTimeForm;
        let EVT=ConvertBack(EVTtime);
        let TPAtime=4.5-this.SinceTimeForm;
        let TPA=ConvertBack(TPAtime);
          this.TimerTextColour="white";
          this.colour="#008742";
          this.TreatmentInfo="<ul>tPA Available for: <b>"+pad((TPA.hour),2)+":"+pad(((TPA.min)),2)+":"+pad((60-this.SecondsSince),2)+"<br></b>"+"EVT Avilable for: <b>"+pad((EVT.hour),2)+":"+pad(((EVT.min)),2)+":"+pad((60-this.SecondsSince),2)+"</b></ul>";//need to add in the actual time needed and check the format for wording and what is available take out the -1 if you want just the minutes 
      }
      else if(this.SinceTimeForm>=4.5&&this.SinceTimeForm<6)
      {
        let EVTtime=6-this.SinceTimeForm;
        let EVT=ConvertBack(EVTtime);
        this.TimerTextColour="white";
        this.colour="#ecb318";
        this.TreatmentInfo="<br><ul>EVT Avilable for: <b>"+pad((EVT.hour),2)+":"+pad((EVT.min),2)+":"+pad((60-this.SecondsSince),2)+"</ul>";//pad is a function we made to add zeros to the numbers if they are less than 10
      }
      else if(this.SinceTimeForm>=6)
      {
        this.TimerTextColour="white";
        this.colour="#d2232a";
        this.TreatmentInfo="<br><ul>Passed Treatment Window</ul>";
      }

    this.intervalID= setInterval(()=>{//set an interval to perform a calculation every second and update the values this one is the same as the last one but only after one second so we need the first one so there is no blank space 
        this.SecondsSince++;
        if(this.SecondsSince==60)//increment the count 
        {
          this.SecondsSince=0;
          this.SinceTimeForm+=(1/60);
          let m=ConvertBack(this.SinceTimeForm+(1/60));
         
          this.HoursSince=m.hour;
          this.MinutesSince=m.min;
        }
        
        
       // this is repeated because it updates every second but only after a second has passed so the first one is for that second
        if(this.SinceTimeForm<4.5)
        {
          let EVTtime=6-this.SinceTimeForm;
          let EVT=ConvertBack(EVTtime);
          let TPAtime=4.5-this.SinceTimeForm;
          let TPA=ConvertBack(TPAtime);
            this.TimerTextColour="white";
            this.colour="#008742";
            this.TreatmentInfo="<ul>tPA Available for: <b>"+pad((TPA.hour),2)+":"+pad(((TPA.min)),2)+":"+pad((60-this.SecondsSince),2)+"<br></b>"+"EVT Avilable for: <b>"+pad((EVT.hour),2)+":"+pad(((EVT.min)),2)+":"+pad((60-this.SecondsSince),2)+"</b></ul>";//need to add in the actual time needed and check the format for wording and what is available take out the -1 if you want just the minutes 
        }
        else if(this.SinceTimeForm>=4.5&&this.SinceTimeForm<6)
        {
          let EVTtime=6-this.SinceTimeForm;
          let EVT=ConvertBack(EVTtime);
          this.TimerTextColour="white";//This is now not useful because the background was changed but might as well keep it around 
            this.colour="#ecb318";
           this.TreatmentInfo="<br><ul>EVT Avilable for: <b>"+pad((EVT.hour),2)+":"+pad((EVT.min),2)+":"+pad((60-this.SecondsSince),2)+"</ul>";
        }
        else if(this.SinceTimeForm>=6)
        {
          this.TimerTextColour="white";
          this.colour="#d2232a";
          this.TreatmentInfo="<br><ul>Passed Treatment Window</ul>";
        }
      },1000);//this is one second as it is all measured in miliseconds 
    
    
  }

  

}
function pad(num:number, size:number): string {//turns the number into a string and adds a zero to keep it consistant 
  let s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}

function ConvertToTimeForm(hours:number,min:number):number{//converts the hours and minutes into a form that makes more sense as a whole number
  let m=hours;
  m=m+(min/60);
  return m;
}

function ConvertBack(TimeForm:number):any{//convert the number back from the whole number into hours and minutes for a better display 
  TimeForm=TimeForm-(1/60);
  let Hour=TimeForm/1;
  let Minute=TimeForm%1;
  Hour=Hour-Minute;
  Minute*=60;
  Minute=Math.round(Minute);
  if(Minute==60)//stops minutes going to 60 
  {
    Hour=Hour+1;
    Minute=0;
  }

  return{
    hour:Hour,
    min:Minute,
  };

}