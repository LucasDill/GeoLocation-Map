import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service';
import { RoutingProvider } from '../../providers/routing';
import { NextStepsPage } from '../next-steps/next-steps';


/**
 * Generated class for the EvtOptionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-evt-options',
  templateUrl: 'evt-options.html',
})
export class EvtOptionsPage {
  @ViewChild('header') header: ElementRef;
  @ViewChild('title') title: ElementRef;
  @ViewChild('footer') footer: ElementRef;

  cards: any;
  evtSpinner: Boolean=true;//sets the spinner option to true and the others to false so at the start the spinner shows and not the rest 
  evtshow: Boolean=false;
  evtEmpty:Boolean=false;
  message:any;
  scrollHeight:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public Data: DataServiceProvider,
    public Routes: RoutingProvider) {
   //   console.log(this.Routes.ImgRoutes);
  }
  async ionViewWillEnter(){//this is one of the ionic lifecycle elements that happen when the page is about to load 

    var HeaderHeight=this.Data.getElementHeight(this.header);
    var titleHeight=this.Data.getElementHeight(this.title);
    var footHeight=this.Data.getElementHeight(this.footer);
    this.scrollHeight=this.Data.RemainingHeight(HeaderHeight+titleHeight+footHeight)

    var evt=await this.EVTsetup();//for the EVT capable hospitals 
    //console.log(evt);
    if(evt.length==0)//if there are no EVT routes returned 
    {
      this.evtEmpty=true;// set the empty to be true and pass in a message that will be displayed where the cards usually would be 
      this.message="You appear to already be at an EVT Capable Hospital \nPlease Consult Hospital Regulations for further instructions";
    }
    else{//If there are routes returned set the cards to reflect those routes at the moment the TBRHSC is the only site that is capable of performing EVT 
      this.evtSpinner=false;//stop the spinner 
       this.evtshow=true;//show the div that contains all of the cards 
      this.cards=evt;
    }
    
   }


   expandItem(event,item): void {///This function will expand the card when it is clicked 
    // console.log("ClickWorks")
     //console.log(item);
     if (item.expanded) {
       item.expanded = false;
     } else {///////This is currently unused and it is what will eventually make the cards only expand one at a time 
       item.expanded=true;
      /* this.items.map(listItem => {
         if (item == listItem) {
           listItem.expanded = !listItem.expanded;
         } else {
           listItem.expanded = false;
         }
         return listItem;
       });*/
     }
     event.stopPropagation();//stop the upper click event from taking place 
     return item;/// this passes by the else and might need to be removed if the closing is added in 
   }

   async EVTsetup(){//EVT at the moment is just Thunder Bay which is the only bRegionalStrokeCenter
      var testroutes=this.Routes.MasterRoutes("bRegionalStrokeCentre")
       return testroutes;//return the final list of cards to be displayed on the page 
  }
  

  goToRoute(params){//If the user clicks on a route that includes driving 
    this.Data.isEVT=true;
    this.Routes.FindPlan(params);
    this.Data.isEVT=false;
    this.Data.ComplexRoute=false;//set the complex route to false 
    this.Data.Destination=params;//pass the destination selected to the Data Provider 
    this.navCtrl.push(NextStepsPage);//Go to the map page to display the selected route
  }


  ComplexRoute(cardDat)// if the user selects a route that includes driving then flying it is considered a ComplexRoute
  {
    this.Data.isEVT=true;//done to match the other page 
    this.Routes.FindPlan(cardDat);
    this.Data.isEVT=false;
    this.Data.ComplexRoute=true;//set complexroute to be true 
    this.Data.Destination=cardDat;//set the destination as the card that was selected 
    this.navCtrl.push(NextStepsPage);//push the user to the map page to see the route 
  } 
}

