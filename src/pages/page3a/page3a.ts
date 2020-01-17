import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Page3BPage } from '../page3b/page3b';

@Component({
  selector: 'page-page3a',
  templateUrl: 'page3a.html'
})
export class Page3APage {

  constructor(public navCtrl: NavController) {
  }
  goToPage3B(params){
    if (!params) params = {};
    this.navCtrl.push(Page3BPage);
  }
}
