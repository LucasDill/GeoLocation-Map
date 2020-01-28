import { Component, Input, EventEmitter } from '@angular/core';

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

  constructor() {
    this.time=this.TimePassed;
    console.log(this.time);
    this.text = 'Hello World';
    
  }
  ngAfterViewInit(){
    this.time=this.TimePassed;
    console.log("ngOnview")
    console.log(this.time);
  }

}
