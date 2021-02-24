/* 
Created Feb 22, 2021 by Lucas Dillistone 
This provider will check for updates to the database, fill locally stored data with useful points and 
*/

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataServiceProvider } from './data-service';
import { MappingProvider } from './mapping';
import { RoutingProvider } from './routing';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import firebase from 'firebase';
import { AnyTxtRecord } from 'dns';
import { BrowserPlatformLocation } from '@angular/platform-browser/src/browser/location/browser_platform_location';
import { Platform } from 'ionic-angular';
import { sortedChanges } from 'angularfire2/firestore';


@Injectable()
export class DatabaseAccessProvider {
LastUsed:any; 
db:any;
LastUsedStored:any;

  constructor(public http: HttpClient, private Data: DataServiceProvider, private routes: RoutingProvider,private Mapping: MappingProvider, private storage: Storage,private platform: Platform) {
    this.db=firebase.firestore();
     this.platform.ready();
     this.storage.ready();
    const last= this.storage.get('LastUsed');
  }
//this function will be used to get the last time used values from the database to see if any of the locally stored data wil need to be updated 

setAllData(){
  console.log("First time setup");
  this.setLastUsed();
  this.setAmb_Base();
  this.setCenters();
  this.setLandSite();
  this.setMult();
  this.setMultArea();
  this.setAirSpeed();
  this.setORNGE();
  
  }

filterLastUsedStored(id){
  return this.LastUsedStored.find(x=>x.id===id);
}

getLastUsed(){
  var upper=this;
  var storage=this.storage;
  var setNew=false;
  
  this.LastUsed=this.db.collection("/Modified/")//This would be better done somewhere else or done with synchronization through realtime database but this is how we have it now 
  .get()
  .then((querySnapshot) => {
    var total=[]
    querySnapshot.forEach(async function(doc) {
        var obj = doc.data();
        obj.id=doc.id;
        total.push(obj);
      let inMem=upper.filterLastUsedStored(doc.id);
      switch(doc.id){
        case "Amb_Base":
          if(inMem.time!=obj.time)
          {
            upper.setAmb_Base();//set the memory for the Ambulance Bases 
            setNew=true;
          }
          else{
            await upper.platform.ready();
            await storage.ready();
            const last=await storage.get('Amb_Base');
            upper.Data.AllAmb_Bases=last;
            //console.log("Ambulance Bases",last)
          }
          break;
        case "AirSpeed":
          if(inMem.time!=obj.time)
          {
            upper.setAirSpeed();//set the memory for the Air Speed 
            setNew=true;
          }
          else{
            await upper.platform.ready();
            await storage.ready();
            const last=await storage.get('Air_Speed');
            upper.Data.AllAirSpeed=last;
            //console.log("AirSpeed",last)
          }
          break;
        case "Centers":
          if(inMem.time!=obj.time)
          {
            upper.setCenters();//set the memory for the Health Centers 
            setNew=true;
          }
          else{
            /*upper.storage.get("HealthCenters").then((val)=>{
              upper.Data.AllMedicalCenters=val;*
            })*/
          await upper.platform.ready();
           await storage.ready();
           const last=await storage.get('HealthCenters');
           upper.Data.AllMedicalCenters=last;
           //console.log("Centers",last)
          }
          break;
        case "Land_Site":
          if(inMem.time!=obj.time)
          {
            upper.setLandSite();//set the memory for the Landing Sites 
            setNew=true;
          }
          else{
          await upper.platform.ready();
           await storage.ready();
           const land=await storage.get('LandingSite');
           upper.Data.AllLandingSites=land;
          // console.log("Landing site",land)
          }
          break;
        case "Multiplier":
          if(inMem.time!=obj.time)
          {
            upper.setMult();//set the memory for the Multipliers
            setNew=true;
          }
          else{
            await upper.platform.ready();
            await storage.ready();
            const land=await storage.get('Multipliers');
            upper.Data.AllMult=land;
            //console.log("Multipliers",land)
          }
          break;
        case "Multiplier_Area":
          if(inMem.time!=obj.time)
          {
            upper.setMultArea();//set the memory for the Multiplier Areas 
            setNew=true;
          }
          else{
            await upper.platform.ready();
            await storage.ready();
            const last=await storage.get('Multipliers_Area');
            upper.Data.AllMultArea=last;
            //console.log("Multiplier Area",last)
          }
          break;
        case "ORNGE_Base": 
        if(inMem.time!=obj.time)
        {
          upper.setORNGE();//set the memory for the ORNGE Bases 
          setNew=true;
        }
        else{
          await upper.platform.ready();
          await storage.ready();
          const last=await storage.get('ORNGE');
          upper.Data.AllORNGE=last;
          //console.log("ORNGE Base",last)
        }
          break;
        default:
          console.log("Other",doc.id)
          break;
      }
    });
    if (setNew==true)//if one of the values is different set the new values for the last time the values where modified 
    {
      console.log("Setting new Data");
      this.storage.set("LastUsed",total);
    }
    this.LastUsed=total;// save the array of all objects to the Data Service provider 
});

}
//This function will be used on the first time running the application to fill each part of locally stored data 


async getLastMem(){
  await this.platform.ready();
    await this.storage.ready();
    const last=await this.storage.get('LastUsed');
  this.LastUsedStored=last;
  this.getLastUsed();
}

setLastUsed(){
  console.log("Setting Last Used for the first time ")
  var total=[];
  this.Data.AllAmb_Bases= this.db.collection("/Modified/")// gets all of the plans ahead of time so they will only be queried once and stored 
  .get()
  .then((planSnapshot)=>{
  planSnapshot.forEach(function(doc) {
    var obj=doc.data();
    obj.id=doc.id;
    total.push(obj);
  });
  this.LastUsed=total;
  this.storage.set("LastUsed",total);
  });
}

setAmb_Base()
{
  console.log("Setting new Ambulance Bases")
  this.Data.AllAmb_Bases= this.db.collection("/Ambulance Bases/")// gets all of the plans ahead of time so they will only be queried once and stored 
  .get()
  .then((planSnapshot)=>{
  var plans=[];
  planSnapshot.forEach(function(doc) {
    var obj=doc.data();
    plans.push(obj);
  });
  this.Data.AllAmb_Bases=plans;
  this.storage.set("Amb_Base",plans);
  });
  
}

setAirSpeed(){
  console.log("Setting new Air Speed");
  this.Data.AllAmb_Bases= this.db.collection("/Air_Speed/")// gets all of the plans ahead of time so they will only be queried once and stored 
  .get()
  .then((planSnapshot)=>{
  var plans=[];
  planSnapshot.forEach(function(doc) {
    var obj=doc.data();
    obj.id=doc.id;
    plans.push(obj);
  });
  this.Data.AllAirSpeed=plans;
  this.storage.set("Air_Speed",plans);
  });
}

setCenters(){
  console.log("Setting new Centers");
  this.Data.AllAmb_Bases= this.db.collection("/Health Centers/")// gets all of the plans ahead of time so they will only be queried once and stored 
  .get()
  .then((planSnapshot)=>{
  var plans=[];
  planSnapshot.forEach(function(doc) {
    var obj=doc.data();
    plans.push(obj);
  });
  this.Data.AllMedicalCenters=plans;
  this.storage.set("HealthCenters",plans);
  });
}

setLandSite(){
  console.log("Setting new Landing Sites");
  this.Data.AllAmb_Bases= this.db.collection("/Landing Sites/")// gets all of the plans ahead of time so they will only be queried once and stored 
  .get()
  .then(async (planSnapshot)=>{
  var plans=[];
  planSnapshot.forEach(function(doc) {
    var obj=doc.data();
    plans.push(obj);
  });
  this.Data.AllLandingSites=plans;
  await this.storage.ready();
  this.storage.set('LandingSite',plans);
  });
}

setMult(){
  console.log("Setting new Multipliers");
  this.Data.AllAmb_Bases= this.db.collection("/Multipliers/")// gets all of the plans ahead of time so they will only be queried once and stored 
  .get()
  .then((planSnapshot)=>{
  var plans=[];
  planSnapshot.forEach(function(doc) {
    var obj=doc.data();
    obj.id=doc.id;
    plans.push(obj);
  });
  this.Data.AllMult=plans;
  this.storage.set("Multipliers",plans);
  });
}


setMultArea(){
  console.log("Setting new Multiplier Area");
  this.Data.AllAmb_Bases= this.db.collection("/Multipliers Area/")// gets all of the plans ahead of time so they will only be queried once and stored 
  .get()
  .then((planSnapshot)=>{
  var plans=[];
  planSnapshot.forEach(function(doc) {
    var obj=doc.data();
    obj.id=doc.id;
    plans.push(obj);
  });
  this.Data.AllMultArea=plans;
  this.storage.set("Multipliers_Area",plans);
  });
}

setORNGE(){
  console.log("Setting new ORNGE Bases");
  this.Data.AllAmb_Bases= this.db.collection("/ORNGE Bases/")// gets all of the plans ahead of time so they will only be queried once and stored 
  .get()
  .then((planSnapshot)=>{
  var plans=[];
  planSnapshot.forEach(function(doc) {
    var obj=doc.data();
    plans.push(obj);
  });
  this.Data.AllORNGE=plans;
  this.storage.set("ORNGE",plans);
  });
}

}
