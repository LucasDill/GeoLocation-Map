import { Component, AfterViewInit, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';

/**
 * Generated class for the ExpandComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'expand',
  templateUrl: 'expand.html'
})
export class ExpandComponent {

  @ViewChild("expandWrapper", {read: ElementRef}) expandWrapper: ElementRef;
  @Input("expanded") expanded:boolean=false;
  @Input("expandHeight") expandHeight:string="150px";
  text: string;

  constructor(public renderer: Renderer2 ) {
 
  }
ngAfterViewInit(){
  this.renderer.setStyle(this.expandWrapper.nativeElement,"max-height",this.expandHeight);
}
}
