import { Injectable } from '@angular/core';
import { normalizeURL, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

//https://www.brainfever.co.uk/2018/02/05/how-to-view-local-pdfs-in-ionic-on-android-and-ios/

/*
****************************
This requires adding the line
<preference name="android-targetSdkVersion" value="23" />
to the project config.xml otherwise Android 7 permissions don't allow opening the PDF file
****************************
We're going to use Platform for platform detection then:
Document Viewer for iOS
In App Browser for Android
window.open for browser
And finally normalizeURL to properly format the URL based on platform.
*/

@Injectable()
export class PdfViewerProvider {
constructor(private document:DocumentViewer, private iab:InAppBrowser, private file:File, public plt:Platform) {
}

openDocument(fileName) {
let assetDirectory='assets/pdf/';
console.log(this.plt);
console.log(assetDirectory);
// normal link for browser
if ( !this.plt.is('cordova') &&!this.plt.is('android') ) {
console.log('browser');
window.open(assetDirectory+fileName);
return;
}

// iOS and Android native
let filePath=this.file.applicationDirectory+'www/'+assetDirectory;
// android using in app browser which prompts native file opener
if (this.plt.is('android')) {
 this.file.copyFile(filePath, fileName, this.file.externalDataDirectory, fileName);
  // update the path variable
  filePath = this.file.externalDataDirectory;
  const browser = this.iab.create(normalizeURL(filePath + fileName), '_system', 'location=yes');
  browser//get rid of the warning without causing an error 
}

// ios use ionic document viewer because it's a nicer ux
else if (this.plt.is('ios')) {
const options= {
title:'My PDF',
documentView : {
closeLabel :'DONE'
},

navigationView : {
closeLabel :'DONE'
},
email : {
enabled :true
},
print : {
enabled :false
},
openWith : {
enabled :true
},
bookmarks : {
enabled :false
},
search : {
enabled :false
},
autoClose: {
onPause :true
}
}
console.log(filePath+fileName);
const viewer=this.document.viewDocument(filePath+fileName, 'application/pdf', options);
console.log(viewer);
}
}


}