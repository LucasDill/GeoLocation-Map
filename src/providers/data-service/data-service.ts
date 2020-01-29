import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the DataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataServiceProvider {
  time: any;
  CurrentTime: any;
  constructor() {
    console.log('Hello DataServiceProvider Provider');
  }
  SetTime(param){
    this.time=param;
  }

}
