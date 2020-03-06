import { Injectable, Inject } from '@angular/core';
import { HttpClient} from "@angular/common/http";

export class WeatherService {

  constructor(@Inject(HttpClient) private httpClient: HttpClient) {}

  getWeatherFromApi(city: string){
    return this.httpClient.get(`http://api.weatherstack.com/current?access_key=3b527b7fc289c02197c55fdc41d37d0e&query=${city}`);
  }
}