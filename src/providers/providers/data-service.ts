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
  location: any;


  constructor() {
  }
  

  StartTime(param)//starts when a time is provided in last known well sets the time to be displayed at the top of pages after getting the current time 
  {
    this.LastKnownWellTime=param;
    var index =this.LastKnownWellTime.indexOf(":");// split the string into two parts to be used later
    this.GivenHours=parseInt(this.LastKnownWellTime.substr(0,index));
    this.GivenMinutes=parseInt(this.LastKnownWellTime.substr(index+1));
    this.GivenTimeForm=ConvertToTimeForm(this.GivenHours,this.GivenMinutes);

    this.CurrentTime= new Date().getTime();//there may be an issue of time zones find the time in this area
    this.CurrentHours= new Date().getHours();
    this.CurrentMinutes= new Date().getMinutes();
    this.SecondsSince= new Date().getSeconds();
    this.CurrentTimeForm=ConvertToTimeForm(this.CurrentHours,this.CurrentMinutes);

   

    if(this.GivenTimeForm>this.CurrentTimeForm)
    {
      this.SinceTimeForm=((24-this.GivenTimeForm)+this.CurrentTimeForm);
    }
    else if (this.GivenTimeForm==this.CurrentTimeForm)//if it is the same time set passed to zero used to be 24
    {
      this.SinceTimeForm=0;
    }
    else
    {
    this.SinceTimeForm=this.CurrentTimeForm-this.GivenTimeForm;
    }
    let x=ConvertBack(this.SinceTimeForm);
    let m=ConvertBack(this.SinceTimeForm);
    this.HoursSince=m.hour;
      this.MinutesSince=(m.min);
    
    
      if(this.SinceTimeForm<=4.5)
      {
        let EVTtime=6-this.SinceTimeForm;
        let EVT=ConvertBack(EVTtime);
        let TPAtime=4.5-this.SinceTimeForm;
        let TPA=ConvertBack(TPAtime);
  
          this.colour="green";
          this.TreatmentInfo="<ul><li>tPA Available for: <b>"+pad((TPA.hour),2)+":"+pad(((TPA.min)),2)+"</b></li>"+"<li>EVT avilable for: <b>"+pad((EVT.hour),2)+":"+pad(((EVT.min)),2)+"</b></li></ul>";//need to add in the actual time needed and check the format for wording and what is available take out the -1 if you want just the minutes 
      }
      else if(this.SinceTimeForm>=4.5&&this.SinceTimeForm<6)
      {
        let EVTtime=6-this.SinceTimeForm;
        let EVT=ConvertBack(EVTtime);
        
          this.colour="yellow";
         this.TreatmentInfo="<ul><li>EVT avilable for: <b>"+pad((EVT.hour),2)+":"+pad((EVT.min),2)+"</li></ul>";
      }
      else if(this.SinceTimeForm>6)
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
        
        
       
    if(this.SinceTimeForm<=4.5)
    {
      let EVTtime=6-this.SinceTimeForm;
      let EVT=ConvertBack(EVTtime);
      let TPAtime=4.5-this.SinceTimeForm;
      let TPA=ConvertBack(TPAtime);

        this.colour="green";
        this.TreatmentInfo="<ul><li>tPA Available for: <b>"+pad((TPA.hour),2)+":"+pad(((TPA.min)),2)+"</b></li>"+"<li>EVT avilable for: <b>"+pad((EVT.hour),2)+":"+pad(((EVT.min)),2)+"</b></li></ul>";//need to add in the actual time needed and check the format for wording and what is available take out the -1 if you want just the minutes 
    }
    else if(this.SinceTimeForm>=4.5&&this.SinceTimeForm<6)
    {
      let EVTtime=6-this.SinceTimeForm;
      let EVT=ConvertBack(EVTtime);
      
        this.colour="yellow";
       this.TreatmentInfo="<ul><li>EVT avilable for: <b>"+pad((EVT.hour),2)+":"+pad((EVT.min),2)+"</li></ul>";
    }
    else if(this.SinceTimeForm>6)
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
  if(Minute==60)
  {
    Hour=Hour+1;
    Minute=0;
  }
  


  return{
    hour:Hour,
    min:Minute,
  };

}