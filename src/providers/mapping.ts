import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataServiceProvider } from './data-service';
import { RoutingProvider } from './routing';

/*
  Generated class for the MappingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MappingProvider {

  constructor(public http: HttpClient, public Data: DataServiceProvider, public Routes: RoutingProvider) {
    console.log('Hello MappingProvider Provider');
  }

SearchMap(input){
console.log(input)
}

}
