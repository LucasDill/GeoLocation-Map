import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service';

/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public Data: DataServiceProvider, private inAppBrowser: InAppBrowser) {
  }

  ionViewDidLoad() {
    this.Data.Analytics.ContactViewed=true;
  }
goToSite(){
  var url="https://www.nwostroke.ca";
  const browser=this.inAppBrowser.create(url,'_self');
}
}
