import { Injectable } from '@angular/core';
import { normalizeURL, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

/*
****************************
This requires adding the line
<preference name="android-targetSdkVersion" value="23" />
to the project config.xml otherwse Android 7 permissions don't allow opening the PDF file
****************************
We're going to use Platfrom for platffrom detection then:
Document Viewer for iOS
In App Browser for Android
window.open for browser
And finally normalizeURL to propwerly format the URL based on platfrom.
*/

@Injectable()
export class PdfViewerProvider {
constructor(private document:DocumentViewer, private iab:InAppBrowser, private file:File, public plt:Platform) {
console.log('Hello PdfViewerProvider Provider');
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
let theMove=this.file.copyFile(filePath, fileName, this.file.externalDataDirectory, fileName);
filePath=this.file.externalDataDirectory;
console.log(filePath+fileName);
const browser=this.iab.create(normalizeURL(filePath+fileName), '_blank');
console.log(browser);
}

// ios use ionic document viewer becasue it's a nicer ux
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