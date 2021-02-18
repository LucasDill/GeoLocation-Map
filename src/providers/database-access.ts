import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataServiceProvider } from './data-service';
import { MappingProvider } from './mapping';
import { RoutingProvider } from './routing';
import { Storage } from '@ionic/storage';
/*
  Generated class for the DatabaseAccessProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseAccessProvider {

  constructor(public http: HttpClient, private Data: DataServiceProvider, private routes: RoutingProvider,private Mapping: MappingProvider, private storage: Storage) {
  }

}
