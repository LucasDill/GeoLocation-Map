import { Component, Input, EventEmitter } from '@angular/core';
import { DataServiceProvider } from '../../providers/data-service/data-service';
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
@Input('Time') TimePassed;

  time:any;
  text: string;

  constructor(public Data: DataServiceProvider) {
    this.text = 'Hello World';
    this.time=this.Data.time;
    console.log(this.time);
  }

}
