import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, AppRoutingModule, IonicModule.forRoot(),
    AgmCoreModule.forRoot({
     apiKey: 'AIzaSyC2GRIwOatzPmiamkpv3znVK8hi9g4lGoU',
     libraries: ['geometry']
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
  providers: [
    StatusBar,
    SplashScreen,
      Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}