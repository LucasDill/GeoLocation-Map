import { Component } from '@angular/core';

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

  text: string;

  constructor() {
    console.log('Hello ComponentsTimerComponent Component');
    this.text = 'Hello World';
  }

}
