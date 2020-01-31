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
  CurrentHours:number;
  CurrentMinutes:number;
  HoursSince: any;
  MinutesSince:any;
  SecondsSince:any=0;

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
    console.log(this.GivenHours);
    console.log(this.GivenMinutes);
  
    this.CurrentTime= new Date().getTime();//there may be an issue of time zones find the time in this area
    this.CurrentHours= new Date().getHours();
    this.CurrentMinutes= new Date().getMinutes();
    console.log(this.CurrentHours,this.CurrentMinutes);

    if(this.GivenHours>this.CurrentHours)//calculate the time that has passed since the patient was well if it is greater than it is a new day and a special case is needed
    {
      this.HoursSince=((24-this.GivenHours)+this.CurrentHours);
    }
    else if(this.GivenHours==this.CurrentHours)
    {
      if(this.GivenMinutes>this.CurrentMinutes)
      {
        this.HoursSince=this.CurrentHours+24;
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
      this.HoursSince++;
      this.MinutesSince=Math.abs(this.CurrentMinutes-this.GivenMinutes);
    }
    else{
      this.MinutesSince=this.CurrentMinutes-this.GivenMinutes;
    }

    console.log(this.HoursSince);
    console.log(this.MinutesSince);
    
    this.intervalID= setInterval(()=>{
        this.SecondsSince++;
        if(this.SecondsSince==60)//increment the count 
        {
          this.SecondsSince=0;
          this.MinutesSince++;
        }
        if(this.MinutesSince==60)
        {
          this.MinutesSince=0;
          this.HoursSince++;
        }
       
      },1000);
    
    
  }



}