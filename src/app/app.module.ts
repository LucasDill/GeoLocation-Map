import { FormsModule } from '@angular/forms';
// these are all of the libraries that are being used by the application 
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { PatientLocationPage } from '../pages/patient-location/patient-location';
import { LastKnownWellPage } from '../pages/last-known-well/last-known-well';
import { ImagingRequiredPage } from '../pages/imaging-required/imaging-required';
import { TreatmentPage } from '../pages/treatment/treatment';
import { MapPage } from '../pages/map/map';
import { EvtOptionsPage } from '../pages/evt-options/evt-options';
import { ComponentsTimerComponent } from '../components/components-timer/components-timer';
import { SpinnerComponent } from '../components/spinner/spinner';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AgmCoreModule } from '@agm/core';
import { HelpPage } from '../pages/help/help';
import { ImagingPage } from '../pages/imaging/imaging';
import { TPaQuestionPage } from '../pages/t-pa-question/t-pa-question';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataServiceProvider } from '../providers/data-service';
import { AngularFirestore } from 'angularfire2/firestore';
import { HttpClientModule} from "@angular/common/http";
import { WeatherService } from '../pages/patient-location/weather';
import { RoutingProvider } from '../providers/routing';
import { RegionalStrokePage } from '../pages/regional-stroke/regional-stroke';
import { File } from '@ionic-native/file';
import { DocumentViewer } from '@ionic-native/document-viewer';

import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { PdfViewerProvider } from '../providers/pdf-viewer';
import { NextStepsPage } from '../pages/next-steps/next-steps';
import { CityPage } from '../pages/city/city';
import { MapExplorePage } from '../pages/map-explore/map-explore';
import { WelcomePage } from '../pages/welcome/welcome';
import { ContactPage } from '../pages/contact/contact';
import { HtmlPipe } from '../pipes/htmlpipe/htmlpipe';
import { PipesModule } from '../pipes/pipes.module';

import {ExpandComponent } from '../components/expand/expand';
import { MappingProvider } from '../providers/mapping';
import { TPaNoPage } from '../pages/t-pa-no/t-pa-no';
import { fromEventPattern } from 'rxjs';

import { IonicStorageModule } from '@ionic/storage';
import { DatabaseAccessProvider } from '../providers/database-access';

@NgModule({
  declarations: [// this is where we declare all of our pages and components if you use the auto generate this may be added but you may also need to do it manually 
    MyApp,
    PatientLocationPage,
    LastKnownWellPage,
    ImagingRequiredPage,
    TreatmentPage,
    MapPage,
    ComponentsTimerComponent,
    SpinnerComponent,
    HelpPage,
    ImagingPage,
    TPaQuestionPage,
    EvtOptionsPage,
    NextStepsPage,
    CityPage,
    MapExplorePage,
    WelcomePage,
    ContactPage,
    HtmlPipe,
    ExpandComponent,
    TPaNoPage,
    RegionalStrokePage
  ],
  imports: [ 
    FormsModule,  
     // these are special imports used by the app and where we declare the api key and firestore information 
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC2GRIwOatzPmiamkpv3znVK8hi9g4lGoU',// this is the api key that deals with all of the google info, once this is passed off you may need to change it because the hospital might want there own 
      libraries: ['geometry','places']
    }),
     AngularFireModule.initializeApp({// this is the standard firebase connection stuff if you have dealt with it before it should be familiar. we have a shared email this is under
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
     AngularFireAuthModule,
     HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PatientLocationPage,
    LastKnownWellPage,
    ImagingRequiredPage,
    TreatmentPage,
    MapPage,
    HelpPage,
    ImagingPage,
    TPaQuestionPage,
    EvtOptionsPage,
    NextStepsPage,
    CityPage,
    MapExplorePage,
    WelcomePage,
    ContactPage,
    TPaNoPage,
    RegionalStrokePage

  ],
  providers: [// the providers used the only ones we made where the DataServiceProvider and the RoutingProvider I think the others are standardized
    DataServiceProvider,
    StatusBar,
    SplashScreen,
    Geolocation,
    AngularFirestore,
    HttpClientModule,
    WeatherService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RoutingProvider,
    File,
    DocumentViewer,
    InAppBrowser,
    PdfViewerProvider,
    MappingProvider,
    DatabaseAccessProvider
  ]
})
export class AppModule {}
