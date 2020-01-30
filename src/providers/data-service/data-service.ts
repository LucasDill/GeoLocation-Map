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
  constructor() {
    console.log('Hello DataServiceProvider Provider');
  }
  

  StartTime(param)
  {
    this.LastKnownWellTime=param;
    this.CurrentTime= new Date().getHours();
    console.log(this.CurrentTime)
    console.log(typeof(param));
    if(this.CurrentTime!=undefined)
    {
    this.intervalID= setInterval(()=>{
        this.CurrentTime++;
      },1000);
    }
    
  }

}
