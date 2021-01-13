import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser'; 

/**
 * Generated class for the HtmlpipePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'htmlpipe',
})
export class HtmlPipe implements PipeTransform {
  constructor(private sanitizer:DomSanitizer){}
  
  transform(html){
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
