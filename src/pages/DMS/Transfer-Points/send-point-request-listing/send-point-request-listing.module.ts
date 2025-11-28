import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendPointRequestListingPage } from './send-point-request-listing';

@NgModule({
  declarations: [
    SendPointRequestListingPage,
  ],
  imports: [
    IonicPageModule.forChild(SendPointRequestListingPage),
  ],
})
export class SendPointRequestListingPageModule {}
