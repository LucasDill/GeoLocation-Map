import { DataServiceProvider } from "../../providers/data-service";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore"; 

export class Multipliers {
db: any;
  constructor(public Data: DataServiceProvider) {
      this.db = firebase.firestore();
      //this.originMultipliers();
      //this.destinationMultipliers();
  }


  /*originMultipliers(){
    
    this.db.collection("/Multipliers/")
    .get()
    .then((querySnapshot) => {
      let arr = [];
      querySnapshot.forEach(function(doc) {
        var obj = JSON.parse(JSON.stringify(doc.data()));
        obj.id = doc.id;
        //obj.eventId = doc.id;
        arr.push(obj);
        console.log(doc.data())
      });
    });
    // origin multipliers (as determined when the current location of the user is entered)
    if (this.Data.origin_area == 'north')
    {
        this.Data.origin_multiplier_area = ;
    }
    else if (this.Data.origin_area == 'east')
    {
        this.Data.origin_multiplier_area = ;
    }
    else if (this.Data.origin_area == 'west')
    {
        this.Data.origin_multiplier_area = ;
    }
    else if (this.Data.origin_area == 'central')
    {
        this.Data.origin_multiplier_area = ;
    }


    let origin_weather_code: any = this.Data.origin_weatherdata[0];
    if (origin_weather_code > 199 && origin_weather_code < 233)
    {
        // types of thunderstorms
        this.Data.origin_multiplier_weather = ;
    }
    else if (origin_weather_code > 299 && origin_weather_code < 322)
    {
        // types of drizzle
        this.Data.origin_multiplier_weather = ;
    }
    else if (origin_weather_code > 499 && origin_weather_code < 532)
    {
        // types of rain
        this.Data.origin_multiplier_weather = ;
    }
    else if (origin_weather_code > 599 && origin_weather_code < 623)
    {
        // types of snow
        this.Data.origin_multiplier_weather = ;
    }
    else if (origin_weather_code > 700 && origin_weather_code < 782)
    {
        // types of atmospheric anomalies
        this.Data.origin_multiplier_weather = ;
    }
    else if (origin_weather_code == 800)
    {
        // clear sky
        this.Data.origin_multiplier_weather = ;
    }
    else if (origin_weather_code > 800 && origin_weather_code < 805)
    {
        // types of clouds
        this.Data.origin_multiplier_weather = ;
    }
    
}

destinationMultipliers(){
    // destination multipliers (as determined when the routing is calculated)
    if (this.Data.destination_area == 'north')
    {
        this.Data.destination_multiplier_area = ;
    }
    else if (this.Data.destination_area == 'east')
    {
        this.Data.destination_multiplier_area = ;
    }
    else if (this.Data.destination_area == 'west')
    {
        this.Data.destination_multiplier_area = ;
    }
    else if (this.Data.destination_area == 'central')
    {
        this.Data.destination_multiplier_area = ;
    }


    let destination_weather_code: any = this.Data.destination_weatherdata[0];
    if (destination_weather_code > 199 && destination_weather_code < 233)
    {
        // types of thunderstorms
        this.Data.destination_multiplier_weather = ;
    }
    else if (destination_weather_code > 299 && destination_weather_code < 322)
    {
        // types of drizzle
        this.Data.destination_multiplier_weather = ;
    }
    else if (destination_weather_code > 499 && destination_weather_code < 532)
    {
        // types of rain
        this.Data.destination_multiplier_weather = ;
    }
    else if (destination_weather_code > 599 && destination_weather_code < 623)
    {
        // types of snow
        this.Data.destination_multiplier_weather = ;
    }
    else if (destination_weather_code > 700 && destination_weather_code < 782)
    {
        // types of atmospheric anomalies
        this.Data.destination_multiplier_weather = ;
    }
    else if (destination_weather_code == 800)
    {
        // clear sky
        this.Data.destination_multiplier_weather = ;
    }
    else if (destination_weather_code > 800 && destination_weather_code < 805)
    {
        // types of clouds
        this.Data.destination_multiplier_weather = ;
    }



  }*/
}