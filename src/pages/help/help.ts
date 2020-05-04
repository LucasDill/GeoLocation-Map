import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-help',
  templateUrl: 'help.html'
})
export class HelpPage {
//This page is also for the menu that we ended up removing because it made the navigation too confusing
  constructor(public navCtrl: NavController) {
  }
  
}
