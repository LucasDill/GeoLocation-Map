import { Component, Input, EventEmitter } from '@angular/core';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { setInterval } from 'timers';
/**
 * Generated class for the ComponentsTimerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'components-timer',
  templateUrl: 'components-timer.html'
})
export class ComponentsTimerComponent {


  time:any;
  text: string;
  CurrentTime: any;
  constructor(public Data: DataServiceProvider) {
    this.text = 'Hello World';
    this.time=this.Data.time;
    console.log(this.time);
    this.CurrentTime= new Date().getUTCHours();
    this.Data.CurrentTime=this.CurrentTime;
    console.log("Entered");
    setInterval(()=>{
      this.Data.CurrentTime++;
      document.getElementById("timer").innerText=this.Data.CurrentTime;
    },1000);
  }
 

}
