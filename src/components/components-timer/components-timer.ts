import { Component } from '@angular/core';
import { DataServiceProvider } from '../../providers/data-service';
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

  constructor(public Data: DataServiceProvider) {//Because this keept reseting every time it went to a new page all of the information is handled by the data provider which does not change throught the app 
       //The only thing that this TS does is make sure the html can access the Data provider and load the appropriate libraries 
  }
}
