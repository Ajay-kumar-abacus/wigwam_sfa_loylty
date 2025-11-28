import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransferRequestListingPage } from './transfer-request-listing';

@NgModule({
  declarations: [
    TransferRequestListingPage,
  ],
  imports: [
    IonicPageModule.forChild(TransferRequestListingPage),
  ],
})
export class TransferRequestListingPageModule {}
