import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Page4Page } from '../page4/page4';
import { Page3APage } from '../page3a/page3a';
import { Page3BPage } from '../page3b/page3b';

@Component({
  selector: 'page-page3',
  templateUrl: 'page3.html'
})
export class Page3Page {

  constructor(public navCtrl: NavController) {
  }
  goToPage4(params){
    if (!params) params = {};
    this.navCtrl.push(Page4Page);
  }goToPage3A(params){
    if (!params) params = {};
    this.navCtrl.push(Page3APage);
  }goToPage3B(params){
    if (!params) params = {};
    this.navCtrl.push(Page3BPage);
  }
}
