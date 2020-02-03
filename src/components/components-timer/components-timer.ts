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
colour:any;

  time:any;
  text: string;
  CurrentTime: any;
  constructor(public Data: DataServiceProvider) {
    this.text = 'Hello World';
    this.colour="green";
      //this.CurrentTime=this.Data.CurrentTime;
    
  }
 

}
