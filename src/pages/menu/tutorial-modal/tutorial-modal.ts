
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Slides } from 'ionic-angular';

/**
 * Generated class for the TutorialModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tutorial-modal',
  templateUrl: 'tutorial-modal.html',
})
export class TutorialModalPage {

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
  
    constructor(public navCtrl: NavController, public navParams: NavParams,private view: ViewController) {
    }
  
    CloseInfo(){
      this.view.dismiss();
      }
    slideChanged(){
      let currentIndex=this.slides.getActiveIndex();
      console.log("Current index is",currentIndex);
    }



}
