import { Injectable, Inject } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import { DataServiceProvider } from '../../providers/data-service';

export class WeatherService {

  constructor(@Inject(HttpClient) private httpClient: HttpClient, public Data: DataServiceProvider) {}

  getWeatherFromApi(lat: string, lon: string){
    //return this.httpClient.get(`http://api.weatherstack.com/current?access_key=3b527b7fc289c02197c55fdc41d37d0e&query=${city}`);
    return this.httpClient.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=cac781becd280a861602a53956e3b3b0`);//get the weather information based on the lat and long 
    
  }

}