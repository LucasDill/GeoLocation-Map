import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnyTxtRecord } from 'dns';

/*
  Generated class for the DataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataServiceProvider {
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

  lat: any;
  lng: any;


  constructor() {
  }
  

  StartTime(param)//starts when a time is provided in last known well sets the time to be displayed at the top of pages after getting the current time 
  {
    this.LastKnownWellTime=param;
    var index =this.LastKnownWellTime.indexOf(":");// split the string into two parts to be used later
    this.GivenHours=parseInt(this.LastKnownWellTime.substr(0,index));
    this.GivenMinutes=parseInt(this.LastKnownWellTime.substr(index+1));
    this.GivenTimeForm=ConvertToTimeForm(this.GivenHours,this.GivenMinutes);
  console.log(this.GivenTimeForm);

    this.CurrentTime= new Date().getTime();//there may be an issue of time zones find the time in this area
    this.CurrentHours= new Date().getHours();
    this.CurrentMinutes= new Date().getMinutes();
    this.SecondsSince= new Date().getSeconds();
    this.CurrentTimeForm=ConvertToTimeForm(this.CurrentHours,this.CurrentMinutes);
    console.log(this.CurrentTimeForm);

    /*if(this.GivenHours>this.CurrentHours)//calculate the time that has passed since the patient was well if it is greater than it is a new day and a special case is needed
    {
      this.HoursSince=((24-this.GivenHours)+this.CurrentHours);
    }
    else if(this.GivenHours==this.CurrentHours)
    {
      if(this.GivenMinutes>this.CurrentMinutes)
      {
        this.HoursSince=24;
        this.CurrentMinutes-=this.GivenMinutes;
      }
      else{
        this.HoursSince=this.CurrentHours-this.GivenHours;
      }
    }
    else{
      this.HoursSince=this.CurrentHours-this.GivenHours;
    }

    if(this.CurrentMinutes<this.GivenMinutes)
    {
      this.HoursSince--;
      this.MinutesSince=60-Math.abs(this.CurrentMinutes-this.GivenMinutes);
    }
    else{
      this.MinutesSince=this.CurrentMinutes-this.GivenMinutes;
    }*/ //old version with hours and everything 

    if(this.GivenTimeForm>this.CurrentTimeForm)
    {
      this.SinceTimeForm=((24-this.GivenTimeForm)+this.CurrentTimeForm);
    }
    else if (this.GivenTimeForm==this.CurrentTimeForm)
    {
      this.SinceTimeForm=24;
    }
    else
    {
    this.SinceTimeForm=this.CurrentTimeForm-this.GivenTimeForm;
    }
    console.log(this.SinceTimeForm);
    let x=ConvertBack(this.SinceTimeForm);
    console.log(x.hour);
    console.log(x.min);
    let m=ConvertBack(this.SinceTimeForm);
    this.HoursSince=m.hour;
    this.MinutesSince=m.min;
    if(this.HoursSince<6)
    {
      this.colour="green";
      this.TreatmentInfo="<ul><li>EVT avilable for: <b>"+(6-this.HoursSince)+":"+(60-this.MinutesSince)+":"+(60-this.SecondsSince)+"</b></li><li>tPA Available</li></ul>";//need to add in the actual time needed and check the format for wording and what is available  
    }
    else if(this.HoursSince>=6&&this.HoursSince<24)
    {
      this.colour="yellow";
      this.TreatmentInfo="<ul><li>tPA avilable</li></ul>";
    }
    else if(this.HoursSince>=24)
    {
      this.colour="red";
      this.TreatmentInfo="<ul><li>Passed usual recovery time</li></ul>";
    }

    this.intervalID= setInterval(()=>{
        this.SecondsSince++;
        if(this.SecondsSince==60)//increment the count 
        {
          this.SecondsSince=0;
          this.SinceTimeForm+=(1/60);
          let m=ConvertBack(this.SinceTimeForm);
          this.HoursSince=m.hour;
          this.MinutesSince=m.min;
        }
        
        
       
    if(this.HoursSince<4)
    {
        this.colour="green";
        this.TreatmentInfo="</b></li><li>tPA Available for: <b>"+ "</li></ul>"+"<ul><li>EVT avilable for: <b>"+pad((5-this.HoursSince),2)+":"+pad((59-this.MinutesSince),2)+":"+pad((60-this.SecondsSince),2);//need to add in the actual time needed and check the format for wording and what is available
    }
    else if(this.HoursSince>=4)
    {
      if(this.HoursSince==4&&this.MinutesSince<30)
      {
        this.colour="green";
        this.TreatmentInfo="<ul><li>EVT avilable for: <b>"+pad((5-this.HoursSince),2)+":"+pad((59-this.MinutesSince),2)+":"+pad((60-this.SecondsSince),2)+"</b></li><li>tPA Available</li></ul>";//need to add in the actual time needed and check the format for wording and what is available
      }
      else
      {
        this.colour="yellow";
       this.TreatmentInfo="<ul><li>EVT avilable for: <b>"+pad((5-this.HoursSince),2)+":"+pad((59-this.MinutesSince),2)+":"+pad((60-this.SecondsSince),2);
      }
      
    }
    else if(this.HoursSince>6)
    {
      this.colour="red";
      this.TreatmentInfo="<ul><li>Passed usual recovery time</li></ul>";
    }
       
      },1000);
    
    
  }

  

}
function pad(num:number, size:number): string {
  let s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}

function ConvertToTimeForm(hours:number,min:number):number{
  let m=hours;
  m=m+(min/60);
  return m;
}

function ConvertBack(TimeForm:number):any{
  let Hour=TimeForm/1;
  let Minute=TimeForm%1;
  Hour=Hour-Minute;
  Minute*=60;
  Minute=Math.round(Minute);
  return{
    hour:Hour,
    min:Minute,
  };

}