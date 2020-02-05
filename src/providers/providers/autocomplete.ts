import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
@Injectable()
export class Autocomplete {

  constructor(private db: AngularFireDatabase) { }
  getLocations(start, end): AngularFireList<any> {

    return this.db.list("/Medical_Centers/", ref => 
        ref.limitToFirst(3).orderByChild('address').startAt(start).endAt(end))
    
  
    }
}