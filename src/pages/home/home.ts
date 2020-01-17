import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Page2Page } from '../page2/page2';
import { Page3Page } from '../page3/page3';
import { Page4Page } from '../page4/page4';
import { Page3APage } from '../page3a/page3a';
import { Page3BPage } from '../page3b/page3b';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
  }
  goToPage2(params){
    if (!params) params = {};
    this.navCtrl.push(Page2Page);
  }goToPage3(params){
    if (!params) params = {};
    this.navCtrl.push(Page3Page);
  }goToPage4(params){
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
