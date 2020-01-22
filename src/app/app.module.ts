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
    IonicModule.forRoot(MyApp)
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
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
