import { Injectable, Inject } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import { DataServiceProvider } from '../../providers/data-service';

export class WeatherService {

  constructor(@Inject(HttpClient) private httpClient: HttpClient, public Data: DataServiceProvider) {}

  getWeatherFromApi(lat: string, lon: string){
    //return this.httpClient.get(`http://api.weatherstack.com/current?access_key=3b527b7fc289c02197c55fdc41d37d0e&query=${city}`);
    return this.httpClient.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=cac781becd280a861602a53956e3b3b0`);//get the weather information based on the lat and long 
    
  }

  async getTimeZone(lat: string, lng: string){
    var date= new Date();
    var timestamp= date.getTime()/1000+date.getTimezoneOffset()*60;// current UTC as Seconds Since Midnight Jan 1, 1970 UTC
   return this.httpClient.get('https://maps.googleapis.com/maps/api/timezone/json?location='+lat+','+lng+'&timestamp='+timestamp+'&key=AIzaSyC2GRIwOatzPmiamkpv3znVK8hi9g4lGoU');/*.subscribe( Results=>{
   
      var finalChange=(Results.rawOffset+Results.dstOffset)/3600;
      result=finalChange;
      console.log(result);
      return finalChange;
    
 
  
  //return i;
  })//get the time zone based on the lat and long 
  */
  }

}
