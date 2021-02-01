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
    //console.log('Hello MappingProvider Provider');
  }

SearchMap(search){
//console.log(search)
let arr=[]//set the array and the Medical_Centers to nothing 
var Medical_Centers=[];
for(var i=0;i<this.Data.AllMedicalCenters.length;i++)//Go through all of the medical centers and check to see if there is a match 
{
if(this.Data.AllMedicalCenters[i].name!=undefined)
{
  if(search.toUpperCase()==this.Data.AllMedicalCenters[i].name.toUpperCase().substring(0,search.length))//make everything uppercase to search and make sure the name in the database is the same length 
  {
    arr.push(this.Data.AllMedicalCenters[i]);// if there is a match push to the array to be displayed 
  }
  else if(search.toUpperCase()==this.Data.AllMedicalCenters[i].city.toUpperCase().substring(0,search.length))//This one searches by the city 
  {
    arr.push(this.Data.AllMedicalCenters[i]);
  }
  else if(this.Data.AllMedicalCenters[i].AKA!=undefined)// if there is nothing else search through the also Known as Variables 
  {
    for(var j=0;j<this.Data.AllMedicalCenters[i].AKA.length;j++)
    {
      if(search.toUpperCase()==this.Data.AllMedicalCenters[i].AKA[j].toUpperCase().substring(0,search.length))
      {
        let temp=this.Data.AllMedicalCenters[i].name;// save the usual name temporarily 
        this.Data.AllMedicalCenters[i].name=this.Data.AllMedicalCenters[i].AKA[j];// set the name for the object as the also known as so it displays on the button
        this.Data.AllMedicalCenters[i].AKA[j]=temp;//Save the other name in the AKA 
        arr.push(this.Data.AllMedicalCenters[i]);// add it to the array 
      }
    }
  }
}
else{// if the name is not defined it will be a city site and we will have different functions 
  if(search.toUpperCase()==this.Data.AllMedicalCenters[i].city.toUpperCase().substring(0,search.length))//This one searches by the city 
  {
    arr.push(this.Data.AllMedicalCenters[i]);
  }
  else if(this.Data.AllMedicalCenters[i].AKA!=undefined)// if there is nothing else search through the also Known as Variables 
  {
    for(var j=0;j<this.Data.AllMedicalCenters[i].AKA.length;j++)
    {
      if(search.toUpperCase()==this.Data.AllMedicalCenters[i].AKA[j].toUpperCase().substring(0,search.length))
      {
        let temp=this.Data.AllMedicalCenters[i].city;// save the usual city temporarily 
        this.Data.AllMedicalCenters[i].city=this.Data.AllMedicalCenters[i].AKA[j];// set the name for the object as the also known as so it displays on the button
        this.Data.AllMedicalCenters[i].AKA[j]=temp;//Save the other name in the AKA 
        arr.push(this.Data.AllMedicalCenters[i]);// add it to the array 
      }
    }
  }
}

}
return arr;//make the display information the array 

}

}
