import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { PatientLocationPage } from '../pages/patient-location/patient-location';
import { LastKnownWellPage } from '../pages/last-known-well/last-known-well';
import { ImagingRequiredPage } from '../pages/imaging-required/imaging-required';
import { TreatmentPage } from '../pages/treatment/treatment';
import { TelestrokeSitePage } from '../pages/telestroke-site/telestroke-site';
import { AdvancedImagingPage } from '../pages/advanced-imaging/advanced-imaging';
import { MapPage } from '../pages/map/map';

import {Geolocation} from '@ionic-native/geolocation/ngx';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AgmCoreModule } from '@agm/core';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    PatientLocationPage,
    LastKnownWellPage,
    ImagingRequiredPage,
    TreatmentPage,
    TelestrokeSitePage,
    AdvancedImagingPage,
    MapPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC2GRIwOatzPmiamkpv3znVK8hi9g4lGoU',
      libraries: ['geometry','places']
    }),
     AngularFireModule.initializeApp({
     apiKey: "AIzaSyB6NmY0iFundTq06rk3mpc5Wk7LwbWdUw0",
     authDomain: "degree-project-database.firebaseapp.com",
     databaseURL: "https://degree-project-database.firebaseio.com",
     projectId: "degree-project-database",
     storageBucket: "degree-project-database.appspot.com",
     messagingSenderId: "527765428487",
     appId: "1:527765428487:web:57170a630f65e0bc8b4da2",
     measurementId: "G-ML39B2PXC4" 
     }),
     AngularFireDatabaseModule,
     AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PatientLocationPage,
    LastKnownWellPage,
    ImagingRequiredPage,
    TreatmentPage,
    TelestrokeSitePage,
    AdvancedImagingPage,
    MapPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
