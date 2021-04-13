import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, ModalController, Platform } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms"
import * as moment from 'moment';
import { DataServiceProvider } from '../../providers/data-service';
import { PatientLocationPage } from '../patient-location/patient-location';
import { AngularFireDatabase } from '@angular/fire/database';
import "firebase/auth";
import "firebase/firestore"; 
import firebase from 'firebase/app';
//import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
//import { File } from '@ionic-native/file';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { PdfViewerProvider } from '../../providers/pdf-viewer';


@Component({
  selector: 'page-last-known-well',
  templateUrl: 'last-known-well.html'
})
export class LastKnownWellPage {
@ViewChild("Header") Header: ElementRef;
@ViewChild("title") title: ElementRef;

  db : any;
MaxDate=moment().format("YYYY-MM-DD").toString();// this one sets the max available 
GivenDate=moment().format("YYYY-MM-DD").toString();// this one is the selector 
CurrentTime=moment().format("HH:mm");
myTime=moment().format("HH:mm");//sets the current time option for the last known well based on the time of the machine 
GridHeight:any;//Find the space remaining for the grid to be displayed on the page
rowHeight:any;
timeForm =new FormGroup({//creates a new form with the last known well 
  date: new FormControl('',Validators.required),
  time1: new FormControl('',Validators.required),//set the form time with validators required so they need to be entered in order to continue 
});
  constructor(public navCtrl: NavController, public formBuilder: FormBuilder,public Data: DataServiceProvider,public DataBase: AngularFireDatabase, private modal: ModalController, public platform: Platform,
    private inAppBrowser: InAppBrowser, public pdfViewer:PdfViewerProvider) {
   //console.log(this.myDate);//Use of the current machine time for the initial timer value 
   var offset= getTimeZone();
   //console.log(offset)
   //var totalOffset= new Date().getTimezoneOffset();
  // console.log(totalOffset);
   this.Data.UserTimeZone=offset;
   this.db=firebase.firestore();
  }

ionViewWillEnter(){
  this.Data.GivenTime=false;// this is just to set the value to false in order for it to have the top timer not appear on menu screens
  this.Data.NeedtPA=true;
  this.GridHeight= this.Data.RemainingHeight((this.Data.getHeight(this.Header)+this.Data.getHeight(this.title)+20));
  //console.log(this.GridHeight);
}
/*
ionViewWillLoad(){
  this.Data.AllDrivingData= this.db.collection("/GoogleDrivingData/")//This would be better done somewhere else or done with synchronization through realtime database but this is how we have it now 
  .get()
  .then((querySnapshot) => {
    var total=[]
    querySnapshot.forEach(function(doc) {
        var obj = doc.data();
        total.push(obj);
      
    });
    this.Data.AllDrivingData=total;// save the array of all objects to the Data Service provider 
    console.log("AllDrivingData:");
    console.log(JSON.stringify(this.Data.AllDrivingData));
    //console.log(JSON.stringify(this.Data.AllDrivingData));
  });
  
this.Data.AllDrivingData= this.db.collection("/Landing Sites/")//This would be better done somewhere else or done with synchronization through realtime database but this is how we have it now 
.get()
.then((querySnapshot) => {
  var total=[]
  querySnapshot.forEach(function(doc) {
      var obj = doc.data();
      total.push(obj);
    
  });
  this.Data.AllLandingSites=total;// save the array of all objects to the Data Service provider 
  console.log("AllLandingSites:");
  console.log(JSON.stringify(this.Data.AllLandingSites));
//   for (var i = 0; i< this.Data.AllLandingSites.length; i++) {
//     delete this.Data.AllLandingSites[i].city ;
//     delete this.Data.AllLandingSites[i].siteName   ;
//     delete this.Data.AllLandingSites[i].type;
//     delete this.Data.AllLandingSites[i].Address   ;
//     delete this.Data.AllLandingSites[i].id   ;
 
//   }
 



    
});
}*/

SubmitTime(){//once the button is clicked to go to the next page it will push to the PatientLocationPage
  this.Data.GivenTime=true;
  this.MaxDate=moment().format("YYYY-MM-DD").toString();
  this.CurrentTime=moment().format("HH:mm");
    this.navCtrl.push(PatientLocationPage);//go to the next page 
    this.Data.CurrentDate=new Date(this.MaxDate.toString()+" "+this.CurrentTime.toString());// get the value in the correct format to be passed on 
    this.Data.Analytics.DateUsed=this.Data.CurrentDate;//set for the analytics later
    this.Data.GivenDate=this.timeForm.value.date;
    this.Data.time=this.timeForm.value.time1;//set the time on the data page which will start the tier 
    if(this.Data.LastKnownWellTime!=this.timeForm.value.time1)//only stop if a new a new time is provided 
    {
      clearInterval(this.Data.intervalID);//stops the previous interval from running 
      this.Data.StartTime(this.timeForm.value.time1,0);// send the new time 
    }
}   
  
TimeModal(event){

 const LKWModal= this.modal.create('LkwModalPage');

 LKWModal.present();

}

OpenPdf(name){
  this.pdfViewer.openDocument(name);
}

OpenWebsite(url)
{
  //var url="https://tbrhsc.net/";
const browser=this.inAppBrowser.create(url,'_self');
browser//stop the warning while preventing the error 
}

}
function getTimeZone() {
  var offset = new Date().getTimezoneOffset(), o = Math.abs(offset);
  return parseFloat((offset < 0 ? "+" : "-") + ("00" + Math.floor(o / 60)).slice(-2) + ":" + ("00" + (o % 60)).slice(-2));
}