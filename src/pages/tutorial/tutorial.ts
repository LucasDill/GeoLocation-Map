import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Slides } from 'ionic-angular';
/**
 * Generated class for the TutorialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
@ViewChild(Slides) slides:Slides;

options={
  initialSlide:1,
  speed:400
};

slide=[
  {
title:'Slide 1',
image:"./assets/Travel/Airplane.png"
},
{
  title:'Slide 2',
  image:"./assets/Travel/Ambulance.png"
}
];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorialPage');
    //this.slides.slideTo(2,500);
  }

  slideChanged(){
    let currentIndex=this.slides.getActiveIndex();
    console.log("Current index is",currentIndex);
  }

}
