import { Component } from '@angular/core';
import { NavController, ModalController, Platform } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms"
import * as moment from 'moment';
import { DataServiceProvider } from '../../providers/data-service';
import { PatientLocationPage } from '../patient-location/patient-location';
import { AngularFireDatabase } from '@angular/fire/database';

import "firebase/auth";
import "firebase/firestore"; 
import firebase from 'firebase';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { File } from '@ionic-native/file';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


@Component({
  selector: 'page-last-known-well',
  templateUrl: 'last-known-well.html'
})
export class LastKnownWellPage {

  db : any;

myDate=moment().format("MMM D");
myTime=moment().format("HH:mm");//sets the current time option for the last known well based on the time of the machine 
timeForm =new FormGroup({//creates a new form with the last known well 
  date: new FormControl(),
  time1: new FormControl('',Validators.required),//set the form time with valdators required so they need to be entered in order to continue 
});
  constructor(public navCtrl: NavController, public formBuilder: FormBuilder,public Data: DataServiceProvider,public DataBase: AngularFireDatabase, private modal: ModalController, private document: DocumentViewer,private file: File,public platform: Platform,
    private inAppBrowser: InAppBrowser) {
   //console.log(this.myDate);//Use of the current machine time for the initial timer value 
   var offset= getTimeZone();
   //console.log(offset)
   var totalOffset= new Date().getTimezoneOffset();
  // console.log(totalOffset);
   this.Data.UserTimeZone=offset;
   this.db=firebase.firestore();
  }

  ionViewWillLoad(){// A simple query that finds all of the medical centers to better search for them
    this.Data.AllMedicalCenters= this.db.collection("/Health Centers/")//This would be better done somewhere else or done with syncronization through realtime database but this is how we have it now 
    .get()
    .then((querySnapshot) => {
      var total=[]
      querySnapshot.forEach(function(doc) {
          var obj = doc.data();
          total.push(obj);
        
      });
      this.Data.AllMedicalCenters=total;// save the array of all abjects to the Data Service provider 
  });
  
}

SubmitTime(params){//once the button is clicked to go to the next page it will push to the PatientLocationPage
  if (!params) params = {};//set the parameters to null if there are none 
  console.log(params);
    this.navCtrl.push(PatientLocationPage);//go to the next page 
    console.log(this.timeForm.value.time1)
    console.log(this.myDate)
    console.log(this.myTime)
    this.Data.time=this.timeForm.value.time1;//set the time on the data page which will start the tier 
    if(this.Data.LastKnownWellTime!=this.timeForm.value.time1)//only stop if a new a new time is provided 
    {
      clearInterval(this.Data.intervalID);//stops the previous interval from running 
      this.Data.StartTime(this.timeForm.value.time1,0);// send the new time 
    }
}
  
TimeModal(){
 const LKWModal= this.modal.create('LkwModalPage');

 LKWModal.present();
}

OpenPdf(){
//var url="https://tbrhsc.net/";
//const browser=this.inAppBrowser.create(url,'_self');
//window.open(encodeURI("/sdcard/www/assets/pdf/StrokeCare.pdf"),'_self');
  const options: DocumentViewerOptions={
    title:"Test PDF"
  };
  let path=null;
  if(this.platform.is("ios")){
    path=this.file.documentsDirectory;
  }
  else if(this.platform.is('android')){
    path=this.file.dataDirectory
  }
  
  this.document.viewDocument(path+'www/assets/pdf/StrokeCare.pdf','applicaion/pdf',options);
  var test=this.document.canViewDocument("./assets/pdf/StrokeCare.pdf","application/pdf",{});
  document.getElementById('imgTest').innerHTML="<p>"+test+"\n\n</p>";
}

}
function getTimeZone() {
  var offset = new Date().getTimezoneOffset(), o = Math.abs(offset);
  return parseFloat((offset < 0 ? "+" : "-") + ("00" + Math.floor(o / 60)).slice(-2) + ":" + ("00" + (o % 60)).slice(-2));
}